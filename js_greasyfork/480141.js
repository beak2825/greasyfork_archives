// ==UserScript==
// @name         蜜柑计划(Mikan Project)复制全部磁链
// @namespace
// @version      0.2.4
// @description  复制某部番的某个字幕组的全部磁链
// @author       cookedfish
// @match        http*://mikanime.tv/*
// @match        http*://mikanani.me/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/480141/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E5%A4%8D%E5%88%B6%E5%85%A8%E9%83%A8%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/480141/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E5%A4%8D%E5%88%B6%E5%85%A8%E9%83%A8%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

var SPREAD = true
var SEARCH = true
var MODE = true
var SAVE = true
var LOAD = true
var CLEAR = true
var CATALOGUE = true
var WARNING = true

function set(){

    if(!getScriptSettings(0)){
        console.log('First time using the script')
        saveScriptSettings(0,true);
        saveScriptSettings(1,true);
        saveScriptSettings(2,true);
        saveScriptSettings(3,true);
        saveScriptSettings(4,true);
        saveScriptSettings(5,true);
        saveScriptSettings(6,true);
        saveScriptSettings(7,true);
        saveScriptSettings(8,true);
        saveScriptSettings(9,true);
        saveScriptSettings(10,true);
    }

    ///// SETTINGS /////

    SPREAD = getScriptSettings(1).effect
    //自动展开开关 true/false

    SEARCH = getScriptSettings(2).effect
    //搜索开关 true/false

    MODE = getScriptSettings(3).effect
    //模式开关 true/false

    SAVE = getScriptSettings(4).effect
    //保存设置开关 true/false

    LOAD = getScriptSettings(5).effect
    //加载设置开关 true/false

    CLEAR = getScriptSettings(6).effect
    //清空勾选框开关 true/false

    CATALOGUE = getScriptSettings(7).effect
    //字幕组列表复制功能开关 true/false

    WARNING = getScriptSettings(8).effect
    //加载完成警告开关 true/false

    /////SETTINGS END/////

    //部分功能互斥。

    if(SEARCH === false){
        MODE = false;
        SAVE = false;
        LOAD = false;
    }

}

function getScriptSettings(num) {//获取脚本设置
    const settings = GM_getValue('script_settings', {});
    return settings[num] || null;
}

function saveScriptSettings(num,effect) {//保存脚本设置
    const settings = GM_getValue('script_settings', {});
    settings[num] = {
        effect: effect,
        lastUsed: Date.now()
    };
    GM_setValue('script_settings', settings);
}

function saveSubgroupSettings(subgroupName, keyword, mode) {//保存字幕组设置
    if(!SAVE) return 'close';
    const settings = GM_getValue('mikan_subgroup_settings', {});
    settings[subgroupName] = {
        keyword: keyword,
        mode: mode,
        lastUsed: Date.now()
    };
    GM_setValue('mikan_subgroup_settings', settings);
}

function getSubgroupSettings(subgroupName) {//获取字幕组设置
    const settings = GM_getValue('mikan_subgroup_settings', {});
    return settings[subgroupName] || null;
}

function print_messageBar(max){//消息框
    var messageBar = document.createElement('div');
    messageBar.textContent = max;
    messageBar.style.position = 'fixed';
    messageBar.style.bottom = '0';
    messageBar.style.left = '0';
    messageBar.style.width = '100%';
    messageBar.style.backgroundColor = 'green';
    messageBar.style.color = 'white';
    messageBar.style.textAlign = 'center';
    messageBar.style.padding = '10px 0';
    document.body.appendChild(messageBar);
    setTimeout(function() {
        messageBar.parentNode.removeChild(messageBar);
    }, 1000);
}

function search(text,Value){//单词模式
    var startIndex = 0;
    while (startIndex < text.length) {//匹配关键字词
        var index = text.indexOf(Value, startIndex);
        if (index !== -1) {
            console.log('%c' + 'true','color: green',text,Value);
            return true;
        } else {
            break;
        }
    }
    console.log('%c' + 'false', 'color: red', text, Value);
    return false;
}

function multiple_match(texts, Value) {//多词模式
    var searchTerms = Value.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
        console.log(searchTerms[i]);
        if (!search(texts, searchTerms[i])) {return false;}
    }
    return true;
}

function anti_election(texts, Value){//排除模式
    var searchTerms = Value.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
        console.log(searchTerms[i]);
        if (search(texts, searchTerms[i])) {return false;}
    }
    return true;
}

function get_xunlei(){//复制按钮
    var num = parseInt($(this).closest('div').attr('id'));//字幕组id
    console.log(num);
    var refresh = $(this).closest('div').next('div').find('input[aria-label="选择此行"]:first');
    var urls = [];
    var box = false;
    var mode = $(this).nextAll("a:first").next('a').text();//模式
    var keyword = $(this).next('input').val();//关键词
    var Class = $(this).closest('div').find('i:first').attr('class');
    var subgroupName = $(this).closest('div').children('a:first').text();//字幕组名
    if( Class === 'fa fa-angle-down' ) subgroupName = $(this).closest('div').find('span:first').text();//特殊情况
    if( num === 202 ) subgroupName = '生肉/不明字幕';
    console.log(subgroupName);
    if(!MODE) mode = '模式切换:多词模式';
    console.log(mode,keyword,subgroupName);
    $('.table').find('input[aria-label="选择此行"]').each(function () {
        if($(this).attr('class') !== "js-episode-select") return true;
        if (parseInt($(this).closest('table').closest('div').prev('div').attr('id')) !== num && $(this).closest('table').closest('div').prev('div').attr('id') !== 'undefined') return true;
        if ($(this).prop('checked')) {
            box = true;
            return false; // 找到第一个已勾选的就可以停止循环
        }
    });
    console.log(box);
    if(!box){
        $('.table').find('a').each(function () {//按条件排除
            if($(this).attr('class') !== 'js-magnet magnet-link') return true;
            if (parseInt($(this).closest('table').closest('div').prev('div').attr('id')) !== num && $(this).closest('table').closest('div').prev('div').attr('id') !== 'undefined') return true;
            if(keyword && mode === '模式切换:单词模式'&&search($(this).prev('a').text(),keyword)===false) return true;
            if(keyword && mode === '模式切换:排除模式'&&anti_election($(this).prev('a').text(),keyword)===false) return true;
            if(keyword && mode === '模式切换:多词模式'&&multiple_match($(this).prev('a').text(),keyword)===false) return true;
            if(keyword && mode === '模式切换:打开模式'&&multiple_match($(this).prev('a').text(),keyword)===false) return true;
            urls.push($(this).attr('data-clipboard-text'));
            $(this).closest('td').prev('td').children().first().prop('checked', true);;
        });
    }
    else{
        $('.table').find('input[aria-label="选择此行"]').each(function () {
            if($(this).attr('class') !== "js-episode-select") return true;
            if (parseInt($(this).closest('table').closest('div').prev('div').attr('id')) !== num && $(this).closest('table').closest('div').prev('div').attr('id') !== 'undefined') return true;
            if(!$(this).prop('checked')) return true;
            urls.push($(this).attr('data-magnet'));
        });
    };

    if (subgroupName&&SAVE) {// 保存设置到本地存储
        var cleanMode = mode.replace('模式切换:', '');
        saveSubgroupSettings(subgroupName, keyword, cleanMode);
        console.log('保存设置:', subgroupName, keyword, cleanMode);
    }

    if(mode === '模式切换:打开模式'){//打开模式
        for(var i = 0;i < urls.length;i++)
        {
            var pages = window.open(urls[i], '_blank');
            pages.close();
            if(i % 10 === 9) alert(i-8 + '-' + (i+1) + '条，共' + urls.length + '条');
        }
    }
    refresh.click().click();
    print_messageBar('复制了'+urls.length+'个链接');
    GM_setClipboard(urls.join('\n'));//更改剪贴板
};

function click(){//自动展开
    if(!SPREAD) return 'close';
    document.querySelectorAll('a.js-expand-episode').forEach(function(element) {
        element.click();
    });
}

function Mode(){//模式切换
    if(!MODE) return 'close';
    var currentMode = $(this).text().trim();
    switch (currentMode) {
        case '模式切换:多词模式':
            $(this).text('模式切换:排除模式');
            break;
        case '模式切换:排除模式':
            $(this).text('模式切换:打开模式');
            break;
        case '模式切换:单词模式':
            $(this).text('模式切换:多词模式');
            break;
        case '模式切换:打开模式':
            $(this).text('模式切换:单词模式');
            break;
        default:
            break;
    };
}

function del(){//清空勾选框
    if(!CLEAR) return 'close';
    var refresh = $(this).closest('div').next('div').find('input[aria-label="选择此行"]:first');
    var num = parseInt($(this).closest('div').attr('id'));
    $('.table').find('input').each(function () {
        if (parseInt($(this).closest('table').closest('div').prev('div').attr('id')) !== num && $(this).closest('table').closest('div').prev('div').attr('id') !== 'undefined') return true;
        $(this).prop('checked', false);
        $(this).prop('indeterminate', false);
    });
    refresh.click().click();
}

function title(){//字幕组名
    if(!CATALOGUE) return 'close';
    var title=$(this).attr('data-anchor');
    title = title.replace(/#/g, '');
    console.log(title);
    var urls = [];
    $('.table').find('a').each(function () {//按条件排除
        if($(this).attr('class') !== "js-magnet magnet-link") return true;
        if ($(this).closest('table').closest('div').prev('div').attr('id') !== title && $(this).closest('table').closest('div').prev('div').attr('id') !== 'undefined') return true;
        urls.push($(this).attr('data-clipboard-text'));
    });
    print_messageBar('复制了'+urls.length+'个链接');
    GM_setClipboard(urls.join('\n'));//更改剪贴板
}

function autoFillSubgroupSettings() {// 自动填充字幕组设置
    if(!LOAD) return 'close';
    $('.subgroup-text i').closest('a').each(function() {
        var subgroupName = $(this).prev('a').text();
        var num = parseInt($(this).closest('div').attr('id'));//字幕组id
        var Class = $(this).closest('div').find('i:first').attr('class');
        if( Class === 'fa fa-angle-down' ) subgroupName = $(this).closest('div').find('span:first').text();//特殊情况
        if( num === 202 ) subgroupName = '生肉/不明字幕';
        var settings = getSubgroupSettings(subgroupName);
        if (settings) {
            console.log('找到字幕组设置:', subgroupName, settings);// 找到对应的输入框和模式按钮
            var $container = $(this).closest('div');
            var $input = $container.find('input[type="text"]');
            var $modeButton = $container.find('a[ref="mode"]');
            if ($input.length && $modeButton.length) {
                if(SEARCH)$input.val(settings.keyword);
                if(MODE)$modeButton.text('模式切换:' + settings.mode);
                console.log('自动填充:', subgroupName, settings.keyword, settings.mode);
            }
        }
    });
}

function settings() { // 设置按钮
    if ($(this).attr('effect') === 'uncheck') {
        $(this).attr('effect','checked');
        var $settings = $('<div class="settings"></div>');// 创建设置面板容器
        for (var i = 1; i <= 8; i++) {
            var check = getScriptSettings(i).effect === true ? 'checked=""' : '';
            var text = '';
            switch (i) {// 确定显示的文本
                case 1:
                    text = '自动展开';
                    break;
                case 2:
                    text = '关键词搜索';
                    break;
                case 3:
                    text = '搜索模式';
                    break;
                case 4:
                    text = '保存设置';
                    break;
                case 5:
                    text = '加载设置';
                    break;
                case 6:
                    text = '清空勾选框';
                    break;
                case 7:
                    text = '字幕组列表复制';
                    break;
                case 8:
                    text = '磁链展开提示';
                    break;
                default:
                    break;
            }// 创建复选框和文本
            var $checkbox = $('<input type="checkbox" num=' + i + ' use="setbox" ' + check + ' style="margin-left: 10px; margin-top: 10px;" class="setbox">');
            var $span = $('<span class="set_info" style="background-color: white; margin-left: 2px; font-size: 14px;">' + text + '</span>');
            $settings.append($checkbox);
            $settings.append($span);
        }// 插入到DOM中
        $settings.append('<a class="set_refresh" style="background-color: white; color:gray; margin-left: 10px; font-size: 14px;cursor: pointer; ">[确认]</a>');
        $(this).closest('div').after($settings);
    } else {// 移除设置面板
        $(this).attr('effect', 'uncheck');
        $(this).closest('div').next('div.settings').remove();
    }
}

function setbox(){//设置勾选框
    var num = $(this).attr('num');
    saveScriptSettings(num,$(this).prop('checked'));
}

function checkEpisodes(num,$this) {
    var $btn = $('a.js-expand-episode[data-subtitlegroupid="' + num + '"]');
    if($btn.length === 1 && $btn.css('display') !== 'none'){
        $this.text('未展开');
    }
    else{
        $this.text('已展开');
        $this.css('color','green');
    }
}


(function (){
    const currentUrl = window.location.href.toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    const pattern = /\/home\/bangumi\/\d+/;// 匹配 /home/bangumi/ 后跟数字的路径（不区分大小写）
    if (pattern.test(currentPath)) {// 提取数字部分
        const match = currentPath.match(/\/home\/bangumi\/(\d+)/);
        const number = match ? match[1] : null;
        console.log('匹配到路径，数字ID:', number);
        runScript();
    }
    function runScript() {// 脚本主逻辑
        console.log('在目标页面运行脚本');
        set();
        $(document).on('click', 'a[ref="thunder"]', get_xunlei);//绑定事件
        if(MODE) $(document).on('click', 'a[ref="mode"]', Mode);
        if(CATALOGUE) $(document).on('click', 'a[data-anchor^="#"]',title);
        if(CLEAR) $(document).on('click', 'a[ref="del"]', del);
        $(document).on('click', 'i[id="settings-icon"]', settings);
        $(document).on('click', 'input[use="setbox"]', setbox);
        $(document).on('click', 'a[class="set_refresh"]', ()=>{location.reload();});
        $('.subgroup-text i').closest('a').each(function() {
            var num = parseInt($(this).closest('div').attr('id'));//字幕组id
            if(MODE) var $button = $('<a class="js-magnet magnet-link" ref="mode" style="background-color:white; margin-left: 5px;" >模式切换:多词模式</a>');
            if(CLEAR) var $del = $('<a class="js-magnet magnet-link" ref="del" style="margin-left: 5px;">[清空勾选框]</a>');
            if(SEARCH) var $input = $('<input type="text" id="magnet-input" style="margin-left: 5px;" placeholder="输入关键字词(区分大小写)">');
            var $thunder_magnet = $('<a class="js-magnet magnet-link" ref="thunder" style="background-color:white; margin-left: 5px;" >[复制/打开]</a>');
            if(WARNING) var $magnet_load_warning = $('<a class="subscribed" ref="magnet_load_warning" style="margin-left: 5px; color:red;" ></a>');
            $(this).next('span').after($magnet_load_warning, $thunder_magnet, $input ,$del, $button,);//添加按钮
            if(WARNING) checkEpisodes(num,$(this).next('span').next('a'));
        });
        $('span.header2-text:contains("字幕组列表")').each(function(){
            var $settings_icon = $('<i class="fa fa-cog" id="settings-icon" effect="uncheck" style="color:gray; margin-left: 5px; cursor: pointer;"></i>');
            $(this).append($settings_icon);
        });
        const observer = new MutationObserver(function(mutations) {//监控展开按钮
            let $lastChangedElement = null;
            let shouldCheck = false;
            mutations.forEach(function(mutation) {// 检查是否有相关元素的style变化
                const $target = $(mutation.target);
                if ($target.is('a.js-expand-episode')) {
                    shouldCheck = true;
                    $lastChangedElement = $target;
                }
            });
            if (shouldCheck && $lastChangedElement) {// 使用保存的元素
                var $warning = $lastChangedElement.prev('div').prev('div').find('a[ref="magnet_load_warning"]')
                $warning.text('已展开');
                $warning.css('color', 'green');
            }
        });
        if(WARNING) observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class'] // 只监控这些属性的变化
        });
        if(LOAD) setTimeout(autoFillSubgroupSettings, 500);
        if(CATALOGUE) $('div.header').text('字幕组列表(点击复制)');
        if(SPREAD) click();
    }
})();