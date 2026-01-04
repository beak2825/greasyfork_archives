// ==UserScript==
// @name          阡陌居签到提示词工具
// @description   阡陌居签到提示词工具。
// @version       1.0.0
// @namespace     阡陌居签到提示词工具
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *1000qm.vip/*
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540698/%E9%98%A1%E9%99%8C%E5%B1%85%E7%AD%BE%E5%88%B0%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540698/%E9%98%A1%E9%99%8C%E5%B1%85%E7%AD%BE%E5%88%B0%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
	// 'use strict';

//     function loadScript(url) {
//         var script = document.createElement('script');
//         script.type = 'text/javascript';
//         script.src = url;
//         document.head.appendChild(script);
//     }
//     loadScript("https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js");

    document.addEventListener('DOMContentLoaded', function() {
        try {
            // DOM 加载完成的代码
            console.log('DOM 加载完成！');

            var styles;
            var lock = true;
            var params = new URLSearchParams(window.location.search);
            console.log(params);
            var mod = params.get('mod');
            console.log(mod);

            function init() {
                var _array = [
                    83727, 43323, 91232, 91202, 91235, 89601, 88755, 88640, 88615, 91194, 91190, 91189, 91172, 90963, 90213, 87432, 67155, 91425, 91428, 46292, 89087, 13782, 70604, 91559, 91277, 89209, 68061, 17497, 90209, 37427,
                    77368, 47155, 87629, 68031, 81280, 90646, 53596, 74724, 22718, 53086, 7297,  17642, 91835, 91766, 85205, 14245, 91973, 31266, 91934, 62068, 53309, 36707, 47948, 3398,  3423,  24352, 91690, 91691, 3095,  91261,
                    92180, 85636, 2844,  87435, 92265, 92358, 33552, 65735, 378,   80348, 367,   87950, 37367, 92028, 92031, 92033, 92040, 92041, 36638, 58791, 79129, 71403, 18426, 73415, 76794, 92718, 76221, 19507, 72018, 15545,
                    92848, 92847, 92845, 92844, 92851, 93271, 6349,  93273, 37577, 93272, 93003, 93267, 6825,  46286, 92994, 93039, 93308, 93351, 18835, 26800, 14969, 56273, 51269, 55159, 71899, 6049,  93651, 78184, 37125, 43674,
                    47555, 93448, 93464, 93475, 93476, 93477, 82270, 56742, 15718, 53123, 38944, 94026, 93974, 94045, 20232, 79161, 6944,  94360, 94298, 11147, 72188, 76879, 94239, 94243, 94245, 94250, 94252, 29897, 89732, 85809,
                    10893, 63783, 69263, 34676, 94605, 40440, 82008, 57288, 71305, 40813, 85066, 75948, 3352,  62057, 46789, 15701, 95013, 6104,  35862, 61230, 78177, 80569, 66599, 63771, 26866, 66239, 20986, 36913, 95296, 77307,
                    24077, 17166, 78167, 60068, 21892, 70428, 86740, 39709, 61722, 23161, 83888, 37976,
                ];

                if(mod == 'forumdisplay') {
                    styles = {
                        color: "#FFF",
                        background: "rgba(255, 255, 0, .3)",
                    };

                    document.querySelectorAll('#threadlisttableid tbody').forEach(function(element) {
                        var tid = parseInt(element.id.replace('normalthread_', ''));
                        // console.log(tid);

                        if (_array.indexOf(tid) !== -1) {
                            for (var prop in styles) {
                                element.style[prop] = styles[prop];
                            }
                        }
                    });
                }else if(mod == 'viewthread') {
                    var tid = parseInt(params.get('tid'));
                    if (_array.indexOf(tid) !== -1) {
                        styles = {
                            color: "red",
                            fontWeight: "bold",
                        };
                        for (var prop in styles) {
                            document.querySelector('a[href="forum.php?mod=viewthread&tid='+ tid  +'"]').style[prop] = styles[prop];
                        }
                    }

                    document.body.innerHTML += '<style type="text/css">'+
                        '#__btn__ {'+
                        '  margin-top: -17px;'+
                        '  top: 50%;'+
                        '  right: 0;'+
                        '  padding: 8px;'+
                        '  text-decoration: none;'+
                        '  display: block;'+
                        '  color: #FFF;'+
                        '  background: #429296;'+
                        '  position: fixed;'+
                        '}'+
                        '#__box__ {'+
                        '  top: 0px;'+
                        '  right: 0px;'+
                        '  position: fixed;'+
                        '}'+
                        '#__close__ {'+
                        '  margin-top: -30px;'+
                        '  top: 50%;'+
                        '  left: -20px;'+
                        '  font-family: "宋体";'+
                        '  width: 20px;'+
                        '  line-height: 60px;'+
                        '  font-size: 18px;'+
                        '  text-align: center;'+
                        '  text-decoration: none;'+
                        '  color: #FFF;'+
                        '  background: #429296;'+
                        '  position: absolute;'+
                        '}'+
                        '#__con__ {'+
                        '  padding: 10px;'+
                        '  top: 0px;'+
                        '  right: 0px;'+
                        '  height: 100vh;'+
                        '  box-sizing: border-box;'+
                        '  border-left: 1px solid rgb(221, 221, 221);'+
                        '  background: rgb(245, 255, 250);'+
                        '  overflow-y: auto;'+
                        '}'+
                        '</style>'+
                        '<a href="javascript:void(0);" id="__btn__">显示评论提示词</a>';

                    document.body.innerHTML += '<div id="__box__">'+
                        '  <a href="javascript:void(0);" id="__close__">></a>'+
                        '  <div id="__con__">'+
                        '  简介内容引人入胜，迫不及待想读完整版<br>'+
                        '  设定新颖独特，已经等不及要看了<br>'+
                        '  人物刻画入木三分，必须收藏<br>'+
                        '  情节构思巧妙，值得细细品味<br>'+
                        '  文笔流畅自然，绝对要下载保存<br>'+
                        '  世界观宏大深邃，想马上开始阅读<br>'+
                        '  题材别具一格，感谢分享好资源<br>'+
                        '  叙事手法独树一帜，准备熬夜读完<br>'+
                        '  主题深刻感人，一定要收藏起来<br>'+
                        '  伏笔设置精妙，期待后续发展<br>'+
                        '  节奏把控得当，看着就停不下来<br>'+
                        '  细节描写生动，仿佛身临其境<br>'+
                        '  结局出人意料，想一探究竟<br>'+
                        '  人物关系错综复杂，引人深思<br>'+
                        '  故事内核温暖治愈，正合我意<br>'+
                        '  反转处理巧妙，让人拍案叫绝<br>'+
                        '  文字感染力强，深深被吸引<br>'+
                        '  主角成长历程真实动人<br>'+
                        '  场景描绘栩栩如生，跃然纸上<br>'+
                        '  一口气读完简介，意犹未尽<br>'+
                        '  配角塑造鲜明立体，印象深刻<br>'+
                        '  结构严谨有序，逻辑缜密<br>'+
                        '  每章简介都让人期待不已<br>'+
                        '  心理描写细腻真实，感同身受<br>'+
                        '  冲突设置恰到好处，张力十足<br>'+
                        '  想推荐给所有朋友的好作品<br>'+
                        '  风格清新脱俗，耳目一新<br>'+
                        '  寓意深刻隽永，值得反复品味<br>'+
                        '  视角独特新颖，别开生面<br>'+
                        '  动机合理可信，行为符合逻辑<br>'+
                        '  情节推进自然流畅，毫不突兀<br>'+
                        '  描写手法别具匠心，眼前一亮<br>'+
                        '  完全被简介内容吸引住了<br>'+
                        '  伏笔回收完美，构思精妙<br>'+
                        '  氛围营造到位，身临其境<br>'+
                        '  主角选择引发强烈共鸣<br>'+
                        '  文字精准有力，直击心灵<br>'+
                        '  看完简介就念念不忘<br>'+
                        '  设定独具特色，创意十足<br>'+
                        '  人物转变合情合理，水到渠成<br>'+
                        '  情节设计出人意料，引人入胜<br>'+
                        '  光是简介就让人欲罢不能<br>'+
                        '  内核触动内心最柔软处<br>'+
                        '  环境描写细致入微，如在眼前<br>'+
                        '  人物塑造栩栩如生，跃然纸上<br>'+
                        '  叙事方式新颖独特，别具一格<br>'+
                        '  读简介就忘了时间流逝<br>'+
                        '  每个细节都经过精心打磨<br>'+
                        '  主题表达含蓄深沉，意味深长<br>'+
                        '  画面感强烈，仿佛在眼前上演<br>'+
                        '  故事走向扣人心弦，迫不及待<br>'+
                        '  人物互动真实自然，活灵活现<br>'+
                        '  情节发展合情合理，逻辑严密<br>'+
                        '  感情描写细腻动人，直击心灵<br>'+
                        '  节奏把控精准到位，恰到好处<br>'+
                        '  人物命运令人唏嘘感叹<br>'+
                        '  被简介内容深深吸引<br>'+
                        '  每个转折都处理得巧妙自然<br>'+
                        '  文字质感独特，印象深刻<br>'+
                        '  结构环环相扣，浑然天成<br>'+
                        '  人物形象鲜明突出，过目难忘<br>'+
                        '  读着心里暖暖的，很治愈<br>'+
                        '  张力保持得很好，全程在线<br>'+
                        '  描写角度独特，别开生面<br>'+
                        '  主题贴近现实，发人深省<br>'+
                        '  文字简洁有力，直抵人心<br>'+
                        '  想找类似风格的作品来看<br>'+
                        '  人物关系错综复杂，耐人寻味<br>'+
                        '  故事展开从容不迫，游刃有余<br>'+
                        '  细节把握精准到位，一丝不苟<br>'+
                        '  看到精彩处会心一笑<br>'+
                        '  情节编排独具匠心，别出心裁<br>'+
                        '  人物形象呼之欲出，栩栩如生<br>'+
                        '  氛围营造独具特色，印象深刻<br>'+
                        '  叙事节奏收放自如，恰到好处<br>'+
                        '  光是看简介就特别过瘾<br>'+
                        '  每个角色都令人难忘<br>'+
                        '  反转出人意料又在情理之中<br>'+
                        '  文字温暖治愈，打动人心<br>'+
                        '  内核丰富深刻，值得深思<br>'+
                        '  对话真实自然，富有生活气息<br>'+
                        '  光是简介就让我停不下来<br>'+
                        '  写作手法炉火纯青，功底深厚<br>'+
                        '  情节推进行云流水，一气呵成<br>'+
                        '  人物真实可信，有血有肉<br>'+
                        '  看完简介收获良多<br>'+
                        '  设置合情合理，毫不突兀<br>'+
                        '  表达克制内敛，余韵悠长<br>'+
                        '  结局简介就令人期待<br>'+
                        '  人物关系令人动容<br>'+
                        '  读简介就特别投入<br>'+
                        '  情节引人入胜，迫不及待<br>'+
                        '  描写方式独特，印象深刻<br>'+
                        '  逻辑严密，无懈可击<br>'+
                        '  心理描写入木三分，真实细腻<br>'+
                        '  完全被简介吸引住了<br>'+
                        '  每个场景都精彩纷呈<br>'+
                        '  风格独树一帜，与众不同<br>'+
                        '  感谢分享这么好的资源<br>'+
                        '  这样的好作品值得收藏<br>'+
                        '  看了简介就想马上看完全部内容<br>'+
                        '  主角的性格跟我很像，很期待<br>'+
                        '  故事开头就很有意思，想继续看<br>'+
                        '  这种类型正是我最近想看的<br>'+
                        '  感谢分享这么好的作品<br>'+
                        '  简介写得真好，勾起了我的兴趣<br>'+
                        '  题材很对我的胃口<br>'+
                        '  主角的经历让我很好奇<br>'+
                        '  故事背景设定很吸引人<br>'+
                        '  看完简介就想知道结局<br>'+
                        '  人物对话写得很真实<br>'+
                        '  剧情发展让人猜不到<br>'+
                        '  描写得很细致，画面感强<br>'+
                        '  主角的成长故事很励志<br>'+
                        '  情节转折很出人意料<br>'+
                        '  感谢楼主推荐这么好的<br>'+
                        '  故事里的感情描写很动人<br>'+
                        '  主角的选择让我很有共鸣<br>'+
                        '  配角也很有特点<br>'+
                        '  故事的节奏把握得很好<br>'+
                        '  每个章节都很吸引人<br>'+
                        '  看完简介就停不下来<br>'+
                        '  作者的文笔很流畅<br>'+
                        '  故事里的细节很用心<br>'+
                        '  主题很正能量<br>'+
                        '  主角的经历很打动我<br>'+
                        '  故事里的场景描写很美<br>'+
                        '  人物关系很复杂有趣<br>'+
                        '  情节发展很合理自然<br>'+
                        '  感谢分享这么棒的作品<br>'+
                        '  主角的遭遇很让人心疼<br>'+
                        '  故事里的悬念设置得很好<br>'+
                        '  看完简介就想知道后续<br>'+
                        '  作者的写作风格我很喜欢<br>'+
                        '  故事里的冲突很激烈<br>'+
                        '  主角的性格很鲜明<br>'+
                        '  剧情走向很吸引人<br>'+
                        '  描写手法很特别<br>'+
                        '  故事里的情感很真挚<br>'+
                        '  感谢楼主找到这么好的<br>'+
                        '  主角的成长很让人期待<br>'+
                        '  故事里的伏笔埋得很好<br>'+
                        '  看完简介就想一口气读完<br>'+
                        '  作者的叙事方式很独特<br>'+
                        '  故事里的世界观很完整<br>'+
                        '  人物形象塑造得很成功<br>'+
                        '  情节推进得很自然<br>'+
                        '  描写得很生动形象<br>'+
                        '  主题表达得很清晰<br>'+
                        '  感谢分享这么精彩的作品<br>'+
                        '  主角的命运很牵动人心<br>'+
                        '  故事里的反转很精彩<br>'+
                        '  看完简介就深深被吸引<br>'+
                        '  作者的文风很对我胃口<br>'+
                        '  故事里的矛盾很突出<br>'+
                        '  主角的选择很让人意外<br>'+
                        '  剧情发展很扣人心弦<br>'+
                        '  描写角度很新颖<br>'+
                        '  故事里的情感很细腻<br>'+
                        '  感谢楼主推荐这么棒的<br>'+
                        '  主角的遭遇很特别<br>'+
                        '  故事里的悬念很吸引人<br>'+
                        '  看完简介就想知道答案<br>'+
                        '  作者的写作手法很老练<br>'+
                        '  故事里的冲突很真实<br>'+
                        '  主角的性格很讨喜<br>'+
                        '  剧情走向很出人意料<br>'+
                        '  描写方式很独特<br>'+
                        '  故事里的感情很动人<br>'+
                        '  感谢分享这么优秀的作品<br>'+
                        '  主角的成长很令人期待<br>'+
                        '  故事里的伏笔很巧妙<br>'+
                        '  看完简介就迫不及待<br>'+
                        '  作者的叙事风格很特别<br>'+
                        '  故事里的设定很完整<br>'+
                        '  人物形象很立体<br>'+
                        '  情节发展很流畅<br>'+
                        '  描写得很细致入微<br>'+
                        '  主题表达得很深刻<br>'+
                        '  感谢楼主找到这么精彩的<br>'+
                        '  主角的命运很曲折<br>'+
                        '  故事里的反转很意外<br>'+
                        '  看完简介就被深深吸引<br>'+
                        '  作者的文笔很优美<br>'+
                        '  故事里的矛盾很激烈<br>'+
                        '  主角的选择很勇敢<br>'+
                        '  剧情发展很引人入胜<br>'+
                        '  描写手法很生动<br>'+
                        '  故事里的情感很真实<br>'+
                        '  感谢分享这么好看的<br>'+
                        '  主角的经历很独特<br>'+
                        '  故事里的悬念很抓人<br>'+
                        '  看完简介就想知道结果<br>'+
                        '  作者的写作技巧很娴熟<br>'+
                        '  故事里的冲突很精彩<br>'+
                        '  主角的性格很鲜明<br>'+
                        '  剧情走向很吸引人<br>'+
                        '  描写方式很特别<br>'+
                        '  故事里的感情很真挚<br>'+
                        '  感谢楼主分享这么好的<br>'+
                        '  <div>'+
                        '<div>';

                    // 获取新添加的div元素
                    var btn = document.getElementById('__btn__');
                    var box = document.getElementById('__box__');
                    var close = document.getElementById('__close__');

                    // 绑定点击事件
                    btn.addEventListener('click', function() {
                        close.style.display = "block";
                        box.style.display = "block";
                    });

                    // 绑定点击事件
                    close.addEventListener('click', function() {
                        close.style.display = "none";
                        box.style.display = "none";
                    });
                }

                // 稍后移除监听器
                console.log('稍后移除监听器');
                window.removeEventListener('scroll', handleScroll);

                lock = false;
            }
            init();

            function handleScroll() {
                console.log('页面正在滚动');
                init();
            }

            // 添加监听器
            if(lock) window.addEventListener('scroll', handleScroll);
        } catch (error) {
            console.log(error)
            alert('代码没有正常执行')
        }
    });
})();
