// ==UserScript==
// @name         奶牛助手
// @version      0.1
// @description  一键吃药|一键点亮|一键改造
// @author       奶牛
// @match        https://www.idleinfinity.cn/Equipment/Query?*
// @match        https://www.idleinfinity.cn/Map/Detail?*
// @match        https://www.idleinfinity.cn/Equipment/Query?*
// @match        https://www.idleinfinity.cn/Equipment/Reform?*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1411579
// @downloadURL https://update.greasyfork.org/scripts/520878/%E5%A5%B6%E7%89%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520878/%E5%A5%B6%E7%89%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    //存储角色状态的key值
    const charStatus = "charStatus";
    //一键吃药记录的物品id
    const sanMedKey = "sanMedcineIds";

    const isClickOnline = "isClickOnline";

    //改造需要匹配的词条
    const reformKeyArr = "reformKeyArr";

    const reformWhiteList = [["血红", "转换"], ["雄黄", "转换"], ["雷云风暴", "陨石"], ["支配", "陨石"], ["冰封球", "陨石"]]

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
                this.saveMergeStatus(localObj, charStatus);
            }

        }

        //初始化一些角色相关的对象
        initCidStatus() {
            var map = {};
            this.cids.forEach((item, index) => {
                var obj = {};
                obj[item] = { isOnline: true, }
                this.saveMergeStatus(obj, charStatus);
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
                        debugger;
                        this.online(() => {
                            var cIndex = this.cids.indexOf(this.currentId);
                            this.switchCharacter(this.cids[++cIndex]);
                        });
                    }
                    else {
                        debugger
                        var cIndex = this.cids.indexOf(this.currentId);
                        this.switchCharacter(this.cids[++cIndex]);
                    }

                }
            }
            if (this.currentId == this.cids[this.cids.length - 1]) {
                localStorage.removeItem(isClickOnline);
            }
        }


        //保存对象到本地缓存，有则合并,无则直接新增
        saveMergeStatus(obj, key) {
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
                { text: '蓝装+12#', value: '10' },
                { text: '蓝装+绿|钻宝石', value: '11' },
                { text: '蓝装+13#', value: '20' },
                { text: '蓝装+14#', value: '30' },
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
                    this.saveMergeStatus(arr, reformKeyArr);
                    this.reformAuto();
                }
            });
            container.append(btn);
            this.reformAuto();

        }

        reform() {
            // location.reload();
            // return;
            var type = $("#optType").val();
            $("#form input[name='type']").val(type);
            $.ajax({
                type: "POST", // 或者 "GET"，根据实际情况选择
                url: "EquipReform",
                data: $("form").serialize(),
                success: function (response) {
                    location.reload();
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
                this.reform();
            }, 1500)


        }
        checkWhiteList(text) {
            debugger;
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




        loadPlugin() {
            //自动吃药
            loadSanPlugin();
            //电量
            loadOnlinePlugin();
            //自动改造
            this.loadReformPlugin();
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
                'class': 'panel-filter panel-filter-mybag',
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
            _idle.saveMergeStatus(true, isClickOnline);
            debugger;
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






})();