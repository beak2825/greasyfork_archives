// ==UserScript==
// @name         Use Trello AS Playing Game
// @name:zh-CN   将Trello改造为玩游戏做任务
//
// @description  You can set the level of the difficulty for every job, and when you complete it, you can get the proper reward.
// @description:zh-CN  可以在Trello上设定任务难度的级别，并且在完成任务后，发放对应级别的奖励值。
//
// @namespace    http://tampermonkey.net/
// @version      0.2
// @match        https://trello.com/b/*
// @match        https://trello.com/c/*
// @author       oraant
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397525/Use%20Trello%20AS%20Playing%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/397525/Use%20Trello%20AS%20Playing%20Game.meta.js
// ==/UserScript==

// 更新：
// 修复了Trello更新后，无法正常使用的问题。
// 增加了自动触发功能，无需在看板页面等待，现在可以在卡片页面等待了。

window.onload = function(){ // 必须这么搞，否则选择器获取不到东西。decument.ready也不行！

    // ------------------------------------------------------------------------------------------------------------------
    // 前置模块，存放通用的变量
    // ------------------------------------------------------------------------------------------------------------------

    var CustomFields = document.getElementsByClassName("custom-field-detail-item");
    var RandomButtons = document.getElementsByClassName("random-button");
    var WindowWrapper = document.getElementsByClassName("window-wrapper")[0];
    var CheckLists = document.getElementsByClassName("editable non-empty checklist-title");
    var CheckItems = document.getElementsByClassName("checklist-item");
    var CardTitle = document.getElementsByClassName('window-title');
    var LandTitle = document.getElementsByClassName('js-board-editing-target');

    // ------------------------------------------------------------------------------------------------------------------
    // common模块，存放通用的方法函数
    // ------------------------------------------------------------------------------------------------------------------

    // ----------------- 从自定义字段中存取配置 -----------------

    function GetDataDom(field){ // 获取指定的自定义字段的dom
        var dom; var i;
        switch (field){
            case 'Total': i = 0; break;
            case 'Copy': i = 1; break;
            case 'Object': i = 2; break;
            case 'Domain': i = 3; break;
            case 'Monster': i = 4; break;
            case 'Fstwin': i = 5; break;
        }
        dom = CustomFields[i].childNodes[1]
        return dom
    }
    function SetDataDom(field, value){ // 设置指定的自定义字段的内容
        var dataDom = GetDataDom(field);
        if (dataDom.value != value){
            dataDom.value = value;
            dataDom.focus({preventScroll: true});
            dataDom.blur();
        }
    }
    function GetDirectlyData(field){ // 获取指定的自定义字段的内容，若为空则解析为空字符串
        var dataDom = GetDataDom(field)
        var value = dataDom.value?dataDom.value:''
        return value
    }
    function SetDirectlyData(field, data){ // 覆写指定的自定义字段的内容
        var dataDom = GetDataDom(field)
        var value = JSON.stringify(data);
        SetDataDom(field, value);
    }
    function GetInternalData(field){ // 获取指定的自定义字段的内容，若为空则解析为空json
        var dataDom = GetDataDom(field)
        var value = dataDom.value?dataDom.value:'{}'
        return JSON.parse(value);
    }
    function SetInternalData(field, data){ // 覆写指定的自定义字段的内容
        var dataDom = GetDataDom(field)
        var value = JSON.stringify(data);
        SetDataDom(field, value);
    }

    // ----------------- 获取某一DOM的内容中，是否存在符合格式的标记，格式为：ID#LV，比如3#S -----------------
    function GetSigns(dom){
        // 判断标题格式是否正确
        var titles = dom.innerText.split(' ');
        if (titles.length < 2){return []}

        // 若标题格式正确，则判断标记格式是否正确
        var signs = titles[0].split('#');
        if (signs.length != 2){return []}

        // 若标记格式正确，则返回标志列表
        return signs;
    }

    // 获取徽章、最小值、最大值
    function GetConfigure(cls, level){
        // bedge, min, max configuration
        var LandConfiguration = [["🧱", 1, 10], ["💰", 10, 100], ["💿", 100, 1000], ["📀", 1000, 10000], ["💎", 10000, 100000], ["💣", 0, 0]];
        var AreaConfiguration = [["🧱", 1, 10], ["💰", 10, 100], ["💿", 100, 1000], ["📀", 1000, 10000], ["💎", 10000, 100000], ["💣", 0, 0]];
        var CopyConfiguration = [["🧱", 1, 10], ["💰", 10, 100], ["💿", 100, 1000], ["📀", 1000, 10000], ["💎", 10000, 100000], ["💣", 0, 0]];
        var DomainConfiguration = [["⭐", 1, 10], ["🌟", 10, 100], ["🌙", 100, 1000], ["🌝", 1000, 10000], ["🌞", 10000, 100000], ["🌠", 0, 0]];
        var MonsterConfiguration = [["🧱", 1, 10], ["💰", 10, 100], ["💿", 100, 1000], ["📀", 1000, 10000], ["💎", 10000, 100000], ["💣", 0, 0]];

        var ObjectConfiguration = [["🧱", 1, 10], ["💰", 10, 100], ["💿", 100, 1000], ["📀", 1000, 10000], ["💎", 10000, 100000], ["💣", 0, 0]];
        var FstwinConfiguration = [["🌀", 3, 30], ["🌌", 30, 300], ["💧", 300, 3000], ["🔥", 3000, 30000], ["⚡", 30000, 300000], ["💀", 0, 0]];

        var config; var suffix;
        switch(cls){
            case 'Land': config = LandConfiguration; break;
            case 'Area': config = AreaConfiguration; break;
            case 'Copy': config = CopyConfiguration; break;
            case 'Domain': config = DomainConfiguration; break;
            case 'Monster': config = MonsterConfiguration; break;

            case 'Object': config = ObjectConfiguration; break;
            case 'Fstwin': config = FstwinConfiguration; break;
        }
        switch(level){
            case 'S': suffix = 4; break;
            case 'A': suffix = 3; break;
            case 'B': suffix = 2; break;
            case 'C': suffix = 1; break;
            case 'D': suffix = 0; break;
            default: suffix = 5;
        }

        return config[suffix];
    }

    // 获取一个随机数
    function GetRandomNum(min, max){
        return parseInt(Math.random()*(max-min+1)+min,10);
    }

    // 判断按钮的内容是否正确，若正确时还一直插入，会引起栈溢出
    function SetInnerHTML(dom, inner){
        // console.log("正确内容为：" + inner + " 现在内容为：" + dom.innerHTML);
        if (dom.innerHTML != inner){
            dom.innerHTML = inner;
        }
    }

    // 向某一dom中插入新的dom，index为插在第几个后面，0代表最前面。数太大则插在最后面
    function InsertCustomDOM(fdom, ndom, index){ // 旧的文本处理方式
        if (index == 0){
            fdom.innerHTML = ndom + fdom.innerHTML;
        }else if (index>fdom.children.length){
            fdom.innerHTML += ndom
        }else{
            fdom.children[index-1].innerHTML += ndom;
        }
    }
    // 将字符串转为dom
    function parseDom(arg) {
        var objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.children[0];
    };
    // 像Dom中的最后添加一个新的Dom，并且为新Dom指定一个点击监听器
    function CustomTopButton(head, button, listener){
        if(head.children.length == 1){
            var ButtonDom = parseDom(button);
            ButtonDom.addEventListener("click", listener);
            head.appendChild(ButtonDom);
        };
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 自定义计算总分
    // ------------------------------------------------------------------------------------------------------------------

    var TotalButton = '<a class="random-button card-label button" style="display:inline;margin-left:5px;">🏆🏆🏆</a>'

    function TotalButtonListener(event){
        // 获取所有的内部数据
        var copy_data = GetDirectlyData('Copy');
        var object_data = GetDirectlyData('Object');
        var domain_data = GetInternalData('Domain');
        var monster_data = GetInternalData('Monster');
        var fstwin_data = GetInternalData('Fstwin');

        // 把所有存储的数据加起来
        var number = 0;
        if (copy_data != ''){number += parseInt(copy_data)};
        if (object_data != ''){number += parseInt(object_data)};
        if (domain_data != {}){
            for (var key1 in domain_data){
                number += domain_data[key1]
            }
        }
        if (monster_data != {}){
            for (var key2 in monster_data){
                number += monster_data[key2]
            }
        }
        if (fstwin_data != {}){
            for (var key3 in fstwin_data){
                number += fstwin_data[key3][1]
            }
        }

        // 把数据在内部数据中显示出来
        SetDirectlyData('Total', number);
    }

    function CustomTotalButton(){
        CustomTopButton(CustomFields[0].children[0], TotalButton, TotalButtonListener);
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 自定义副本积分
    // ------------------------------------------------------------------------------------------------------------------

    var CopyButton = '<a class="random-button card-label button" style="display:inline;margin-left:5px;">🎲🎲🎲</a>'

    function CopyButtonListener(event){
        // 获取标志
        var signs = GetSigns(CardTitle[0].children[0]);
        if (!signs.length){return}
        var id = signs[0]; var level = signs[1];

        // 获取数据和配置
        var copy_data = GetDirectlyData('Copy');
        var copy_config = GetConfigure('Copy', level) // 获取配置信息 // todo: 获取级别、ID之类的
        var copy_bedge = copy_config[0]; var copy_min = copy_config[1]; var copy_max = copy_config[2];
        var copy_number = GetRandomNum(copy_min, copy_max);
        SetDirectlyData('Copy', copy_number);
    }

    function CustomCopyButton(){
        CustomTopButton(CustomFields[1].children[0], CopyButton, CopyButtonListener);
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 自定义副本奖励
    // ------------------------------------------------------------------------------------------------------------------

    var ObjectButton = '<a class="random-button card-label button" style="display:inline;margin-left:5px;">🎁🎁🎁</a>'

    function ObjectButtonListener(event){
        // 获取标志
        var signs = GetSigns(CardTitle[0].children[0]);
        if (!signs.length){return}
        var id = signs[0]; var level = signs[1];

        // 获取数据和配置
        var object_data = GetDirectlyData('Object'); // todo：换成object
        var object_config = GetConfigure('Object', level) // 获取配置信息
        var object_bedge = object_config[0]; var object_min = object_config[1]; var object_max = object_config[2];
        var object_number = GetRandomNum(object_min, object_max);
        SetDirectlyData('Object', object_number);
    }

    function CustomObjectButton(){
        CustomTopButton(CustomFields[2].children[0], ObjectButton, ObjectButtonListener);
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 自定义清单
    // ------------------------------------------------------------------------------------------------------------------

    var CheckListButton = '<a class="random-button button subtle hide-on-edit" style="margin:0 0 0 6px;color:#fff;background-color:#f17143;font-weight:bold;">???</a>'

    function CustomCheckListsListener(event){
        var target = event.currentTarget;
        var title = target.parentNode.previousSibling; // 获取标题、ID、级别
        var signs = GetSigns(title);
        if (!signs.length){return}
        var id = signs[0]; var level = signs[1];

        var domain_data = GetInternalData('Domain'); // 获取内部数据
        var domain_config = GetConfigure('Domain', level) // 获取配置信息

        if (typeof(domain_data[id]) != "undefined"){return} // 若已有内部数据则禁止再次生成

        var domain_bedge = domain_config[0]; var domain_min = domain_config[1]; var domain_max = domain_config[2];
        var domain_number = GetRandomNum(domain_min, domain_max);
        domain_data[id] = domain_number; // 更新内部数据

        SetInternalData('Domain', domain_data)
        SetInnerHTML(target, domain_number);
    }

    function CustomCheckLists(){
        if(CheckLists.length == 0){return};
        for (var i=0; i<CheckLists.length; i++){
            // 获取关键DOM、获取检查项的名称DOM、自定义DOM
            var title = CheckLists[i].children[0];
            var option = CheckLists[i].children[1];

            // 获取标记中的信息
            var signs = GetSigns(title);
            if (!signs.length){continue}
            var id = signs[0]; var level = signs[1];

            // 添加自定义按钮
            if(option.children.length == 3){
                var CheckListButtonDom = parseDom(CheckListButton);
                CheckListButtonDom.addEventListener("click", CustomCheckListsListener);
                option.appendChild(CheckListButtonDom)
            }

            // 实时调整其按钮显示的内容
            else if(option.children.length == 4){
                var buttons = option.children; // 获取添加的自定义按钮
                var domain_data = GetInternalData('Domain'); // 获取内部数据
                var bedge = GetConfigure('Domain', level)[0] // 获取配置信息中的图标

                // 计算应正确显示的内容
                var inner = ""; // 按钮要显示的内容
                if (typeof(domain_data[id]) == "undefined"){ // 打开卡片时，若数据中没有相关的数据，则显示礼包按钮
                    inner = bedge;
                }else{ // 若已经有相关数据了，则显示相关数据
                    inner = domain_data[id];
                }

                // 判断按钮的内容是否正确，若正确时还一直插入，会引起栈溢出
                SetInnerHTML(buttons[0], '显');
                SetInnerHTML(buttons[1], '隐');
                SetInnerHTML(buttons[2], '删');
                SetInnerHTML(buttons[3], inner);
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 自定义检查项
    // ------------------------------------------------------------------------------------------------------------------

    var CheckItemTag =    '<span class="oraant-custom card-label"                  style="float:left; max-height:20px;padding:0px 2px;margin:8px 5px;background-color:#e3e7e9;overflow:initial;color:#17394d;">?</span>'
    var CheckItemCoin =   '<span class="oraant-custom card-label card-label-green" style="float:right;max-height:20px;padding:0px 5px;margin:8px 2px;text-overflow:initial;   overflow:initial;font-weight:bold;">?</span>'
    var CheckItemFstwin = '<span class="oraant-custom card-label card-label-sky"   style="float:right;max-height:20px;padding:0px 5px;margin:8px 2px;text-overflow:initial;   overflow:initial;">?</span>'

    // 自定义检查项后的信息
    function CustomCheckItems(){
        if(CheckItems.length == 0){return};

        for (var i=0; i<CheckItems.length; i++){
            // 获取详情DOM、获取检查项的名称DOM、自定义DOM
            var detail = CheckItems[i].children[1].children[0];
            var cbtag, cbtext, cbcoin, cbfstw;
            var signs, id, level;

            // 计算应正确显示的内容
            // 添加自定义按钮
            if(detail.children.length == 2){
                // 单独验证格式是否合适，因为插入的原因，两次cbtext的位置是不一样的
                cbtext = detail.children[0];
                signs = GetSigns(cbtext);
                if (!signs.length){continue}

                InsertCustomDOM(detail, CheckItemTag, 0)
                InsertCustomDOM(detail, CheckItemCoin, 10)
                InsertCustomDOM(detail, CheckItemFstwin, 20)
            }

            // 实时调整其按钮显示的内容（之前那些DOM里Onclick的功能，也要做到这里面来。因为这个不是个按钮，不需要去按。）
            else if(detail.children.length == 5){
                // 获取各组件的dom
                cbtag = detail.children[0];
                cbtext = detail.children[1];
                cbcoin = detail.children[3];
                cbfstw = detail.children[4];

                // 单独验证格式是否合适，因为插入的原因，两次cbtext的位置是不一样的
                signs = GetSigns(cbtext);
                if (!signs.length){continue}
                id = signs[0]; level = signs[1];

                // console.log("->内容全面，判断是否要进行修正");
                var state = CheckItems[i].getAttribute("class"); // 获取类属性
                var monster_data = GetInternalData('Monster'); // 获取内部数据
                var fstwin_data = GetInternalData('Fstwin'); // 获取内部数据
                var cbcoin_config = GetConfigure('Monster', level) // 获取配置信息
                var cbfstw_config = GetConfigure('Fstwin', level) // 获取配置信息
                var cbcoin_bedge = cbcoin_config[0]; var cbcoin_min = cbcoin_config[1]; var cbcoin_max = cbcoin_config[2];
                var cbfstw_bedge = cbfstw_config[0]; var cbfstw_min = cbfstw_config[1]; var cbfstw_max = cbfstw_config[2];

                var cbcoin_inner = ""; // 金币标签要显示的内容
                var cbfstw_inner = ""; // 首胜标签要显示的内容
                SetInnerHTML(cbtag, cbfstw_bedge); // 不管是否勾选，都在前面显示图标

                if (state == "checklist-item"){ // 若未勾选，则根据难度，显示图标
                    cbcoin_inner = cbcoin_bedge;
                    cbfstw_inner = '';
                }else if(state.search("checklist-item-state-complete") != -1){ // 若已勾选 // todo：这里应该能去掉，和下面的一起if
                    // 计算首胜标签应正确显示的内容
                    // ----------------------------------------

                    // 判断今天的有没有记录过(必须得在coin前边，需要根据coin的状态，判断是否是已经有数据的)
                    // 若已勾选但没有今日数据，且这个检查项也没有存过数据（否则昨天加了11号的后，今天还会加11号的首胜），则在数据栏中添加数据
                    var options = {year: 'numeric', month: 'numeric', day: 'numeric' };
                    var date = new Date().toLocaleDateString('ch-zh', options);
                    if (typeof(fstwin_data[date]) == "undefined" && typeof(monster_data[id]) == "undefined"){
                        var cbfstw_number = GetRandomNum(cbfstw_min, cbfstw_max); // 每日首胜奖励+3倍
                        fstwin_data[date] = [id, cbfstw_number];
                        SetInternalData('Fstwin', fstwin_data)
                    }

                    // 根据以前的数据，将首胜信息展示出来
                    for (var k in fstwin_data){
                        if(fstwin_data[k][0] == id){ // 若已经有今日数据了，且是这个ID，则显示相关数据
                            cbfstw_inner = fstwin_data[k][1];
                        }
                    }

                    // 计算金币标签应正确显示的内容
                    // ----------------------------------------
                    if (typeof(monster_data[id]) == "undefined"){ // 已勾选但未曾保存数据，则插入数据
                        var cbcoin_number = GetRandomNum(cbcoin_min, cbcoin_max);
                        monster_data[id] = cbcoin_number;
                        SetInternalData('Monster', monster_data)
                        cbcoin_inner = cbcoin_number
                    }else{ // 若已经有相关数据了，则显示相关数据
                        cbcoin_inner = monster_data[id];
                    }

                }else{console.log('很奇怪，检查项的类属性和预期的不同：'+state)}

                SetInnerHTML(cbfstw, cbfstw_inner);
                SetInnerHTML(cbcoin, cbcoin_inner);
                if(cbfstw_inner == ""){
                    cbfstw.style.display = "none";
                }else{
                    cbfstw.style.display = "initial";
                }
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------
    // 程序入口
    // ------------------------------------------------------------------------------------------------------------------

    var callback = function (records){
        // 检查看板的标题是否符合格式
        if(LandTitle.length == 0){return};
        var title_signs = GetSigns(LandTitle[0]);
        if (!title_signs.length){return}

        // 校验是否有自定义域
        if(CustomFields.length == 0){return};

        // 获取判断卡片标题是否符合要求
        var card_signs = GetSigns(CardTitle[0].children[0]);
        if (!card_signs.length){return}

        CustomTotalButton()
        CustomCopyButton()
        CustomObjectButton()

        CustomCheckLists()
        CustomCheckItems()

        console.log('看看能不能输出日志')
    };
    var mo = new MutationObserver(callback);
    mo.observe(WindowWrapper, {'childList': true, 'subtree': true}); // 设置一个监听器，页面由变化就触发。
    callback(); // 如果直接打开一个页面的话，默认监听器不会被触发。这时手动触发一次就很有必要了。
};

