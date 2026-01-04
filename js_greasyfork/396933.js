// ==UserScript==
// @name            Discuz 论坛自动随机签名脚本
// @license         GPL 3.0
// @namespace       https://www.zhiqiang.name
// @icon            https://www.zhiqiang.name/favicon.ico
// @author          Blood.Cold
// @version         1.1.6
// @description     HostLoc 隔壁 52 等DZ论坛自动签名档 字数补丁，防折叠!PS:默认签名档，可自行修改变量L为20切换为仅防折叠
// @include         http://*/thread-*
// @include         https://*/thread-*
// @include         http://*/forum.php?mod=viewthread*
// @include         https://*/forum.php?mod=viewthread*
// @include         http://*/forum.php?mod=post*
// @include         https://*/forum.php?mod=post*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/396933/Discuz%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E7%AD%BE%E5%90%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396933/Discuz%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E7%AD%BE%E5%90%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var l = 200;//原始内容低于该长度就自动签名
    var idioms = [
		"Linux常用命令：pwd 显示用户当前所在的目录",
		"Linux常用命令：cat /proc/mounts 显示已加载的文件系统",
		"Linux常用命令：mkdir -p /tmp/dir1/dir2 创建一个目录树",
		"Linux常用命令：rsync -rogpav --delete /home /tmp 同步两边的目录",
		"Linux常用命令：du -sk * | sort -rn 以容量大小为依据依次显示文件和目录的大小",
        "Linux常用命令：sed '/ *#/d; /^$/d' example.txt 从example.txt文件中删除所有注释和空白行",
        "Linux常用命令：cat file1 file2 ... | command <> file1_in.txt_or_file1_out.txt general syntax for text manipulation using PIPE, STDIN and STDOUT"];
    var idioms1 = [
		"大哥大嫂过年好",
        "不忘初心，努力前行",
        "故事开始便不承认普通",
        "我一直都在你身边 ，一直都在",
        "明明只是活着，哀伤却无处不在",
        "垂死病中惊坐起，笑问客从何处来",
        "不是别人，是我，承认了你的价值",
        "大风起兮云飞扬，意大利炮轰他娘",
        "抛去所谓的敬畏之心，你会重新认知这个世界。",
        "生活原本沉闷，但跑起来就会有风。 --[北省]",
        "错的不是我， 错的是世界。 -- [School day]",
        "那双紧握不放的手……抓住的是希望……亦或是绝望",
        "地狱太冷，我来殉你。  —— 二哈和他的白猫师尊",
        "真正让我难受的，大概是因为让你看到如此狼狈的自己",
        "一只飞鸟以零点三马赫的速度划过天空，留下两道白色的翼痕。",
        "我坚信，人应该有力量，揪着自己的头发把自己从泥地里拔起来。",
        "做不到的话，不过就是一死 。但是，赢了就能活下去，要是不战斗就赢不了。",
        "真正的胜利，并不是战胜强者。把自己重要的东西保护到最后一刻，才是胜利。",
        "和平视窗计划只是个美丽的童话，竞赛代替不了战争，就像葡萄酒代替不了鲜血",
        "∮⊱⊱⊱      那双紧握不放的手……抓住的是希望……亦或是绝望……    ⊰⊰⊰∮",
        "我手中的魔法\n * 是守护挚爱的力量\n * 是坚定这个信念所必须的力量\n * 我一定会拯救你的\n * 无论在何时、何地。",
        "如果我是那雨滴的话，那么\n * 我能够像把不曾交汇的天空与大地连接起来那样\n * 把某人的心串联起来吗",
        "活着的意义从哪儿来？\n * 找啊，活下去的理由\n * 不断颠覆，不断否定\n * 没有一个一劳永逸的理由的",
        "这个世上有很多事是解释不通的\n * 比如突然的失落\n * 莫名其妙的孤独\n * 没有由来的落寞\n * 以及突然离开的你",
        "你们是不是健忘？\n * 别不承认，我就问你们一个问题。\n * 你原本是来浏览器干嘛的？\n * 如果你想起来了，就去做你该做的事情，别在这里迷失了自己的方向。\n * ——浏览器引路人",
        "作为一个词语\n * “ 活着”\n * 在我们中国的语言里充满了力量\n * 它的力量不是来自于喊叫\n * 也不是来自于进攻\n * 而是忍受\n * 去忍受生命赋予我们的责任\n * 去忍受现实给予我们的幸福和苦难、无聊和平庸",
        "问：喜欢一个人是什么感觉？\n * 答：觉得他身上有wifi。\n * 问：暗恋一个人是什么感觉？\n * 答：不知道wifi密码是什么。\n * 问：失恋了是什么感觉？\n * 答：本来能自动连接wifi突然有一天连不上了。\n * 问：暧昧是什么感觉？\n * 答：就是wifi信号不稳定，有时信号强、有时信号弱。\n * 问：异地恋是什么感觉？\n * 答：就是知道wifi密码，但是距离太远连接不上",
        "自身不先改变的话，一切都不会改变。——《银魂》",
        "即使如此，我也有我想保护的世界！——《高达seed》",
        "人死后会成为什么?夜空中的一座孤岛。——《一封孤岛的信》",
        "谎言不一定是谎言，被发现的谎言，才算是谎言。——《秋之回忆》",
        "命运啊，说是注定，不如说是你忘了是在何时做了选择。——《塔希里亚故事集》",
        "有些坚持，经不起一点点希望\n * 哪怕是一点光亮，也会让人陷入痛苦。——《撒野》",
        "他突然开始有点喜欢这个看似严苛无趣、却偶尔能给人惊喜的世界了\n * 因为面前这个他特别喜欢的人\n * 这大概是他有生以来最大程度的爱屋及乌。——《黑天》"];
    function addIdioms() {
        var text=document.getElementById("fastpostmessage");
        if (text.value.length<l) {
            text.value += "\n\n\n/**\n * "+idioms[Math.floor(Math.random()*idioms.length)]+"\n * "+idioms1[Math.floor(Math.random()*idioms.length)] + "\n * Link https://greasyfork.org/zh-CN/scripts/396933-hostloc-zsbd\n */";
        }
    }
    document.getElementById("fastpostmessage").onkeydown=function(event) {
        if (event.ctrlKey && event.keyCode == 13 || event.altKey && event.keyCode == 83) {
            addIdioms();
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
    };
    document.getElementById("fastpostsubmit").addEventListener("click", addIdioms);
})();
