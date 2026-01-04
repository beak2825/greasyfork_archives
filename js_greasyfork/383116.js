// ==UserScript==
// @name         遇见监控
// @namespace    http://tampermonkey.net/
// @version      25.40 调整上报
// @description  个人专用
// @author       Yu
// @include      http://*.yytou.cn*
// @include      http://*.hero123.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383116/%E9%81%87%E8%A7%81%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/383116/%E9%81%87%E8%A7%81%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    var Watch = {
        nowTime: "",
        Week: "",
        Qu: "",
        KuafuKey: "36-40",
        quQQ: {
            "1": "291849393",
            "3": "527802601",
            "37": "465355403",
            // "37": "291849393",
            "38": "543582382"
        },
        qianlongCookies: 'qlCookies',
        userNameCookies: 'qlUser',
        cookiesName: {}
    };

    var toldIdTime = null;

    var questionList = [];

    // 连接酷Q服务
    window.watchWebSocket;

    function webSocketConnet() {
        // watchWebSocket = new WebSocket("ws://106.12.144.197:8001");
        // watchWebSocket = new WebSocket('ws://106.12.144.197:12345');
        watchWebSocket = new WebSocket('ws://81.70.145.184:12345');

        watchWebSocket.onerror = function (event) {
            console.log("本地服务出错");
            webSocketConnet();
        };

        watchWebSocket.onopen = function (event) {
            console.log("本地服务已开启");
            watchWebSocket.send(JSON.stringify({
                name: '监听机器人',
                type: 'setname'
            }));
            // if(getCorrectText("7598500,4259178,6965572,7598640,7905194")) {
            if (getCorrectText("4259178,6965572")) {
                // sendMsg("机器人123上线啦！", Watch.quQQ[Watch.Qu]);
                var text = getLocationStorage();
                if (text) {
                    questionList = JSON.parse(text);
                }
            }
        };

        watchWebSocket.onclose = function (event) {
            console.log("本地服务已关闭");
            webSocketConnet();
        };

        watchWebSocket.onmessage = function (event) {
            onMessage(event);
        };
    }
    function senWebMsg(msg) {
        watchWebSocket.send(JSON.stringify({
            message: msg,
            type: 'chat'
        }));
    }

    function onMessage(event) {

        var data = JSON.parse(event.data);
        
        if (data.type !== 'chatterList') {
            // console.log(data);
            var txt = data.message;
            var sendText = '';
            var id = '4253282(1)';
            if (data.name === '4253282') {
                if (txt.indexOf('go暴击') != '-1') {
                    goBaoji();
                    sendMsg('开始做暴击');
                }
                if (txt.indexOf('东方队伍') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/东方队伍'
                }
                if (txt.indexOf('欢迎入队') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/欢迎入队'
                }
                if (txt.indexOf('go幽冥3') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/go幽冥3'
                }
                if (txt.indexOf('go铁剑') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/go铁剑'
                }
                if (txt.indexOf('go白猿') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/go白猿'
                }
                if (txt.indexOf('go阎王') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/go阎王'
                }
                if (txt.indexOf('帮派副本1-1') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/帮派副本1-1'
                }
                if (txt.indexOf('帮派副本1-2') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/帮派副本1-2'
                }
                if (txt.indexOf('帮派副本1-3') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/帮派副本1-3'
                }
                if (txt.indexOf('帮派副本1-4') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/帮派副本1-4'
                }
                if (txt.indexOf('帮派副本2-') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/' + txt;
                }
                if (txt.indexOf('帮派副本3') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/帮派副本3'
                }
                if (txt.indexOf('三树') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/三树'
                }
                if (txt.indexOf('本10') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/本10'
                }
                if (txt.indexOf('双修') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/双修'
                }
                if (txt.indexOf('小号重进') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/小号重进'
                }
                if (txt.indexOf('小号跟随') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/小号跟随'
                }
                if (txt.indexOf('去柴绍') != '-1') {
                    sendText = 'tell u' + id + ' ASSIST/tell/去柴绍'
                }
                if (sendText) {
                    clickButton(sendText);
                }
            }
            if (txt.indexOf('清空') != '-1' || txt.indexOf('clear') != '-1') {
                clearQuestionList();
                sendMsg('已清空暴击列表');
            }
            if (txt.indexOf('暴击列表') != '-1' || txt.indexOf('list') != '-1') {
                var sendText = speakQuestionList();
                sendMsg(sendText);
            }
        }
    }

    var heartCheck = {
        timeout: 60000,// 10min
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            var self = this;
            this.timeoutObj = setTimeout(function () {
                sendToQQByName('2907344202111')
                // heartCheck.reset();
            }, this.timeout)
        },
    }

    function sendToQQByName(name, txt) {
        var json_str = {};

        txt = txt ? txt : '心跳';
        txt = txt.replace(/\n/g, "");

        json_str["act"] = "106";
        json_str["QQID"] = name;
        json_str["msg"] = txt;
        json_str = JSON.stringify(json_str);
        if (txt != '心跳'){
            console.log(txt)
        }
        // watchWebSocket.send(txt);
        senWebMsg(txt);
    }

    var delaytime = 2000;
    var delaySwitch = false;
    var delayMsgList = [];

    function delayMsg1(msg, groupid) {
        msg = msg.replace(/\n/g, "")
        senWebMsg(msg);
    }

    // 发送到QQ
    function sendMsg(msg, groupid) {
        senWebMsg(msg);
        // heartCheck.reset();
    }

    function delaySendMsg(msg, groupid) {
        senWebMsg(msg);
        // heartCheck.reset();
    }
    // 发送到QQ群814496367
    function sendMsgToQun(msg) {
        senWebMsg(msg);
    }
    // 发送到指定QQ
    function sendToQQ(msg) {
        senWebMsg(msg);
        // heartCheck.reset();
    }
    // 谜题奖励
    function geMiInfoByMoney(txt) {
        // txt = '完成谜题(14/15)：护山使者的谜题，获得：经验x1284940潜能x1001952银两x5668当前谜题密码：317775恭喜你，额外获得『秘籍木盒』x1恭喜你，额外获得朱果x1200，要黑棋子';
        var index = txt.split("/")[0].split("(")[1];
        var money = txt.split("银两x")[1];
        money = parseInt(money);
        if (money > 3000) {
            money = money / 2;
        }
        var msg = '';

        if (money >= 2400 && money < 2550) {
            msg = "有暴击卡该谜题做到16有果子吃。";
        }
        if (money >= 2550 && money < 2650) {
            msg = "有暴击卡该谜题做到15有果子吃。";
        }
        if (money >= 2650 && money < 2750) {
            msg = "有暴击卡该谜题做到14有果子吃,16有特1奖。";
        }
        if (money >= 2750 && money < 2800) {
            msg = "有暴击卡该谜题做到14有果子吃,15有特1奖。";
        }
        if (money >= 2800 && money < 2850) {
            msg = "有暴击卡该谜题做到13有果子吃,15有特1奖。";
        }
        if (money >= 2850 && money < 2900) {
            msg = "有暴击卡该谜题做到13有果子吃,15有特1奖,16有特2奖。";
        }
        if (money >= 2900 && money < 3100) {
            msg = "有暴击卡该谜题做到12有果子吃,13有特1奖,15有特2奖。";
        }
        if (money >= 3100) {
            msg = "有暴击卡该谜题做到11有果子吃,13有特1奖,14有特2奖。";
        }
        let newMsg = "";
        if (msg.length > 0) {
            newMsg = "提示:" + msg;
        }
        return newMsg;
    }

    function getName(txt) {
        var _name = "";
        // var ALLNAME =
        //     "碎片,花,草,梅,木,菊,晚香玉,仙客来,雪英,明月,烈日,斩龙,碧玉锤,撼魂锤,烛幽鬼煞锤,星月大斧,破冥斧,天雷断龙斧,霸王枪,赤焰枪,斩龙鎏金枪,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,诛仙剑,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣,九天龙吟剑,飞宇天怒刀,天罡掌套,小李飞刀,开天宝棍,达摩杖,乌金玄火鞭,龙皮至尊衣";
        var ALLNAME = "碎片,花,草,梅,木,菊,晚香玉,仙客来,雪英,斩龙,烛幽鬼煞锤,天雷断龙斧,斩龙鎏金枪,九天龙吟剑,飞宇天怒刀,天罡掌套,小李飞刀,开天宝棍,达摩杖,乌金玄火鞭,龙皮至尊衣";
        ALLNAME = ALLNAME.split(",");
        $.each(ALLNAME, function (n, v) {
            if (txt.indexOf(v) != "-1") {
                _name = v;
                return false;
            }
        });
        return _name;
    }
    function getNpcName(txt) {
        var _name = "";
        var _name = txt.split("听说")[1].split("出来")[0];
        return _name;
    }
    var qixiaObject =
        '{"林远图":{"type":"邪武","skills":"紫虚辟邪剑"},"厉工":{"type":"邪武","skills":"紫血大法"},"金轮法王":{"type":"邪武","skills":"龙象般若功"},"鸠摩智":{"type":"邪武","skills":"子母龙凤环"},"封寒":{"type":"邪武","skills":"左手刀法"},"卓凌昭":{"type":"邪武","skills":"神剑慧芒"},"厉若海":{"type":"邪武","skills":"燎原百击"},"乾罗":{"type":"邪武","skills":"魔冰玄鞭法"},"孙恩":{"type":"邪武","skills":"辟游龙剑"},"婠婠":{"type":"邪武","skills":"天魔妙舞"},"练霓裳":{"type":"邪武","skills":"九星定形针"},"成昆":{"type":"邪武","skills":"连幻阴指锤"},"侯希白":{"type":"邪武","skills":"折花百式"},"夜魔":{"type":"邪武","skills":"青冥血斧"},"柯镇恶":{"type":"侠客","skills":"降魔杖法"},"哈玛雅":{"type":"侠客","skills":"飞鸿鞭法"},"乔峰":{"type":"侠客","skills":"降龙廿八掌"},"卢云":{"type":"侠客","skills":"正道十七"},"虚竹":{"type":"侠客","skills":"无相六阳掌"},"徐子陵":{"type":"侠客","skills":"九字真言印"},"虚夜月":{"type":"侠客","skills":"月夜鬼萧"},"云梦璃":{"type":"侠客","skills":"云梦归月"},"花无缺":{"type":"侠客","skills":"移花接玉刀"},"风行烈":{"type":"侠客","skills":"冰月破魔枪"},"黄药师":{"type":"侠客","skills":"弹指神通"},"洪七公":{"type":"侠客","skills":"打狗棒法"},"石破天":{"type":"侠客","skills":"白首太玄经"},"宁不凡":{"type":"侠客","skills":"不凡三剑"},"独孤求败":{"type":"侠客","skills":"独孤斧诀"},"庞斑":{"type":"魔尊","skills":"天魔策"},"杨肃观":{"type":"魔尊","skills":"六道轮回"},"欧阳锋":{"type":"魔尊","skills":"九阴逆"},"叶孤城 ":{"type":"魔尊","skills":"天外飞仙"},"燕狂徒":{"type":"魔尊","skills":"玉石俱焚"},"逍遥子":{"type":"宗师","skills":"长春不老功"},"李寻欢":{"type":"宗师","skills":"小李飞刀"},"令东来":{"type":"宗师","skills":"神龙东来"},"宋缺":{"type":"宗师","skills":"天刀八诀"},"楚留香":{"type":"宗师","skills":"踏月留香"},"王语嫣":{"type":"门客","skills":"玩家悟性+5"},"范蠡":{"type":"门客","skills":"果园收成增加50%"},"程灵素":{"type":"门客","skills":"神农小筑炼药成功率+30%"},"水灵光":{"type":"门客","skills":"玩家福缘+10"},"霍青桐":{"type":"门客","skills":"玩家回血效率+10%"},"石青璇":{"type":"门客","skills":"玩家行动效率+2%"},"李红袖":{"type":"门客","skills":"每小时给玩家增加20武林声望"},"宋玉致":{"type":"门客","skills":"玩家攻击+5%"},"华佗":{"type":"门客","skills":"玩家气血+10%"},"鲁妙子":{"type":"门客","skills":"玩家悟性+5"},"顾倩兮":{"type":"门客","skills":"玩家的颜值每24小时增加5点"},"水笙":{"type":"门客","skills":"玩家防御+10%"},"林仙儿":{"type":"门客","skills":"每小时给玩家增加白银宝箱"},"郭襄":{"type":"门客","skills":"玩家敏捷+10%"},"程瑛":{"type":"门客","skills":"玩家命中+10%"},"任盈盈":{"type":"门客","skills":"玩家身法+10"},"阿朱":{"type":"门客","skills":"金矿产出翻倍"},"袁紫衣":{"type":"门客","skills":"玩家杀气不会高于5000"},"赵敏":{"type":"门客","skills":"玩家根骨+10"},"小昭":{"type":"门客","skills":"玩家臂力+10"},"韦小宝":{"type":"门客","skills":"玩家采矿产出加倍"}}';
    qixiaObject = JSON.parse(qixiaObject);
    function getUxDes(name) {
        return qixiaObject[name];
    }

    // 获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate =
            month +
            seperator1 +
            strDate +
            " " +
            date.getHours() +
            seperator2 +
            date.getMinutes() +
            seperator2 +
            date.getSeconds();
        return currentdate;
    }

    function getWeek() {
        var week = new Date().getDay();
        return week;
    }
    // 获取当前小时
    function getHours(times) {
        var date = new Date();
        if (times) date = new Date(times);
        var currentdate = date.getHours();
        return currentdate;
    }
    // 获取当前分
    function getMins(times) {
        var date = new Date();
        if (times) date = new Date(times);
        var currentdate = date.getMinutes();
        return currentdate;
    }
    // 获取当前时分
    function getHM(times) {
        return getHours(times) + ':' + getMins(times);
    }

    function getTime() {
        var date = new Date();
        var currentdate = date.getTime();
        return currentdate;
    }

    function getCorrectText(txt) {
        var txtArr = txt.split(',');
        var url = window.location.href;
        var correctSwitch = false;
        for (var i = 0; i < txtArr.length; i++) {
            if (url.indexOf(txtArr[i]) != "-1") {
                correctSwitch = true;
            }
        }
        return correctSwitch;
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function getCorrectQu() {
        var url = window.location.href;
        var qu = null;
        if (url.indexOf("direct37") != "-1") {
            qu = 37;
        }
        if (url.indexOf("direct38") != "-1") {
            qu = 38;
        }
        if (getQueryString("area") == "1") {
            qu = 1;
            Watch.KuafuKey = "1-5";
        }
        if (getQueryString("area") == "3") {
            qu = 3;
            Watch.KuafuKey = "1-5";
        }
        if (getQueryString("area") == "37") {
            qu = 37;
        }
        if (getQueryString("area") == "38") {
            qu = 38;
        }
        return qu;
    }

    // 根据id查找name
    function returnName() {
        let ID = getQueryString("id");
        var map = {
            "4253282": "挑灯夜战",
            "4259178": "37区小号",
            "6965572": "1区挂机号",
            // "7598640": "1区小号"
        };
        return map[ID] ? map[ID] : ID;
    }

    //去暴击
    function goBaoji() {
        var id = getCookie('myId');
        if (id) {
            sendText = 'tell u' + id + ' ASSIST/baoji/go'
            clickButton(sendText);
        }
    }
    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + 100);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }
    function getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }
    function getIndexFromArr(txt, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (txt.indexOf(arr[i]) != '-1') {
                return i
            }
        }
        return null
    }

    function showUser() {
        var thisCookies = getCookie(Watch.userNameCookies)
        sendToQQByName('35994480', thisCookies);
    }
    function jinlinWatch(txt, obj) {
        var text = txt.split('获得')[1];
        if (text) {
            text = getNowFormatDate() + '->' + obj.nick + '获得' + text;
            sendToRecord(text);
        }
    }
    function reSpeckWord(txt) {
        txt = txt.replace('告诉你：ASSIST/reTell/', "");
        if (txt) {
            var text = getNowFormatDate() + '->' + txt;
            sendToRecord(text);
        }
    }

    function sendToRecord(txt, type) {
        log(txt);
        sendMsg(txt);
    }

    function setUserData() {
        var thisCookies = getCookie(Watch.userNameCookies)
        if (!thisCookies) {
            return false;
        }
        Watch.cookiesName = JSON.parse(thisCookies)
    }
    function createButton() {

        var Button1 = document.createElement('button');
        Button1.innerText = '展示玩家';
        Button1.style.position = 'absolute';
        Button1.style.zIndex = '10';
        Button1.style.right = '100px';
        Button1.style.top = '30px';
        Button1.style.width = '120px';
        Button1.style.height = '20px';
        Button1.className = 'btn-add';
        Button1.id = 'btnOnTime';
        document.body.appendChild(Button1);
        Button1.addEventListener('click', showUser);
    }

    setUserData();

    function saveLocationStorage() {
        localStorage.setItem("question", JSON.stringify(questionList));
    }

    function getLocationStorage() {
        return localStorage.getItem("question");
    }

    function clearLocationStorage() {
        localStorage.setItem("question", '[]');
    }

    // 列表存储暴击
    function saveQuestionList(txt) {
        if (txt.indexOf('--') < 0 && !hasSameQuestion(txt)) {
            questionList.push(getTime() + '毫秒' + txt.split(')：')[1]);
            checkQuestionTime();
        }
    }

    function hasSameQuestion(txt) {
        var hasSame = false;
        if (questionList.length > 0) {
            questionList.forEach(item => {
                var name = item.split('毫秒')[1].split('的谜题')[0];
                var place = item.split('位置：')[1].split('首步：')[0];
                var name1 = txt.split('的谜题')[0];
                var place1 = txt.split('位置：')[1].split('首步：')[0];
                if (name == name1 && place == place1) {
                    hasSame = true;
                }
            })
        }
        return hasSame;
    }

    function checkQuestionTime() {
        var times = getTime();
        if (questionList.length > 0) {
            questionList = questionList.filter(item => {
                var times1 = item.split('毫秒')[0];
                if (times * 1 < times1 * 1 + 3 * 60 * 60 * 1000) {
                    return item;
                }
            })
        }
        saveLocationStorage();
    }

    // function testFilter(){
    //     var arr = [1,2,3,4,5,6,7,8];
    //     var times = '7';
    //     arr = arr.filter(item =>{

    //         if(times*1> item){
    //             return item;
    //         }
    //     })
    //     console.log(arr)
    // }

    function speakQuestionList() {
        var sendText = '暂无'
        var newList = [];
        if (questionList.length > 0) {
            questionList.forEach((item, index) => {
                var times = item.split('毫秒')[0];
                var newTime = getHM(Number(times));
                var txt = newTime + item.split('毫秒')[1];
                newList.push(index * 1 + 1 + '、' + txt);
            })
            sendText = '现有列表:<br/>'+ newList.join('</br>');
        }
        console.log(sendText)
        return sendText
        // sendMsg(sendText, Watch.quQQ[Watch.Qu]);
    }

    // 列表存储暴击
    function clearQuestionList() {
        //questionList
        questionList = [];
        clearLocationStorage();
    }

    // cookies存储id
    function saveMyId(txt) {
        var id = txt.split('myId/')[1].trim();
        setCookie('myId', id);
        toldIdTime = new Date().getTime();
    }

    var attach = null;
    var qlMon = new QinglongMon();

    function QinglongMon() {
        this.dispatchMessage = function (b) {
            var type = b.get("type");
            var ctype = b.get("ctype");
            var msg = b.get("msg");
            var subtype = b.get("subtype");
            if (type == 'main_msg' && ctype == 'text' && /：ASSIST\//.test(msg)) {
                var msgArr = msg.split('u')[1].split('');
                var id = msgArr[0];
                var txt = g_simul_efun.replaceControlCharBlank(
                    msg.replace(/\u0003.*?\u0003/g, "")
                );
                var name = txt.split('告诉你')[0];
                let obj = { fromQQ: id, nick: name }
                // if (msg.indexOf('潜龙') > 0) {
                //     if (msg.indexOf('add') > 0) {
                //         biaoji(txt, obj, true)
                //     }
                //     if (msg.indexOf('del') > 0) {
                //         clearBiaoJiByName(txt, obj, true)
                //     }
                //     if (msg.indexOf('get') > 0) {
                //         sendQianlong(obj)
                //     }
                // }
                if (msg.indexOf('锦鲤') > 0) {
                    if (msg.indexOf('add') > 0) {
                        jinlinWatch(txt, obj)
                    }
                }
                if (msg.indexOf('reTell') > 0) {
                    reSpeckWord(txt)
                }
                // if (msg.indexOf('XUESHAN') > 0) {
                //     if (msg.indexOf('find') > 0) {
                //         var txt = g_simul_efun.replaceControlCharBlank(
                //             msg.replace(/\u0003.*?\u0003/g, "")
                //         );
                //         var sendText = getNowFormatDate() + txt.split('find/')[1];
                //         sendToRecord(sendText);
                //     }
                // }
                return;
            }
            if (type == 'main_msg' && ctype == 'text' && /：QUESTION\//.test(msg)) {
                var msgArr = msg.split('u')[1].split('');
                var id = msgArr[0];
                var txt = g_simul_efun.replaceControlCharBlank(
                    msg.replace(/\u0003.*?\u0003/g, "")
                );
                
                if (txt.indexOf('new') > 0) {
                    sendMsgToQun(txt);
                    saveQuestionList(txt);
                }
                if (txt.indexOf('myId') > 0) {
                    saveMyId(txt);
                }
                return;
            }
            if (type == "disconnect") {
                Watch.nowTime = getNowFormatDate();
                var json_str =
                    Watch.nowTime +
                    ":" +
                    Watch.Qu +
                    "区账号" +
                    returnName() +
                    "掉线了";
                sendToQQ(json_str);
            }

            if (!msg) {
                return;
            }
            if (getCorrectText("4259178,6965572")) {
                msg = g_simul_efun.replaceControlCharBlank(
                    msg.replace(/\u0003.*?\u0003/g, "")
                );
                channelWatch(msg, type);
            }
        };
    }

    var sendTimer = null;
    var msgList = [];
    function delayMsg(msg) {
        msgList.push(msg);
        if (sendTimer) clearTimeout(sendTimer);
        sendTimer = setTimeout(() => {
            getDelayData(msgList)
        }, 2000);
    }
    //【系统】雪乱江湖：雪山派弟子白衣神君哈哈大笑：大爷来了，把值钱的都交出来!
    // function getDelayData(list) {
    //     var nameArr = [];
    //     for (var i = 0; i < list.length; i++) {
    //         var name = list[i].split('弟子')[1].split('哈哈大笑')[0];
    //         nameArr.push(name);
    //     }
    //     if (nameArr.length > 0) {
    //         var txt = getNowFormatDate() + '-雪山弟子:' + nameArr.join('、');
    //         delayMsg1(txt);
    //         msgList = [];
    //     }
    // }

    function channelWatch(txt, type) {
        // console.log(txt)
        var isK = "";
        var msg = "";
        var name = "";
        var commenGroupId = '';
        var json_msg = '';
        Watch.nowTime = getNowFormatDate();
        var hours = getHours();
        // sendToQQ(txt);
        // sendMsg(txt, Watch.quQQ[Watch.Qu]);
        if (txt.indexOf("劳模英豪") != "-1") {
            return;
        }
        if (txt.indexOf("新区") != "-1") {
            return;
        }
        if (txt.indexOf("服跨服") != "-1") {
            // return;
        }

        // if (
        //     txt.indexOf("当前暴击扫荡地图") != "-1" &&
        //     txt.indexOf("跨服") == "-1"
        // ) {
        //     json_msg = txt.split("，")[1];
        //     // sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
        //     return;
        // }
        if (txt.indexOf("完成谜题") != "-1" && txt.indexOf("跨服") == "-1") {
            // 暴击提示
            json_msg =
                Watch.nowTime + "的谜题-->" + txt + geMiInfoByMoney(txt);
            // sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
            return;
        }
        var newSplitArr = txt.split("：");
        if (newSplitArr.length > 3) {
            return;
        }
        if (txt.indexOf("被火麒麟王杀死") != "-1") {
            // sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }
        if (txt.indexOf("东方大人被") != "-1") {
            sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }

        if (txt.indexOf("白虎赌坊") != "-1") {
            // sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }
        if (txt.indexOf("设下道场") != "-1") {
            sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }
        if (txt.indexOf("帮派风云战") != "-1" && txt.indexOf('[' + Watch.Qu + '区' + ']') != "-1") {
            sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }
        if (txt.indexOf("帮派风云战") != "-1" && txt.indexOf('[' + Watch.Qu + '区' + ']') != "-1") {
            sendMsg(txt, Watch.quQQ[Watch.Qu]);
            return;
        }

        if (txt.indexOf(Watch.KuafuKey) != "-1") {
            isK = "跨服";
            return
        }
        if (txt.indexOf("青龙会组织") != "-1") {
            name = getName(txt);
            msg = "青龙";
        }

        if (txt.indexOf("二娘对着") != "-1" || txt.indexOf("二娘正在行凶") != "-1") {
            msg = "zhengxie";
        }
        if (txt.indexOf("游侠会") != "-1") {
            msg = "游侠";
        }
        
        if (txt.indexOf("判师而出") != "-1" && type == "channel") {
            if (txt.indexOf('系统') == '-1') {
                return false;
            }
            if (txt.indexOf('风际中') > '-1') {
                return false;
            }
            if (txt.indexOf('顾惜朝') > '-1') {
                return false;
            }
            if (hours > 5 && hours < 18){
                if (txt.indexOf('荆无命') > '-1') {
                    return false;
                }
                sendJiangHu(txt)
            }else if(hours >= 18){
                sendJiangHu(txt)
            }
            return false
        }

        // 【系统】跨服：[36-40区]云老四逃到了跨服时空十二盘之中，众位英雄快来诛杀。
        // 【系统】跨服：[36-40区]岳老三逃到了跨服时空朱雀门之中，众位英雄快来诛杀。
        // 【系统】跨服：[36-40区]二娘逃到了跨服时空华山山脚之中，众位英雄快来诛杀。
        // 【系统】跨服：[36-40区]段老大逃到了跨服时空林中小路之中，众位英雄快来诛杀
        //【系统】二娘：老子懒得陪你们玩了！
        //【系统】二娘慌不择路，逃往了华山村-华山村村口
        if (txt.indexOf("段老大逃到了跨服时空") != "-1") {
            msg = "跨服逃犯";
        }

        if (txt.indexOf("慌不择路") != "-1") {
            msg = "逃犯";
        }

        if (hours == 5) {
            // clearBiaoJi();
            clearQuestionList();
        }

        if (msg == "青龙" && type == "channel") {
            if (hours == 6) {
                caiCha()
            }
            if (name != "") {
                json_msg =
                    Watch.Qu + "区" + "青龙：" + Watch.nowTime + "-" + txt;

                if (isK == "跨服") {
                    json_msg = isK + "青龙：" + Watch.nowTime + "-" + txt;
                }

                delayMsg1(json_msg, Watch.quQQ[Watch.Qu]);
                // if (Watch.Qu == "3") {
                //     sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
                // }

                // if (Watch.Qu == "37") {
                //     commenGroupId = "291849393";
                //     sendMsg(json_msg, commenGroupId);
                // }

                // if (Watch.Qu == "38") {
                //     sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
                // }
            }
        }

        if (msg == "游侠") {
            if (hours == 6) {
                caiCha()
            }
            json_msg = Watch.Qu + "区" + "游侠：" + Watch.nowTime + "-" + txt;
            // commenGroupId = "291849393";
            var uname = getNpcName(txt);
            var qixiaObj = getUxDes(uname);
            var new_json_msg = json_msg.replace(
                uname,
                uname + "「" + qixiaObj.type + "-" + qixiaObj.skills + "」"
            );
            if (hours > 5) {
                delayMsg1(new_json_msg, Watch.quQQ[Watch.Qu]);
            }
            if (Watch.Qu == "1") {
                // if (txt.indexOf('花无缺') > 0 || txt.indexOf('虚竹') > 0 || txt.indexOf('宁不凡') > 0 || txt.indexOf('云梦璃') > 0 || txt.indexOf('石破天') > 0 || txt.indexOf('宋缺') > 0 || txt.indexOf('乔峰') > 0 ){
                //     sendToQQ(new_json_msg);
                //     sendToQQByName('35994480', new_json_msg);
                //     sendToQQByName('35994480', new_json_msg);
                // }
            }
        }

        if (msg == "跨服逃犯") {
            if (Watch.Week == "4") {
                json_msg =
                    "跨服逃犯->通缉段老大-->" + Watch.nowTime + ",内容:" + txt;
                // sendMsg(json_msg, "465355403");
            }
        }

        if (msg == "逃犯") {
            if (hours == 6) {
                caiCha()
            }
            json_msg = Watch.Qu + "区逃犯->" + Watch.nowTime + ",内容:" + txt;
            // if (Watch.Qu == "3") {
            //     if (txt.indexOf("二娘") > 0 || txt.indexOf("段老大") > 0) {
            //         sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
            //     }
            // }
            if (txt.indexOf("二娘") > 0 && txt.indexOf("夜魔") < 0) {
                // sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
                // if (Watch.Qu == "38") {
                //     sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
                // }
                // if (Watch.Qu == "37") {
                //     commenGroupId = "291849393";
                //     sendMsg(json_msg, commenGroupId);
                // }
            }
            if (txt.indexOf("夜魔") > 0) {
                // sendMsg(json_msg, Watch.quQQ[Watch.Qu]);
            }
            // if (txt.indexOf("老三") > 0 && txt.indexOf("夜魔") < 0) {
            //     if (Watch.Qu == "37") {
            //         commenGroupId = "291849393";
            //         sendMsg(json_msg, commenGroupId);
            //     }
            // }
        }

        if (msg == "zhengxie") {
            json_msg =
                Watch.Qu + "区zhengxie->" + Watch.nowTime + ",内容:" + txt;
            if (Watch.Qu == "37") {
                // var commenGroupId = "291849393";
                // sendMsg(json_msg, commenGroupId);
            }
        }
    }

    function sendJiangHu(txt) {
        var msg_type = '门派';
        var place = '';
        var npc = '';

        if (txt.indexOf("流派") != "-1") {
            msg_type = '流派';
        }
        // 【系统】【江湖纷争】：丐帮、铁雪山庄、少林派门派的顾惜朝剑客伤害同门，欺师灭组，判师而出，却有九阴派、风花牧场、荣威镖局坚持此种另有别情而强行庇护，两派纷争在花街-花街一触即发，江湖同门速速支援！
        // 【系统】【江湖纷争】：道、儒流派的荆无命剑客伤害同门，欺师灭组，判师而出，却有释坚持此种另有别情而强行庇护，两派纷争在华山-剑冢一触即发，江湖同门速速支援！
        var npcName = txt.split('派的')[1].split('剑客伤害')[0];
        var vs1 = txt.split('：')[1].split('派的')[0];
        var vs2 = txt.split('却有')[1].split('坚持')[0];
        var place = txt.split('两派纷争在')[1].split('一触即发')[0];

        var newText = msg_type + '：' + npcName + '叛逃，引起' + msg_type + '纠纷，' + vs1 + 'VS' + vs2 + '在' + place + '打起来了';

        var json_msg =
            Watch.Qu + "区 " + Watch.nowTime + "->" + newText;

        delayMsg1(json_msg, Watch.quQQ[Watch.Qu]);
    }
    function caiCha() {
        clickButton('diaoyu');
    }
    function log(text) {
        var msg = new Map();
        msg.put('type', 'main_msg');
        msg.put('ctype', 'text');
        msg.put('msg', HIG + text);
        _dispatch_message(msg);
        // console.log(text);
    }
    function connectYujian() {
        attach = (function () {
            if (!window.webSocketMsg) {
                return false;
            }
            console.log("连接遇见成功！");
            window._dispatch_message = webSocketMsg.prototype.watch = window.gSocketMsg.dispatchMessage;
            gSocketMsg.dispatchMessage = function (b) {
                this.watch(b);
                qlMon.dispatchMessage(b);
            };
        })();
    }
    function doOnTime(){
        var hours = getHours();
        if (hours == 10 || hours == 15) {
            var nowTime = new Date().getTime();
            console.log('toldIdTime:' + toldIdTime);
            console.log('nowTime:' +nowTime);
            if (toldIdTime && nowTime - toldIdTime > 30 * 60 * 1000){
                goBaoji();
                sendMsg('开始做暴击');
            }
        }
    }
    $(function () {
        Watch.Qu = getCorrectQu();
        Watch.Week = getWeek();
        webSocketConnet();
        connectYujian();
        createButton();
        setInterval(function () {
            doOnTime();
        }, 25 * 60 * 1000);
    })
})()
