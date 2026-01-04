// ==UserScript==
// @name         IdleTools
// @version      0.8.6
// @description  一键吃药|一键点亮|一键改造|一键合符文|一键血白
// @author       奶牛
// @match        https://www.idleinfinity.cn/Equipment/Query?*
// @match        https://www.idleinfinity.cn/Map/Detail?*
// @match        https://www.idleinfinity.cn/Equipment/Query?*
// @match        https://www.idleinfinity.cn/Equipment/Reform?*
// @match        https://www.idleinfinity.cn/Equipment/Material?*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1411581
// @downloadURL https://update.greasyfork.org/scripts/520888/IdleTools.user.js
// @updateURL https://update.greasyfork.org/scripts/520888/IdleTools.meta.js
// ==/UserScript==
(function () {
    getLibrary().then(data => {
        // console.log(data);
        addScriptToHead(data);
        async function asyncLanuch() {
            onLaunch();
        }
        asyncLanuch();
    }).catch((_url, xhr, status, error) => {
        alert('从(' + _url + ')获取数据失败!请确认重载', function () { location.reload(); });
    });
})();

function onLaunch() {
    //存储角色状态的key值
    const charStatus = "charStatus";
    //一键吃药记录的物品id
    const sanMedKey = "sanMedcineIds";

    const isClickOnline = "isClickOnline";

    //改造需要匹配的词条
    const reformKeyArr = "reformKeyArr";
    //改造白名单
    const reformWhiteList = [["血红", "转换"], ["雄黄", "转换"], ["血红", "白热"], ["雄黄", "白热"], ["雷云风暴", "陨石"], ["支配", "陨石"], ["冰封球", "陨石"]]
    //升级符文保留数量默认表
    const storedCompandDefault = {
        "夏-13#": 200,
        "多尔-14#": 200,
        "蓝姆-20#": 100,
        "普尔-21#": 1000,
        "乌姆-22#": 1000,
        "马尔-23#": 1000,
        "伊司特-24#": 1000,
        "古尔-25#": 1000,
        "伐克斯-26#": 1000,
        "欧姆-27#": 1000,
        "罗-28#": 1000,
        "瑟-29#": 1000,
        "贝-30#": 1000,
        "乔-31#": 1000,
        "查姆-32#": 1000,
        "萨德-33#": 1000,
    }
    class Idle {
        constructor() {

            this.cids = this.getCharacters();
            this.initCidStatus();
            this.initCurrentChar();
            this.loadPlugin();
        }

        cids = [];
        //当前用户
        currentId = 0;


        //获取所有账号
        getCharacters() {
            let all = [];
            $(".dropdown-menu.char-switch li[data-id]").each((index, item) => {
                let id = $(item).attr("data-id");
                all.push(id);
            });
            return all;
        }
        initCurrentChar() {
            let localtion = $("a:contains('消息')")[0].href;//消息中有当前id
            let url = new URL(localtion);
            let urlParams = new URLSearchParams(url.search);
            let id = urlParams.get("id");
            this.currentId = id;
            //在地图页面修正离线状态,其他页面每次刷新初始化都是在线状态 
            if (window.location.href.indexOf("Map/Detail") > -1) {
                var btns = $('a:contains("离线挂机")');
                var localObj = JSON.parse(localStorage.getItem(charStatus));
                if (btns.length == 0) {

                    localObj[id].isOnline = true;
                }
                else {
                    localObj[id].isOnline = false;
                }
                saveMergeStatus(localObj, charStatus);
            }

        }

        //初始化一些角色相关的对象
        initCidStatus() {
            var map = {};
            this.cids.forEach((item, index) => {
                var obj = {};
                obj[item] = { isOnline: true, }
                saveMergeStatus(obj, charStatus);
            });
        }


        online(callback) {
            setTimeout(() => {
                $.ajax({
                    type: "POST", // 或者 "GET"，根据实际情况选择
                    url: "BattleGuaji",
                    data: $("form").serialize(),
                    success: function (response) {
                        if (callback) callback();
                        location.reload();
                    }
                });
            }, 1000)

        }

        switchCharacter(id) {
            if (!!!id) return;
            setTimeout(() => {
                location.href = `https://www.idleinfinity.cn/Map/Detail?id=${id}`;
            }, 1000)

        }
        //开始循环点亮
        onlineLoop() {
            let isStart = localStorage.getItem(isClickOnline);
            if (!!!isStart) return;//没有点击启动则不开始自动点亮
            var localObj = JSON.parse(localStorage.getItem(charStatus));
            for (let id in localObj) {
                let item = localObj[id];
                if (this.currentId == id) {
                    if (!item.isOnline) {
                        this.online(() => {
                            var cIndex = this.cids.indexOf(this.currentId);
                            this.switchCharacter(this.cids[++cIndex]);
                        });
                    }
                    else {
                        var cIndex = this.cids.indexOf(this.currentId);
                        this.switchCharacter(this.cids[++cIndex]);
                    }

                }
            }
            if (this.currentId == this.cids[this.cids.length - 1]) {
                localStorage.removeItem(isClickOnline);
            }
        }




        loadReformPlugin() {
            if (location.href.indexOf("Equipment/Reform") == -1) {
                localStorage.removeItem(reformKeyArr);
                return;
            }
            var container = $(".panel-heading:eq(1)");
            var span1 = $("<span>", {
                text: "目标词条1:"
            });
            var input1 = $("<input>", {
                type: "text",
                placeholder: "输入匹配词条",
                style: "color:#000",
                id: "txtTarget1"
            })
            var input2 = $("<input>", {
                type: "text",
                placeholder: "输入匹配词条",
                style: "color:#000",
                id: "txtTarget2"
            })


            container.append(span1)
            container.append(input1)
            var span2 = $("<span>", {
                text: "目标词条2:",

            });
            container.append(span2)
            container.append(input2)

            var span3 = $("<span>", {
                text: "改造公式:"
            });
            var opt = $("<select>", {
                id: "optType",
            })
            // 添加option元素
            var options = [
                { text: '蓝装+14#', value: '30' },
                { text: '蓝装+13#', value: '20' },
                { text: '蓝装+12#', value: '10' },
                { text: '蓝装+绿|钻宝石', value: '11' },
                { text: '蓝装+21#', value: '26' },
                { text: '套装+23#', value: '16' },
                { text: '套装+21#', value: '17' },
                { text: '稀有+22#', value: '27' },



            ];
            //需要一个保留清单 洗出值钱的其他东西保留

            $.each(options, function (i, option) {
                opt.append($('<option></option>').text(option.text).attr('value', option.value));
            });
            container.append(span3);
            container.append(opt);

            var btn = $('<button>', {
                'class': 'btn btn-default btn-xs dropdown-toggle',
                'text': '开始改造',
                'style': "margin-left:20px",
                'id': "btnReform",
                click: () => {
                    var t1 = $("#txtTarget1").val();
                    var t2 = $("#txtTarget2").val();
                    var optType = $("#optType").val();
                    var arr = this.saveAffixToArr([t1, t2, optType]);
                    saveMergeStatus(arr, reformKeyArr);
                    this.reformAuto();
                }
            });
            container.append(btn);
            this.reformAuto();

        }

        reform(type, callback) {
            $("#form input[name='type']").val(type);
            $.ajax({
                type: "POST", // 或者 "GET"，根据实际情况选择
                url: "EquipReform",
                data: $("form").serialize(),
                success: function (response) {
                    if (callback) {
                        callback();
                    }
                    else {
                        location.reload();
                    }
                }
            });

        }
        reformAuto() {

            var localStr = localStorage.getItem(reformKeyArr);
            if (!!!localStr) return;//去掉本地存储就停止
            var arr = JSON.parse(localStr);
            $("#txtTarget1").val(arr[0]);
            $("#txtTarget2").val(arr[1]);
            $("#optType").val(arr[2]);
            let affix = this.getAffix();
            if (!!affix) {
                $("#affix").val(affix);
                this.setAffixCheckbox(affix);
            }
            //检测一下是否匹配
            var text = $(".equip")[0].innerText;
            if (text.indexOf(arr[0]) > -1 && text.indexOf(arr[1]) > -1) {
                localStorage.removeItem(reformKeyArr);
                confirm("出现了！", function () {

                });
                return;
            }
            if (this.checkWhiteList(text)) {
                localStorage.removeItem(reformKeyArr);
                confirm("出现了白名单物品!", function () {

                });
                return;
            }
            setTimeout(() => {
                this.reform(arr[2]);
            }, 1500)


        }
        checkWhiteList(text) {
            for (let i = 0; i < reformWhiteList.length; i++) {
                var isMatch = true;//满足一组条件才算命中
                for (let j = 0; j < reformWhiteList[i].length; j++) {
                    var condition = reformWhiteList[i][j];
                    if (text.indexOf(condition) == -1) {

                        isMatch = false;
                        break;
                    }
                }
                if (isMatch) {
                    return true;
                }
            }
            return false;
        }
        getAffix() {
            var arr = JSON.parse(localStorage.getItem(reformKeyArr));
            var affixArr = arr.splice(3);
            if (affixArr.length == 0) return "";
            return affixArr.join(",");
        }

        //勾选选中的
        setAffixCheckbox(affixStr) {
            var arr = affixStr.split(",");
            arr.forEach((item, index) => {
                var fillter = `.affix-select[data-name='${item}']`
                $(fillter).prop('checked', true);
            })
        }
        //保存勾选框
        saveAffixToArr(arr) {

            $(".affix-select").each((index, item) => {
                var isChecked = $(item).prop("checked");
                if (isChecked) {
                    arr.push($(item).attr("data-name"));
                }
            })
            return arr;
        }
        //改造返回储藏箱
        reformBackToBag() {
            $("a:contains('返回')")[0].click();
        }




        loadPlugin() {
            //自动吃药
            loadSanPlugin();
            //电量
            loadOnlinePlugin();
            //自动改造
            this.loadReformPlugin();
            loadStorePlugin();
        }

    }

    let _idle = new Idle();
    _idle.onlineLoop();



    //载入吃药插件
    function loadSanPlugin() {
        var equipArr = [];//所有装备的id;
        var sanRestoreMap = {};//回复药水所处在数组中的index
        $(".equip-box .equip-name .unique[data-id]").each(function (index, item) {
            var name = $(this)[0].innerText;
            if (name.indexOf("药水") > -1) {
                sanRestoreMap[index] = item;
            }

        })
        if (countProperties(sanRestoreMap) > 0) {
            var btn = $('<button>', {
                'class': 'btn btn-default btn-xs dropdown-toggle',
                'text': '一键吃药',
                'id': "btnSanRestore"
            });
            var numInput = $('<input>', {
                'style': "width:120px;line-height:18px;",
                'placeholder': '请填写要吃的数量',
                'id': 'sanNumTxt'
            });
            $(".panel-heading:eq(2) .pull-right").append(btn);
            $(".panel-heading:eq(2) .pull-right").append(numInput);
        }
        $(".equip-box .equip-use[data-id]").each(function (index, item) {

            let id = $(item).attr("data-id");
            equipArr.push(id);
        });

        useSan();//缓存中计数吃药
        $("#btnSanRestore").on("click", function () {
            var count = 0;
            var sanMedcineIds = [];
            var num = $("#sanNumTxt").val() * 1;
            if (Number.isNaN(num) || num <= 0) {
                alert("请填写正确的数量");
                return;
            }
            for (let key in sanRestoreMap) {

                if (count < num) {
                    sanMedcineIds.push(equipArr[key]);
                }

                count++;
            }
            localStorage.setItem(sanMedKey, sanMedcineIds);
            useSan();
        });

        //自动吃掉本地存储sanMedcineIds里面的药
        function useSan() {
            let medcine = localStorage.getItem(sanMedKey);
            if (medcine == null) return;
            let arr = medcine.split(',');
            if (!!!arr[0]) return;
            use(arr[0], function () {
                arr.splice(0, 1);
                localStorage.setItem(sanMedKey, arr);
            });
        }

    }

    //载入上线脚本
    function loadOnlinePlugin() {
        var btns = $('a:contains("离线挂机")');
        if (btns.length == 0) {
            return;
        }
        var container = $(".panel-inverse .panel-footer .pull-right:first");
        var btn = $('<button>', {
            'class': 'btn btn-default btn-xs dropdown-toggle',
            'text': '一键点亮',
            'id': "btnOnline"
        });
        container.append(btn);

        $("#btnOnline").on("click", function () {
            saveMergeStatus(true, isClickOnline);

            _idle.switchCharacter(_idle.cids[0]);//从第一个角色开始
        });

    }



    //使用道具
    function use(eid, callback) {
        $.ajax({
            url: "EquipUse",
            type: "post",
            data: {
                cid: $("#cid").val(),
                eid: eid,
                __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
            },
            dataType: "html",
            success: function (result) {
                callback();
                location.reload();
            },
            error: function (request, state, ex) {
                console.log(result)
            }
        });
    }

    function countProperties(obj) {
        let count = 0;
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }


    //#region 符文插件

    //载入符文插件
    function loadStorePlugin() {
        if (location.href.indexOf("Equipment/Material") == -1) {
            return;
        }

        var compandMode = false;
        var autoCompandMode = false;
        var storedRuneCounts = {}; // 存储每个符文项的数量
        var storedCompandCounts = {}; // 合成每个符文项的保留数量

        function showChange() {
            var lastCompandRuneId = parseInt(localStorage.getItem('lastCompandRuneId'));
            //刷新页面前正在运行一键升级符文逻辑，且符文检查没有运行完
            if (!lastCompandRuneId.isNaN && lastCompandRuneId >= 0 && lastCompandRuneId < 33) {
                autoCompandMode = true;
            }

            console.log("上次自动升级符文id：" + lastCompandRuneId + "----是否进入自动升级模式：" + autoCompandMode);
            //一键升级模式
            if (autoCompandMode) {
                var curCompandRuneId = lastCompandRuneId + 1;
                $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function () {
                    var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span
                    var runeCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量

                    var storedCompandCounts = JSON.parse(localStorage.getItem('storedCompandCounts'));

                    var storedCount = storedCompandCounts[runeName];
                    if (storedCount.isNaN || storedCount == undefined)
                        storedCount = 0;
                    var regexResult = runeName.match(/-(\d+)#/);
                    var count = 0;
                    if (runeCount > storedCount) {
                        count = runeCount - storedCount;
                        count = count - count % 2;
                    }

                    if (regexResult[1] == curCompandRuneId) {
                        localStorage.setItem('lastCompandRuneId', regexResult[1]);
                        if (count > 1) {
                            //升级符文消息
                            compandStore(regexResult[1], count);
                        }
                        else {
                            showChange();
                        }
                        // return;
                    }
                });
                compandMode = true;
            }

            //设置升级保留数量模式
            if (compandMode) {
                // localStorage.setItem('storedCompandCounts', JSON.stringify(""));
                //默认保留数量
                var storedCompandCounts = JSON.parse(localStorage.getItem('storedCompandCounts')) || storedCompandDefault;
                $('.panel-heading:contains("符文") .rasdsky').remove();

                var confirmButton = $('<a class="btn btn-xs btn-default" id="confirmButton">确认</a>');
                var cancleButton = $('<a class="btn btn-xs btn-default" id="cancleButton">退出</a>');

                // 将按钮放入一个 div 中，并添加到 panel-heading 中
                var buttonContainer = $('<div class="pull-right rasdsky"></div>');
                buttonContainer.append(confirmButton);
                buttonContainer.append(cancleButton);

                $('.panel-heading:contains("符文")').append(buttonContainer);
                confirmButton.click(function () {
                    $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function () {
                        var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span
                        var runeCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量

                        var _inputElement = $(this).find('.rasdsky-input:first');
                        var cnt = parseInt(_inputElement.val());
                        if (storedCompandCounts.hasOwnProperty(runeName)) {
                            if (!cnt.isNaN && cnt != undefined) {
                                storedCompandCounts[runeName] = cnt;
                            }
                        }
                        else {
                            storedCompandCounts[runeName] = 0;
                        }
                        // var storedCount = storedCompandCounts[runeName];
                        // var regexResult = runeName.match(/-(\d+)#/);
                        // if (runeCount > storedCount) {
                        //     var count = runeCount - storedCount;
                        //     count = count - count % 2;
                        //     compandStore(regexResult[1], count);
                        // }
                    });
                    localStorage.setItem('storedCompandCounts', JSON.stringify(storedCompandCounts)); // 存储到 localStorage 

                    //进入一键升级模式
                    autoCompandMode = true;
                    localStorage.setItem('lastCompandRuneId', 0);
                    showChange();
                });
                cancleButton.click(function () {
                    compandMode = false;
                    autoCompandMode = false;
                    showChange();
                });

                $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function () {
                    var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span

                    var retainCount = 0;
                    if (storedCompandCounts.hasOwnProperty(runeName)) {
                        retainCount = storedCompandCounts[runeName];
                        if (retainCount == undefined || retainCount.isNaN)
                            retainCount = 0;
                    }
                    $(this).find('.rasdsky').remove();

                    var t = ($('<span>').text('  保留：').css('color', 'grey'));

                    var inputElement = $('<input class="rasdsky-input">').css({
                        "color": "grey",
                        "width": 120,
                        "height": 21,
                    });
                    inputElement.val(retainCount);
                    var p = $('<p class="rasdsky">');
                    p.append(t);
                    p.append(inputElement);

                    $(this).append(p)

                });
            }
            //查看变动数量模式
            else {

                $('.panel-heading:contains("符文") .rasdsky').remove();
                var storedRuneCounts = JSON.parse(localStorage.getItem('storedRuneCounts')) || {};
                console.log(storedRuneCounts);
                var storedTime = localStorage.getItem('storedTime');

                // 将按钮放入一个 div 中，并添加到 panel-heading 中
                var buttonContainer2 = $('<div class="pull-right rasdsky"></div>');

                // 创建展示存储时间的元素
                var timeDiv = $('<div class="pull-left rasdsky"></div>');
                var timeElement = $('<p>').text('存储时间: ' + storedTime);
                timeDiv.append(timeElement);
                // 创建存储符文数量的按钮
                var saveButton = $('<a class="btn btn-xs btn-default" id="saveButton">存储</a>');
                // 创建升级符文的按钮
                var compandButton = $('<a class="pull-right btn btn-xs btn-default" id="compandButton">升级</a>');

                buttonContainer2.append(timeDiv);
                buttonContainer2.append(saveButton);
                buttonContainer2.append(compandButton);

                $('.panel-heading:contains("符文")').append(buttonContainer2);

                saveButton.click(function () {
                    var storedRuneCounts = {};

                    $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function () {

                        var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span

                        var runeCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量
                        // 检查解析是否成功，如果是 NaN 或者数量小于等于 20 则跳过不存储
                        var regexResult = runeName.match(/-(\d+)#/);
                        if (regexResult && parseInt(regexResult[1]) >= 1) {
                            // 检查解析是否成功，如果是 NaN 则设为 0
                            if (isNaN(runeCount)) {
                                runeCount = 0;
                            }
                            storedRuneCounts[runeName] = runeCount; // 存储符文数量
                        }
                    });

                    var currentTime = new Date().toLocaleString(); // 获取当前时间
                    localStorage.setItem('storedRuneCounts', JSON.stringify(storedRuneCounts)); // 存储到 localStorage
                    localStorage.setItem('storedTime', currentTime); // 存储时间到 localStorage
                    alert("已存储数据", function () { });
                });

                compandButton.click(function () {
                    compandMode = true;
                    showChange();
                });

                $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function () {

                    var $pElement = $(this).find('p:first'); // 获取当前容器下的第一个 <p> 元素

                    var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span

                    var currentRuneCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量

                    if (storedRuneCounts.hasOwnProperty(runeName)) {
                        var storedCount = storedRuneCounts[runeName];
                        var changeCount = currentRuneCount - storedCount; // 计算数量变动
                        if (changeCount !== undefined) {
                            var changeText = '  (' + storedCount + ' -> ' + currentRuneCount + ')'; // 根据变动数量生成对应文本

                            $(this).find('.rasdsky').remove();
                            // 将变动数量拼接到符文信息的最后，并为 <p> 标签添加对应的样式
                            $(this).find('p:first .artifact:last').append($('<span class="rasdsky">').text(changeText).css('color', (changeCount > 0) ? 'red' : (changeCount < 0) ? 'green' : 'white')); // 为 <p> 标签添加颜色样式);)
                        }
                    }
                });
            }
        }
        showChange();

        // function compandStore(rune, count) {
        //     var t = 1500;
        //     POST_Message("RuneUpgrade", MERGE_Form({
        //         rune: rune,
        //         count: count,
        //     }), "html", t, function (result) {
        //         compandMode = true;
        //         // location.reload();
        //     }, function (request, state, ex) {
        //         // console.log(result)
        //     })
        // }
        function compandStore(rune, count) {
            var data = MERGE_Form({
                rune: rune,
                count: count
            });
            POST_Message("RuneUpgrade", data, "html", 2000)
                .then(r => {
                    compandMode = true;
                    location.reload();
                })
                .catch(r => { console.log(r) });
        }
    }

    //#endregion

    /***************一键血白**********************/
    const autoXuebaiType = "autoXuebaiType";
    loadAutoXuebai();//在储藏箱执行
    reformXuebai();//在改造页执行
    //加载一键血白
    function loadAutoXuebai() {
        if (location.href.indexOf("Equipment/Query") == -1) {
            return;
        }
        var targetEquip = [];//回复药水所处在数组中的index
        $(".equip-box .equip-name").each(function (index, item) {
            var name = $(this)[0].innerText;
            if (name == "【白热的珠宝】" || name == "【血红之珠宝】" || name == "【雄黄之珠宝】") {
                targetEquip.push(item);
            }

        })
        $(".equip-bag .equip-name").each(function (index, item) {
            var name = $(this)[0].innerText;
            if (name == "【白热的珠宝】" || name == "【血红之珠宝】" || name == "【雄黄之珠宝】") {
                targetEquip.push(item);
            }

        })
        if (targetEquip.length > 0) {
            var btn = $('<button>', {
                'class': 'btn btn-default btn-xs dropdown-toggle',
                'text': '一键血白',
                'id': "btnXuebai"
            });
            $(".panel-heading:eq(2) .pull-right").append(btn);
        }
        else {
            localStorage.removeItem(autoXuebaiType);
        }
        $("#btnXuebai").on("click", function () {
            saveMergeStatus(20, autoXuebaiType);
            var btn = $(targetEquip[0]).parent().find(".equip-reform");
            btn[0].click();
        });
        if (targetEquip.length > 0 && localStorage.getItem(autoXuebaiType)) {
            var btn = $(targetEquip[0]).parent().find(".equip-reform");
            btn[0].click();
        }
    }

    function reformXuebai() {
        if (location.href.indexOf("Equipment/Reform") == -1) {
            return;
        }
        var type = localStorage.getItem(autoXuebaiType);
        if (type) {
            setTimeout(() => {
                _idle.reform(type, function () {
                    _idle.reformBackToBag();
                });
            }, 1500)


        }

    }

    /***************一键血白end**********************/
}

function deepMerge(target, ...sources) {
    for (let source of sources) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof target[key] === 'object' && typeof source[key] === 'object') {
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
//保存对象到本地缓存，有则合并,无则直接新增
function saveMergeStatus(obj, key) {
    var localObj = localStorage.getItem(key);
    localObj = JSON.parse(localObj);
    if (!!!localObj) {
        var str = JSON.stringify(obj);
        localStorage.setItem(key, str);
    }
    else {

        var t = deepMerge(localObj, obj);
        var saveStr = JSON.stringify(t);
        localStorage.setItem(key, saveStr);
    }
}

//#region  INIT 
function addScriptToHead(src) {
    const script = document.createElement('script');
    script.text = src;
    document.head.appendChild(script);
    console.log(document.head);
}

function getLibrary(_timeout = 5000) {
    return new Promise((resolve, reject) => {
        const _url = "https://raw.githubusercontent.com/GbaFun/IdleinfinityTools/refs/heads/main/IdleUtils.js"
        $.ajax({
            url: _url,
            timeout: _timeout,
            dataType: 'text',
            success: function (data) {
                // console.log(data);
                resolve(data);
            },
            error: function (xhr, status, error) {
                // 请求失败时的操作
                // console.log('从(' + _url + ')获取JS脚本失败!');
                reject(_url, xhr, status, error);
            }
        });
    });
}

//#endregion