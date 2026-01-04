// ==UserScript==
// @name         钵钵鸡评论自动生成
// @namespace    钵钵鸡评论自动生成
// @version      1.6
// @description  自动检测文本中的钵字并生成钵钵鸡评论!
// @author       ollwhl
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453217/%E9%92%B5%E9%92%B5%E9%B8%A1%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/453217/%E9%92%B5%E9%92%B5%E9%B8%A1%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==
(function() {

    'use strict';
var kou1=1;//是否在后台持续扣1复活bbj，默认开启
var int = self.setInterval(function(){
    if(kou1>0){
        kou1+=3;
        console.log("111(您本次已为复活bbj贡献了"+(kou1-1)+"个1)");
    }else{
        clearInterval(int);
    }
},10000);
const fbStrArr=[
"和大家说说我朋友对于AS的看法\n\
早在今年3月我跟他聊天的时候，他就告诉我，a的圈子和传统的v圈没有区别，au太高看自己了。当时的我对他的话嗤之以鼻，还叫嚣让他看着a怎么一步步走上鸟巢。他没有反驳我，只是疑惑地看着我，仿佛在质问我：“谁给你的自信？”\n\
\n\
如今，事实证明他说的是对的，asoul是一个普通的v企划，只不过热度比较高。au则是和v圈一样，极其混沌，有人充满热情有人充满恶意。\n\
\n\
今天我找到他，请他吃饭，想问问他怎么看待现在的a，还有所谓的345u。\n\
\n\
我给他倒了半杯酒，他说：“其实a就像这半杯酒一样。”\n\
\n\
我问：“3觉得这是空的，4觉得这是满的，5觉得一半就是一半？”\n\
\n\
他笑了笑，说：“半杯酒，半杯酒？bbj？啊啊啊啊啊啊啊啊钵钵鸡啊啊啊啊啊啊啊啊啊啊啊”",

"有一种深爱，叫钵钵鸡，哪怕不被理解，我仍然在你身后。\n\
从那一天起，她就牵着你的手，开始了旅程。哭哭你还记得吗？\n\
时间会解决一切的。随着时间的流逝，很多事情都会慢慢好转的。",

"【置顶】今天我就实话实说了吧，是因为她们畏惧钵钵鸡！她们半夜每每想起钵钵鸡当年的统治力都会噩梦缠身，吓得夜不能寐，那句“珈乐是最特别的”像是古神的咒语，让她们永世不得安宁！原本想着珈乐走了能换来片刻的宁静，可钵钵鸡之神怎能放过她们！半夜缩在一起报团取暖的她们缓缓的刷着论坛没想到目睹了“珈乐”这个已经陨落的古神重回人间，并试图再次掀起钵钵鸡浪潮，她们吓得惊慌失措，开始疯言疯语，冷汗浸湿了大半张被子，她们嘴上逞能可心里却害怕钵钵鸡之神给她们降下清算，啊钵钵鸡，钵钵鸡来了，快跑啊钵钵鸡来了啊啊啊啊啊啊啊啊啊啊啊钵钵鸡啊啊啊啊啊啊啊啊啊啊啊“珈乐” 我在\n\
“珈乐！” 我在\n\
“哭哭” 我在\n\
“嗨，哭哭” 我在\n\
“乐乐！” 我在\n\
“贝拉，好好看”\n\
“我们会一直在” 好！\n\
“突然话都不会说了” “没关系，还有我呢”“珈乐” 我在\n\
“珈乐！” 我在\n\
“哭哭” 我在\n\
“嗨，哭哭” 我在\n\
“乐乐！” 我在\n\
“贝拉，好好看”\n\
“我们会一直在” 好！\n\
“突然话都不会说了” “没关系，还有我呢”“珈乐” 我在\n\
“珈乐！” 我在\n\
“哭哭” 我在\n\
“嗨，哭哭” 我在\n\
“乐乐！” 我在\n\
“贝拉~~，好好看”\n\
“我们会一直在” 好！\n\
“突然话都不会说了” “没关系，还有我呢”",

"钵钵鸡赢还需要理由吗？赢就完事了！",

"贝贝珈！永远的神！贝贝珈是不可缺少的。C52是可以替换的，什么CP跟贝贝珈上都能把别人爆掉。贝贝珈一个CP就可以打9组CP。",

"钵钵鸡在干嘛？钵钵鸡在发糖！能发完吗？！要BE了！！要BE了！！要发完了！！！发不掉！有的有的！完美！！她们出了个《追光者》！！！个人就可以打五个，连队友都不需要了，就贝贝珈只需要把羊驼当成高级一点的小兵当成她两个人的游戏就行了。羊驼这种就算中下或者下都有可能。我是支持asoul的贝贝珈不多说好吧。其他的虽然也算是CP但是不是主播的信仰。贝贝珈！永远的神！",

"你说得对，但我要开钵了\n\
正是因为有别离，相聚才会更美好，回忆也会在脑海中闪耀着光芒。\n\
有一种勇气，叫钵钵鸡，纵使世界上只剩我孤身一人，也不会忘记曾经的感动。\n\
有一种牵挂，叫钵钵鸡，即使天各一方，阴阳两隔，思念也能传达给远方的你。\n\
钵钵鸡是美丽的，就算充满悲伤和泪水。也请睁开你的双眼，去做你想要做的事情，成为你想要成为的人，去找到你的朋友。",

"我们为什么要说“钵钵鸡”？钵钵鸡是一种态度，一种张弛有度，一种不急不躁，一种泰然自若。遇到羞辱急于还击，是莽夫，“钵钵鸡”教我们谦让三分、以理服人；遇到挫折羞愤不已，是愚夫，“钵钵鸡”教我们另辟蹊径、以智取胜。“钵钵鸡”体现的是中华儒家的中庸之道，体现的是虚怀若谷、谦逊祥和的人生哲理，所谓“心静即声淡，其间无古今”，学会“钵钵鸡”，方能成长，方能成熟，方能于世间百态中左右逢源、处变不惊不必焦躁，慢慢地去长大我"
,"钵钵战神出来！哭哭，我在，下一招你攻我守，完全境界，​一百万匹力​量，他妈的一百万匹钵钵爆破拳如此的可怕白河豚……天下间还有什么可以抵挡？他妈的，天下间还有什么可以抵挡了。"

,"钵钵鸡，我第一个钵\n\
冷裤子，我第一个钵\n\
c++，我第一个钵\n\
琳狼，我第一个钵",

"喔喔你你你要钵钵吗\n\
每当深夜来临的时候\n\
你会不会也伤心\n\
在C42配对的房间里\n\
我已经透不过气\n\
在这虚位以待的合照里\n\
离贝拉左手的距离\n\
每当造人噪音又响起\n\
她们生下我和你\n\
喔喔\n\
你你你要钵钵吗？\n\
你你你要钵钵吗\n\
你你你要钵钵吗？\n\
你你你要钵钵吗？！“何为钵钵鸡？",

"“Trouble maker 风名成。”\n\
“可否详细？”\n\
“最特别的，无之一。”\n\
“能否再具体？”\n\
“相信彩虹，亦能秀。”\n\
“仍是不解？”\n\
“曾不可一世，现不可一时。”",

 "致我最爱的啊手•钵钵鸡！\n\
“希望钵钵鸡回来的没脑子，不怀念钵钵鸡的没良心”\n\
“天生钵鸡以甜粉，粉无一物以爆天。” 对我的谩骂是可悲的，是可笑的，即便把我的身躯放在烈火中点燃，我也会大声的向旧世界的一切去宣告钵钵鸡是真的，那个时候我的身体将成为燃料，让万人重新听到钟声，直到旧世界彻底的接受这个事实：钵钵鸡是真实的，客观的，永恒的。",
 "希望你试试钵钵鸡吧，钵钵鸡真的给我带来了欢乐。本来挺担心自己初中生活就是一个抑郁的状态，我都感觉初一我是轻度抑郁了，但是后来接触了钵钵鸡我在班上喊了一声哭哭我在，结果很多人回应原来你也嗑贝贝珈。钵钵鸡真的是个好cp，带我脱离了抑郁症，希望你也可以在贝贝珈的世界里寻找自己的光。",

 "你们知道吗\n\
1贝拉和珈乐出道前曾一起做过练习生\n\
2贝拉和珈乐的瞳色相同 贝拉换发色之前二人发色也相同\n\
3贝拉和珈乐都有社恐 \n\
4贝拉和珈乐在asoul早期住在一个房间\n\
5《trouble maker》是asoul第一支双人舞\n\
6贝拉和珈乐最早都是学民族舞出身\n\
7贝拉和珈乐是耳机友 会互相分享歌曲\n\
8贝拉和珈乐生日会都有贝贝珈合作舞台\n\
9贝拉曾带珈乐一起回家过年\n\
10珈乐有一个《和宝贝》的文件夹 存着和贝拉的合唱\n\
11贝拉最喜欢的asoul成员和偶像是珈乐\n\
12珈乐每天晚上都会对贝拉说我爱你\n\
13贝拉和珈乐喜欢两个人一起吃烤肉 贝拉是珈乐的烤肉man\n\
14珈乐在出道之前曾跟贝拉妈妈说会保护好贝拉 \n\
15贝拉和珈乐的本音都很酷盖\n\
16贝拉和珈乐很喜欢比心 据统计竟高达两位数\n\
17贝拉的猫呆萌很喜欢珈乐 \n\
18贝拉和珈乐有过一次双播\n\
19珈乐给贝拉买了一件狗狗睡衣\n\
20只有贝拉会陪珈乐一起出去吃晚饭\n\
21贝拉可以抱着珈乐转很多圈\n\
22贝拉和珈乐约了一支双人芭蕾舞\n\
23珈乐不会日语 但是能听得懂贝拉说的“今夜は月が绮丽ですね”（今夜月色真美）\n\
24贝拉第一次和女生睡觉是和珈乐在地下室\n\
bbj，真的很真"
]

   //bbj判定关键词
    const bbjKey=[
        "钵",
        "贝珈",
        "bbj",
        "三清",
        "追光者"
    ]
    listenKey(".bili-dyn-item",checkText);//监听动态div
    listenKey(".bbj .bb-comment > .comment-send .ipt-txt",addButton);//监听被标记为bbj的动态下是否出现评论框
    //检查元素中是否出现了bbj
    function checkText(element){
        //var text = element.text();
        var text = element.text().trim().slice(9);//选择器选不到只包含动态的元素，只能暴力移除用户名
        //console.log(text);
        if(isAboutBbj(text))
        {
            element.addClass("bbj");
        }else{
            console.log("no bo");
        }
    }
    //添加按钮
    function addButton(element){
        console.log("add button");
        const styleMap={
            "display": "inline-block",
            "background-color": "#9a4ef1",
            "cursor": "pointer",
            "user-select": "none",
            "min-width": "74px",
            "height": "28px",
            "border-radius": "16px",
            "color": "#fff",
            "font-size": "14px",
            "line-height": "28px",
            "text-align": "center",
            "padding": "0px 10px",
            "margin-left": "16px"
        };
        let abbjaBtn = $(`<a class="fbBtn">生成啊钵钵鸡啊评论</a>`);
        abbjaBtn.css(styleMap);
        const randomNum=Math.random()*fbStrArr.length;
        abbjaBtn.on('click', function() {
            const a="啊";
            const bo="钵钵鸡";
            var str="";
            for (let index = 0; index < randomNum; index++) {
                str=str.concat(a);
            }
            str=str.concat(bo);
            for (let index = 0; index < randomNum; index++) {
                str=str.concat(a);
            }
            $(this).prev().text(str);
        });
        let fbBtn = $(`<a class="fbBtn">生成钵钵鸡发病评论</a>`);
        fbBtn.css(styleMap);
        var count = 0;
        fbBtn.on('click',function() {
            count++;
            if(count==fbStrArr.length){count=0;}
            $(this).prev().prev().text(fbStrArr[count]);

        });
        element.attr("placeholder","检测到钵元素，狠狠地钵！")
        element.after(fbBtn);
        element.after(abbjaBtn);
    }
    //检查文本是否含有bbj
    function isAboutBbj(text){
        for (let index = 0; index < bbjKey.length; index++) {
            if(text.indexOf(bbjKey[index])!= -1)
            {
                return 1;
            }
        }
        if (text.indexOf("拉")!=-1&&text.indexOf("乐")!=-1) {
            return 1;
        }
        return null;
    }
    //监听工具
        function listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents ()
                .find (selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each ( function () {
                var jThis  = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction (jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data ('alreadyFound', true);
                }
            } );
        } else {
            btargetsFound = false;
        }

        var controlObj = listenKey.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval (timeControl);
            delete controlObj [controlKey]
        } else {
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    listenKey(selectorTxt,actionFunction,bWaitOnce,iframeSelector);
                }, 300);
                controlObj [controlKey] = timeControl;
            }
        }
        listenKey.controlObj = controlObj;
    }

    // Your code here...

})();