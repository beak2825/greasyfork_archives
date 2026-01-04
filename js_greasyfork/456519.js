// ==UserScript==
// @name         bilibili时光机TimeMachineForBilibilitest
// @version      1.2
// @description  现在就把时间调回2019年1月。头图&logo&推荐视频按照日期变回2019年1月对应日期的样子，并且可以手动调整时间。
// @author       zumg
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GPL
// @namespace https://greasyfork.org/users/996674
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @downloadURL https://update.greasyfork.org/scripts/456519/bilibili%E6%97%B6%E5%85%89%E6%9C%BATimeMachineForBilibilitest.user.js
// @updateURL https://update.greasyfork.org/scripts/456519/bilibili%E6%97%B6%E5%85%89%E6%9C%BATimeMachineForBilibilitest.meta.js
// ==/UserScript==

(function() {
    window.Vue = Vue

    function chagePic(bannerUrl,logoUrl){setTimeout(function(){
        if(document.getElementById("app"))
            {
            //判断为旧版
            if(bannerUrl)document.getElementById('internationalHeader').getElementsByClassName('bili-banner')[0].style.setProperty("background-image",`url("//${bannerUrl}")`)
            if(logoUrl)document.getElementsByClassName('head-logo')[0].getElementsByClassName('logo-img')[0].setAttribute("src",`//${logoUrl}`)
        }
        else{
            //判断为新版
            //判断有视频背景a
            if(document.getElementsByClassName('layer')[0]){
                document.getElementsByClassName('layer')[0].style.setProperty("background-image",`url("//${bannerUrl}")`)
                document.getElementsByClassName('layer')[0].innerHTML=''
            }
            else{
                if(bannerUrl)document.getElementById('bili-header-banner-img').innerHTML=`<!----><source srcset="//${bannerUrl}" type="image/avif"><source srcset="//${bannerUrl}" type="image/webp"><img src="${bannerUrl}" alt="" loading="eager" onload="">`
                //判断有视频背景b
                if(document.getElementsByClassName('bili-header__banner')[0].getElementsByTagName('video')[0])document.getElementsByClassName('bili-header__banner')[0].getElementsByTagName('video')[0].remove()
            }
            if(logoUrl)document.getElementsByClassName('header-banner__inner')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0].setAttribute("src",`//${logoUrl}`)
        }

    },20)}
    
    var result={20190127: {'video': {'【老E】劲爆大象部落！穿越古今的台湾动♂作游戏！': ['https://www.bilibili.com/video/av41564020/', 'i0.hdslb.com/bfs/archive/35b92ad5afcc7cb57f9ed0e039eea68c15deff6a.jpg'], '【warma翻唱】行星环【自制PV】': ['https://www.bilibili.com/video/av41556136/', 'i2.hdslb.com/bfs/archive/d9b18e2de668d1a04e870c6514fc273fd0893f35.jpg'], '哈哈哈哈！1月新番大吐槽第三弹！男主竟和多名女性轮流约会？！「泛式/新番妙妙屋14」': ['https://www.bilibili.com/video/av41673817/', 'i0.hdslb.com/bfs/archive/76dc3ccf55e9559e87a81028108fb8432bbcb6b9.jpg'], '【FGO】艾蕾也想变得可爱': ['https://www.bilibili.com/video/av41502657/', 'i2.hdslb.com/bfs/archive/9651e8d4581e2c0f0bb7e6baccb8bdc6a0b84f96.jpg'], '冲了！这沙雕动画的尺度未成年人看了根本把持不住！': ['https://www.bilibili.com/video/av41580385/', 'i2.hdslb.com/bfs/archive/afc0d22e02c815077553786280d92364363e8757.jpg'], '【257部混剪】2018年新番动画中的相似镜头提纯 ·续（修正版）': ['https://www.bilibili.com/video/av41525136/', 'i0.hdslb.com/bfs/archive/80526d57961c20f59152159b5bb4de25ed93ab8a.jpg'], '【KDA男团完整版】高三生零成本翻拍《POP/STARS》': ['https://www.bilibili.com/video/av41687204/', 'i0.hdslb.com/bfs/archive/96291efc6156870a5cfb050f9b3fda272c0e3e9c.jpg'], '【番声】变身成女孩子！一次女装一次爽，一直女装一直爽！一月新番食用报告（其七）': ['https://www.bilibili.com/video/av41533103/', 'i1.hdslb.com/bfs/archive/28ebefda5777d47744fd4f01da872d551226ecd9.jpg']}, 'panel': {'逮虾户准备！': ['https://www.bilibili.com/blackboard/topic/activity-TV-PkTC8_.html', 'i0.hdslb.com/bfs/archive/3c82cf7f8dd83512b00b1886e0ecda7f7037be95.jpg'], '只有实力才能代表一切': ['https://www.bilibili.com/blackboard/topic/activity-YDjvC9qRrU.html', 'i0.hdslb.com/bfs/archive/ce53306199c526a402776235d4c3f6cadf767306.jpg'], '屏实力，高颜值': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C26%2Cb%7Cbilibili%2Cc%7C1%2Cd%7C4%2Ce%7CCPTlARAAGLOXASAAKAAwHTgaQiAxNTQ4NTUzMDA0OTY2cTE3MmEyMmE1OGExMzVxMzI2MUimz87niC1SCeaXp%2BmHkeWxsVoS5Yqg5Yip56aP5bC85Lqa5beeYgbnvo7lm71oAHABeICAgIBQgAEAiAHnJJIBDzIwNy4yNDEuMjI2LjIxOZoBkANhbGw6ZGVmYXVsdCxlY3BtOmRlZmF1bHQsY3BjVGFnRmlsdGVyOnVuZGVmaW5lZCxlbmhhbmNlQ3RyUUZhY3RvcjpzcXVhcmUsYWRNZWNoYW5pc21Nb25pdG9yOmNsb3NlLHBsYXlwYWdlY3RyOmRpc2FibGUsdXBfcmVjX2Zsb3dfY29udHJvbDp1bmRlZmluZWQsYnJ1c2hfZHVwbGljYXRlOmRlZmF1bHQscGN0cl9jcG06Y3BtLGRmeF9zcGVjaWZpY19yYXRpbzp1bmRlZmluZWQscGN0cl92MjpscixkeW5hbWljX2Zsb3dfY29udHJvbDpzcGxpdCB0aGUgZmxvdyBieSBtaWQscGN2cjpib3RoX2FfMV9iXzAuMDVfY18xX2ZfMV8xLjUsZnJlcUxpbWl0OmRlZmF1bHQsc21hbGxDb25zdW1lVW5pdDpkZWZhdWx0LG91dGVyQmVhdElubmVyOmVuYWJsZSxvdXRlclF1aXQ6ZW5hYmxlMjUsZmRzX3J0dDpkZWZhdWx0oAEAqAEAsgEg%2BaNQJCUqF2wOzGlfzTSMr1mtmHVddIOrOl4rSM6hVKm6AYMCaHR0cDovL2NsaWNrYy5hZG1hc3Rlci5jb20uY24vYy9hMTIxNzU0LGIzMTc4MjM3LGMzMjk3LGkwLG0xMDEsOGExLDhiMiwwYTMsbl9fTUFDX18sel9fSURGQV9fLG9fX09QRU5VRElEX18sMGRfX0FORFJPSURJRF9fLDBjX19JTUVJX18sZjIwNy4yNDEuMjI2LjIxOSx0X19UU19fLHFfX09TVlNfXyxyX19URVJNX18sMGlfX01VRFNfXywwaF9fTVVJRF9fLDB2X19JU09GRkxJTkVfXyxzX19BRFdIX18sMWJfX0NVU1RPTVYxX18sMWFfX0NVU1RPTVYyX18saMIBAMoBANIBANgBBeABAOgBAPABAPgBAIACAIgCALgCAMACAMgCANACANgCAOICAiws%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C3%2Ci%7C%2Cj%7C%2Ck%7C1548553022891%2Cl%7C23%2Cm%7C1548553010017%2Cn%7C1%2Co%7C&ts=1548553022891', 'i0.hdslb.com/bfs/sycp/creative_img/201901/7ebaf4e3cf8f93e2bcda9b9adb7f09d8.jpg'], '年度UP奖项揭晓，点击回顾收看精彩花絮！': ['https://www.bilibili.com/blackboard/activity-BPU2018-review.html', 'i0.hdslb.com/bfs/archive/af2c97c096cb080d62b05bd6e343952223fcf331.jpg']}, 'url': 'http://web.archive.org/web/20190127013645/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/3df8b541a3da595c111a8132e62b740e72df91d1.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/86ebed2e57b7b0e31f4868d842f728462b9833b7.png'}, 20190129: {'video': {'【番声】开年第一神剧！这部新番比《权力的游戏》还要硬核！每周胡说八道环节（其二）': ['https://www.bilibili.com/video/av41810718/', 'i2.hdslb.com/bfs/archive/37b1d36fa8b36b08bf509fd9d5ef7569a837ca69.jpg'], 'TV动画 辉夜大小姐想让我告白~天才们的恋爱头脑战~第3话 ED「チカっとチカ千花っ♡」': ['https://www.bilibili.com/video/av41793885/', 'i0.hdslb.com/bfs/archive/22fa73dc87b8e63a21eecf6e6facfb6bd25e3a66.jpg'], '【怪物猎人生态】角龙-请温柔对待你怀孕的妻子（是她先动的手）': ['https://www.bilibili.com/video/av41753382/', 'i2.hdslb.com/bfs/archive/8f8398ded9216dbc24e498037b034c90b6e57023.jpg'], '【神回】赤井心的3D发表LIVE！【VTuber】': ['https://www.bilibili.com/video/av41792707/', 'i2.hdslb.com/bfs/archive/fe51481d84f2282e7dea991a5d6cb5b10d93d4a9.jpg'], '【1月】辉夜大小姐想让我告白~天才们的恋爱头脑战~ 第3话ED影像(藤原千花 角色歌)【F宅/1080P+/中日双语】': ['https://www.bilibili.com/video/av41898630/', 'i0.hdslb.com/bfs/archive/a7ccaf5fa5f6a8f8bbdca2ef4d35648a4b9b5f99.jpg'], '【补帧向/60FPS】丝滑的藤原书记你喜欢吗？反正我喜欢 辉夜大小姐:你好骚啊。GKD': ['https://www.bilibili.com/video/av41810072/', 'i0.hdslb.com/bfs/archive/6a4b4cd188fdc60cfc3d0a433783d1a7e8895332.jpg'], '五姐妹党争分析？！盾勇被要求下架？史莱姆竟被删关键剧情？【新番猛料】': ['https://www.bilibili.com/video/av41716600/', 'i0.hdslb.com/bfs/archive/677a8704f38e5f5afa2637db0ff1ba2f875d3895.jpg'], '预购了一年的手办终于到了：2018拜年祭2233娘手办开箱': ['https://www.bilibili.com/video/av41898831/', 'i2.hdslb.com/bfs/archive/f39bc2b05a14c7bf77c25a6a6fa0ed1c4bc63393.png']}, 'panel': {'预约还有精彩好礼哦~': ['https://www.bilibili.com/blackboard/xianxing2019bnj.html', 'i0.hdslb.com/bfs/archive/e64a9f6d252e08352dbd9ad848eb394c191e4984.jpg'], '幸福账单有奖募集中！': ['https://www.bilibili.com/blackboard/topic/activity-CXqIiC_cQ.html', 'i0.hdslb.com/bfs/archive/c8e05af55fb438f47a5691e047a84e109bc87e73.jpg'], '请收下这满满的心意！': ['https://www.bilibili.com/blackboard/topic/activity-r5c_2eSkr.html', 'i0.hdslb.com/bfs/archive/9319dbfe4cbc81f0aa9d7843abfeaedd9ddb05c9.jpg'], 'LPL春季赛JDGvsIG复盘': ['https://www.bilibili.com/read/cv1946964?from=1002', 'i0.hdslb.com/bfs/archive/a409064b52bf7cd46844be08c50b86cc26c5f7b6.png']}, 'url': 'http://web.archive.org/web/20190129024138/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/fd1686cd045e9fece01fc524b01b44b48df2ece1.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/b14473636912126e124ea3c6a4d2b62b1a125205.png'}, 20190114: {'video': {'王老菊教你修仙02：洞天福地人间仙境': ['https://www.bilibili.com/video/av40608399/', 'i0.hdslb.com/bfs/archive/9ce9dac1e603619f7b095fde3d998a6f6ea52024.jpg'], '叮！您有一份来自hololive全员的问候～【改】': ['https://www.bilibili.com/video/av40587164/', 'i1.hdslb.com/bfs/archive/90e441bf59bf8163986a359c53276c85304d8bf6.jpg'], '【2018盘点#6】那些画面很糟糕却依旧很有趣的作品！盘点2018年那些身残志坚的动画暨年度Qualidea Code奖': ['https://www.bilibili.com/video/av40512696/', 'i0.hdslb.com/bfs/archive/b0b623d1a81819a01fd755c52a2d75eb63a9fb7e.jpg'], '【轰出】轰焦冻的最后的wonderland【轰生贺2019】': ['https://www.bilibili.com/video/av40509110/', 'i1.hdslb.com/bfs/archive/e11651fc6ad8f6ce117034c54b977bde37d2189b.jpg'], '【音乐合辑/共22首】佐贺偶像是传奇-OP/ED/插入曲整合专辑 -ZOMBIE LAND SAGA': ['https://www.bilibili.com/video/av40667513/', 'i0.hdslb.com/bfs/archive/6f5f9621df250ca1fc07ced2b8b43ed2b5e497ae.jpg'], '【FGO手书】阿比来了哦！（完整版）': ['https://www.bilibili.com/video/av40583522/', 'i2.hdslb.com/bfs/archive/e6e46d9866f5a8b11a5d6779f79bd9d0f89f7cc5.jpg'], '【新手向】猴子也能看懂的二次元光影基础-素描关系': ['https://www.bilibili.com/video/av40642497/', 'i0.hdslb.com/bfs/archive/2017dfab3870dda5498cece143b2b1245c45d89b.jpg'], '【轻松漫谈】塞勒姆的无垢魔女——阿比盖尔·威廉姆斯': ['https://www.bilibili.com/video/av40468111/', 'i2.hdslb.com/bfs/archive/fc7212e0028120a282a5a95fa8c8c2df262a217b.jpg']}, 'panel': {'': ['https://www.bilibili.com/blackboard/activity--dyW66kAGH.html', 'i0.hdslb.com/bfs/archive/3b29bd1ac2798aaf55ae9cb83879dee81f7327fb.jpg'], '故事王2你记住了哪些梗？': ['https://www.bilibili.com/read/cv1863145', 'i0.hdslb.com/bfs/archive/6e0001b8af9f93fef50e2d662356020d9964af70.jpg']}, 'url': 'http://web.archive.org/web/20190114205955/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190124: {'video': {'【右小死】幕外行动：官方水军，最为致命？': ['https://www.bilibili.com/video/av41449471/', 'i2.hdslb.com/bfs/archive/ec3f0a5670166c9a5703002386b33b746bee32f4.jpg'], '【UP主战争】2019最强新番吐槽是谁？': ['https://www.bilibili.com/video/av41307296/', 'i2.hdslb.com/bfs/archive/8718659edf25198c87b4accfc10d0efaf2ec45d0.jpg'], '抛去华丽的外衣我依然有魅力，艾米莉亚恋爱了~': ['https://www.bilibili.com/video/av41446410/', 'i2.hdslb.com/bfs/archive/b73303f78faeba81d054322f942381deecffc7d2.jpg'], '【碧蓝航线/手书】皇家方舟的谁都好、请和我交往（驱逐限定）': ['https://www.bilibili.com/video/av41353998/', 'i2.hdslb.com/bfs/archive/c8256503112cd51f4dcb708c50c97979e4088730.jpg'], '【初音ミク】请问有内脏吗【ピノキオピー】': ['https://www.bilibili.com/video/av41344405/', 'i1.hdslb.com/bfs/archive/a4edb0266d94b5afe8567bbcd2f287cda90dee63.jpg'], '【初音ミク】DECO-27 - アイ _ AI【オリジナルMV】': ['https://www.bilibili.com/video/av41402044/', 'i1.hdslb.com/bfs/archive/95af90cdff88fc065e1005c5240a3d2153c9fc8f.jpg'], '【番声】你们都没有看懂这部新番！完美诠释权力、政治与外交的史诗巨作！一月新番食用报告（其五）': ['https://www.bilibili.com/video/av41432448/', 'i0.hdslb.com/bfs/archive/862d1dff9cb7c5e02d2e3b9ee4ffbca9fb5580c3.jpg'], '【敖厂长】12年前最扯淡三国游戏!': ['https://www.bilibili.com/video/av41398101/', 'i1.hdslb.com/bfs/archive/9d91377a497006b85461952bf85043b2c7b1f745.jpg']}, 'panel': {'': ['https://www.bilibili.com/blackboard/topic/activity-w2EyrszBN.html', 'i0.hdslb.com/bfs/archive/fb7e0fd827fb4bebbe73f20af879f088d3be03e4.jpg'], '在线组队，好友即刻对战！': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C25%2Cb%7Cbilibili%2Cc%7C1%2Cd%7C4%2Ce%7CCM3jARAAGOOYASAAKAAwAzgZQh8xNTQ4MzA1OTU5ODg3cTE3MmEyMmE1OWExMDlxNzQySM%2BX6PGHLVIJ5pen6YeR5bGxWhLliqDliKnnpo%2FlsLzkuprlt55iBue%2BjuWbvWgBcAF4gICAgFCAAQCIAdEkkgEPMjA3LjI0MS4yMjYuMjMwmgGGA2FsbDpkZWZhdWx0LGVjcG06ZGVmYXVsdCxjcGNUYWdGaWx0ZXI6dW5kZWZpbmVkLGVuaGFuY2VDdHJRRmFjdG9yOnNxdWFyZSxhZE1lY2hhbmlzbU1vbml0b3I6b3RoZXIscGxheXBhZ2VjdHI6ZGlzYWJsZSx1cF9yZWNfZmxvd19jb250cm9sOnVuZGVmaW5lZCxicnVzaF9kdXBsaWNhdGU6YnJ1c2hEdXBsaWNhdGVGaWx0ZXIscGN0cl9jcG06Y3BtLGRmeF9zcGVjaWZpY19yYXRpbzp1bmRlZmluZWQscGN0cl92MjpkZnQsZHluYW1pY19mbG93X2NvbnRyb2w6c3BsaXQgdGhlIGZsb3cgYnkgbWlkLHBjdnI6ZGxkLGZyZXFMaW1pdDpkZWZhdWx0LHNtYWxsQ29uc3VtZVVuaXQ6ZGVmYXVsdCxvdXRlckJlYXRJbm5lcjplbmFibGUsb3V0ZXJRdWl0OmVuYWJsZTI1LGZkc19ydHQ6ZGVmYXVsdKABAKgBALIBIAPWns7LZUeJ4eIG9jUUhvtveh3JNDlrMTh4Boaj8yucugGhAWh0dHBzOi8vYWQtYmlsaS1kYXRhLmJpbGlnYW1lLmNvbS9hcGkvcGMvY2xpY2tCaWxpP2FkX3BsYW5faWQ9MTU2MzImbWlkPV9fTUlEX18maXA9MjA3LjI0MS4yMjYuMjMwJnJlcXVlc3RfaWQ9MTU0ODMwNTk1OTg4N3ExNzJhMjJhNTlhMTA5cTc0MiZ0cz1fX1RTX18mdWE9X19VQV9fwgEAygEA0gEA2AEF4AEA6AEA8AEA%2BAEAgAIAiAIAuAIAwAKA%2BSvIAgDQAgDYAgDiAgIsLA%3D%3D%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C2%2Ci%7C%2Cj%7C%2Ck%7C1548305970129%2Cl%7C23%2Cm%7C1548305962521%2Cn%7C1%2Co%7C&ts=1548305970129', 'i0.hdslb.com/bfs/sycp/creative_img/201901/027729032ad7bbfc8982e06ea5c426e8.jpg']}, 'url': 'http://web.archive.org/web/20190124045920/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190130: {'video': {'【手书】游戏区up主的ヒャダインのじょーじょーゆーじょー': ['https://www.bilibili.com/video/av42002056/', 'i0.hdslb.com/bfs/archive/a921e527c1f38d2abbc9deea43e738f84d41c4dc.jpg'], '【番声】从《盾之勇者成名录》谈谈套路和反套路丨一月新番食用报告（其十）': ['https://www.bilibili.com/video/av41907367/', 'i0.hdslb.com/bfs/archive/4b941f26c27b8afce86abbaea50e7e5203abc984.jpg'], '【白上吹雪/手书】狐 言 乱 语 小 猫 咪': ['https://www.bilibili.com/video/av42038790/', 'i1.hdslb.com/bfs/archive/7ce596f4b66ebee46e5c6ab9d2344bf990088ea3.jpg'], '【乌】合之众': ['https://www.bilibili.com/video/av41902021/', 'i0.hdslb.com/bfs/archive/779d7c5ecdd4179897f419d5e18e8573ab72e18f.jpg'], '【湊あくあ×神楽めあ】LOL的新星，meaqua参上！【League of Legends】': ['https://www.bilibili.com/video/av42007709/', 'i2.hdslb.com/bfs/archive/56b081f6e0ef12a7fa8b4350dd6c6d6a19083ebd.jpg'], '【被窝小剧场】学了三百年动画做出来的儿童动画【第一期】': ['https://www.bilibili.com/video/av41989485/', 'i2.hdslb.com/bfs/archive/db2b20ecdb6ed013fc3780b0e741ea88d46b5b40.jpg'], '【STN剧场 第9期】一镜到底！剧场第一季完结篇': ['https://www.bilibili.com/video/av41984909/', 'i1.hdslb.com/bfs/archive/9055016479513393d4549595badd58ca54b06bb8.jpg'], '【我的中国心】心心B站特供直播': ['https://www.bilibili.com/video/av42001315/', 'i1.hdslb.com/bfs/archive/fe8d81c96a28c1611c2b69e05a7590f2c4f77574.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1955326', 'i0.hdslb.com/bfs/archive/6530eab33643c645506db4affb737b0e5c40fcf8.jpg']}, 'url': 'http://web.archive.org/web/20190130153808/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/28b71a2c7ab7bf0a683858d980b189abae41b1f2.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/1fd2a41ee943588049f5375127471e31402bab2b.png'}, 20190202: {'video': {'【影之诗】影之诗全员给您拜年了': ['https://www.bilibili.com/video/av42298154/', 'i2.hdslb.com/bfs/archive/f0c27a1da8bb1d30b0c6fe6e330c97a3dbf28686.jpg'], '【官方投稿】SawanoHiroyuki[nZk]:Akihito Okano (Porno Graffitti)/「EVERCHiLD」Lyric Video': ['https://www.bilibili.com/video/av42247631/', 'i0.hdslb.com/bfs/archive/f9841a23cd86c4a5f00bafbcad16efdfcb0591c8.jpg'], '2018国产游戏销量盘点，古剑3回本了吗？哪款游戏最赚钱？-游戏侦查冰': ['https://www.bilibili.com/video/av42213380/', 'i0.hdslb.com/bfs/archive/70f983f81f591b4e9b2e202449bd616757ef131a.jpg'], '【极客匠】用JOJO的方式手工制作一个钱包，帅爆了！！！': ['https://www.bilibili.com/video/av42340908/', 'i2.hdslb.com/bfs/archive/e253fddd1476c201ddcb043e6bc700039e54cf46.jpg'], '【史诗/AMV】 幸存者——终焉与反抗': ['https://www.bilibili.com/video/av42320570/', 'i2.hdslb.com/bfs/archive/a2d557197d781fabb0399419693347ed005af876.jpg'], '她代表了TYPE-MOON？《魔法使之夜》人物专辑其一：久远寺有珠': ['https://www.bilibili.com/video/av42291093/', 'i2.hdslb.com/bfs/archive/fc7019d2bb7c6edf2664c288ca88e617960b3a79.jpg'], '【新番吐个爽】啊我死了！这该死的女人竟如此甜美！': ['https://www.bilibili.com/video/av42220645/', 'i1.hdslb.com/bfs/archive/7e0c574b0df71f8f1701b2d3cbc9d3a2a13bdbe7.jpg'], '[柚子社]大柚子国【大帝国OPパロ】': ['https://www.bilibili.com/video/av42248075/', 'i1.hdslb.com/bfs/archive/23f4a71b5e5e0089e77bbae85c1df3eb57273c29.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1949087?from=1002', 'i0.hdslb.com/bfs/archive/fa1ca95432363e8e28ff048d34d11f7290a696e4.jpg']}, 'url': 'http://web.archive.org/web/20190202223059/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/558fcfeea8eba1a6adaef29ba832d8beac3467d4.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/0d34c995d175415638ddeb6074085c961bd86e8e.png'}, 20190205: {'video': {'【灵能百分百手书】LOSER (米津玄师)': ['https://www.bilibili.com/video/av42538209/', 'i0.hdslb.com/bfs/archive/2511889e1e36cb6d1ebc0f3a5f5ebc2a8bca8214.jpg'], 'MeAqua - 从零开始的Minecraft：第一话【Aqua视角】': ['https://www.bilibili.com/video/av42500245/', 'i2.hdslb.com/bfs/archive/af654b2b5b18aebb752e02bd32129fe48b328d0e.jpg'], '【RWBY全员向】来了哦！！！': ['https://www.bilibili.com/video/av42554766/', 'i2.hdslb.com/bfs/archive/7412ffb52d6c98680e69aac34bed49c15c0bbd99.png'], '当丧尸危机爆发 普通人的我们该怎么做【脑洞次位面01 ：丧尸应对理论篇 】': ['https://www.bilibili.com/video/av42497099/', 'i0.hdslb.com/bfs/archive/1d84958785fefb2fb0de47c1e08fc2a23d5e4ebc.jpg'], '黑桐谷歌【生化危机2重制版】里昂A-1': ['https://www.bilibili.com/video/av42540034/', 'i1.hdslb.com/bfs/archive/3688981dd987756076e51be185a9d831057876c7.jpg'], '五姐妹人气逆转？！盾勇竟出神回剧情？史莱姆被删居然..【新番猛料】': ['https://www.bilibili.com/video/av42466017/', 'i1.hdslb.com/bfs/archive/5e6805dc16ce870f1af73cc1f3ed54ca8c06b1e3.jpg'], '【定格动画】乐高超灵魂还原魔性书记舞正式版60帧 辉夜大小姐想让我告白ed': ['https://www.bilibili.com/video/av42522355/', 'i1.hdslb.com/bfs/archive/efb3524094913c5badcf0efe1d44ad8de672fa49.jpg'], '【波喵】cos千花♡书记舞♡黑帮摇带感踩点！': ['https://www.bilibili.com/video/av42596764/', 'i0.hdslb.com/bfs/archive/84974a1ab2e2fdbf3d929b1c96790f5627fe5083.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1990976', 'i0.hdslb.com/bfs/archive/5179041222983d706ef064155397fe60a277b2f8.jpg']}, 'url': 'http://web.archive.org/web/20190205070516/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/8750df57d5bd97603c14b55f500fc88051304576.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/406a488ceae0620f8a716a7189c3d81d9e9938d1.png'}, 20190207: {'video': {'Fate/Grand Order -Cosmos in the Lostbelt- PV': ['https://www.bilibili.com/video/av42230054/', 'i2.hdslb.com/bfs/archive/4d9e345551c695ab04ecbeeebfb354681da56da4.jpg'], '【番声】跪倒在书记的裙下吧！这段血洗B站的舞蹈是怎么做出来的？一月新番跟进报告（其一）': ['https://www.bilibili.com/video/av42764035/', 'i2.hdslb.com/bfs/archive/85563168524425ecdd00eba6b61c7ac18b0a8cc1.jpg'], '【碧蓝航线】独角兽想要唱出Lemon的精髓': ['https://www.bilibili.com/video/av42684155/', 'i0.hdslb.com/bfs/archive/ad214992898428c2df638f5d5a4c3ebc4aeaca98.jpg'], '流光乐夜【2019拜年祭单品】': ['https://www.bilibili.com/video/av36570482/', 'i1.hdslb.com/bfs/archive/00c0db3a35d4a61eff5b6e76a345c0f2e50da4ab.jpg'], '俺寻思这个增幅强袭有点难受，还是火八手办比较实在': ['https://www.bilibili.com/video/av42761181/', 'i2.hdslb.com/bfs/archive/8f4bc2065bf787adc33aaa4aeb4eb68fb3eca5f2.jpg'], '【FGO】贺岁COS短剧——回迦过年！祝各位Master新春大吉！': ['https://www.bilibili.com/video/av42377926/', 'i1.hdslb.com/bfs/archive/1796a287734dc4bf7707217229571bbc6009be66.jpg'], '【2月/OVA】格琳娜人': ['https://www.bilibili.com/video/av42674635/', 'i1.hdslb.com/bfs/archive/1ebe1ec2b495427764705c6d5f361f46cafca017.jpg'], '醉饮苍穹【2019拜年祭单品】': ['https://www.bilibili.com/video/av36928734/', 'i1.hdslb.com/bfs/archive/da1d11f701903aaa25dcda8bcfe7b24269a3dbc2.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1948800?from=1002', 'i0.hdslb.com/bfs/archive/11a642f34d8df13efc5a6b4abb15c16de91410f3.jpg']}, 'url': 'http://web.archive.org/web/20190207053624/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/8750df57d5bd97603c14b55f500fc88051304576.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/406a488ceae0620f8a716a7189c3d81d9e9938d1.png'}, 20190208: {'video': {'2019年H萌贺年祭 属于你我的二次元春晚': ['https://www.bilibili.com/video/av42889485/', 'i0.hdslb.com/bfs/archive/09d360ed8ff1477331ee7a758e930c6422293b7d.jpg'], '【B站限定】大年初一的夏哥': ['https://www.bilibili.com/video/av42805624/', 'i2.hdslb.com/bfs/archive/fc3c805880f509c90b085ed3ed21425e04997a2b.jpg'], '【番声】跪倒在书记的裙下吧！这段血洗B站的舞蹈是怎么做出来的？一月新番跟进报告（其一）': ['https://www.bilibili.com/video/av42764035/', 'i2.hdslb.com/bfs/archive/85563168524425ecdd00eba6b61c7ac18b0a8cc1.jpg'], '【2019·东方华灯宴】': ['https://www.bilibili.com/video/av42807128/', 'i1.hdslb.com/bfs/archive/46d257491816ff5183ad169ec1e268dd3fe4a4c5.jpg'], '【散人】 疯神之路 风浪太强巨晃会被撞到刺上': ['https://www.bilibili.com/video/av42774367/', 'i2.hdslb.com/bfs/archive/b9d508d6a614635d7e53d01e245cb54d1983f50c.jpg'], '【vtuber】让子弹飞五部曲 其一': ['https://www.bilibili.com/video/av42890532/', 'i2.hdslb.com/bfs/archive/c4f3f2c2dc557a58655f0188ebb19a2e96e08511.jpg'], '【怪物猎人生态】猪年说猪-野猪、菌猪、噗吱猪祝大家猪事顺利': ['https://www.bilibili.com/video/av42753803/', 'i0.hdslb.com/bfs/archive/8e382294a7cbd9031cb2a413f6de5170738b687d.jpg'], '【动画公司图鉴】新海诚之下独立动画第一人！studio六花（上）': ['https://www.bilibili.com/video/av42843627/', 'i2.hdslb.com/bfs/archive/c111ec9bc42b6816f8323b76e3aecf630081bf79.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1916897?from=1002', 'i0.hdslb.com/bfs/archive/b42203b52e179b1223b19103182905a0158b01e7.png']}, 'url': 'http://web.archive.org/web/20190208212724/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/8750df57d5bd97603c14b55f500fc88051304576.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/406a488ceae0620f8a716a7189c3d81d9e9938d1.png'}, 20190209: {'video': {'【vtuber】让子弹飞五部曲 其一': ['https://www.bilibili.com/video/av42890532/', 'i2.hdslb.com/bfs/archive/c4f3f2c2dc557a58655f0188ebb19a2e96e08511.jpg'], '【番声】为什么我们都想暴打七海灯子': ['https://www.bilibili.com/video/av42774299/', 'i0.hdslb.com/bfs/archive/750b8a34387e47505ef3e9aab2dcaf334b5ba692.jpg'], '【春节特供】2018年院线电影混剪': ['https://www.bilibili.com/video/av41951026/', 'i1.hdslb.com/bfs/archive/665469dacc259703d8e9d33d6c96049f687d985b.jpg'], '【初音未来】DECO*27 - アイ / AI【原创MV】': ['https://www.bilibili.com/video/av42857943/', 'i2.hdslb.com/bfs/archive/96ed224e97c04866aa8e74f53c1f6b3fdbfe0f6c.jpg'], '【AMV】时间//Time': ['https://www.bilibili.com/video/av42870079/', 'i1.hdslb.com/bfs/archive/a50b9dbe6f054f5e8225077a90311c67f09f2b1b.jpg'], '【B站限定】大年初一的夏哥': ['https://www.bilibili.com/video/av42805624/', 'i2.hdslb.com/bfs/archive/fc3c805880f509c90b085ed3ed21425e04997a2b.jpg'], '【aph】Dover的Charmless Man': ['https://www.bilibili.com/video/av42815022/', 'i2.hdslb.com/bfs/archive/b70735c0e77400774fb5953b0573247205210e7c.jpg'], '【手书/诺雷】乙女解剖': ['https://www.bilibili.com/video/av42846835/', 'i1.hdslb.com/bfs/archive/cbd467fe015727dd575ea69cf25a466480bc3ed9.jpg']}, 'panel': {'': ['https://www.bilibili.com/blackboard/activity-newstar3.html', 'i0.hdslb.com/bfs/archive/d5665415b6d4164135ba51a6cfc8371e97dddeaa.png']}, 'url': 'http://web.archive.org/web/20190209074414/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/8750df57d5bd97603c14b55f500fc88051304576.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/406a488ceae0620f8a716a7189c3d81d9e9938d1.png'}, 20190210: {'video': {'2019年H萌贺年祭 属于你我的二次元春晚': ['https://www.bilibili.com/video/av42889485/', 'i0.hdslb.com/bfs/archive/09d360ed8ff1477331ee7a758e930c6422293b7d.jpg'], '【颠覆B站传统观影体验的视频】逆转裁判阿杰 第一话（测试版）': ['https://www.bilibili.com/video/av42932936/', 'i0.hdslb.com/bfs/archive/af47728bc41ea7a288fc99190b7c207be9d5935a.jpg'], '【手书】游戏区UP们的Voodoo Kingdom': ['https://www.bilibili.com/video/av42860987/', 'i1.hdslb.com/bfs/archive/0780e3b51fc9bf401301bef3b1fdbe2202c867f2.jpg'], '【茶理理】冠世九九八十一神纪（冠世一战+九九八十一+万神纪）mashup版': ['https://www.bilibili.com/video/av42946406/', 'i2.hdslb.com/bfs/archive/2c19b05b6aa57452b7f76fa30a171b00337176bc.jpg'], '【初音未来】DECO*27 - アイ / AI【原创MV】': ['https://www.bilibili.com/video/av42857943/', 'i2.hdslb.com/bfs/archive/96ed224e97c04866aa8e74f53c1f6b3fdbfe0f6c.jpg'], '【官方投稿】SawanoHiroyuki[nZk]:スキマスイッチ /「never gonna change」Lyric Video': ['https://www.bilibili.com/video/av42859776/', 'i1.hdslb.com/bfs/archive/7ec2b535937a46a77d5deb92b6033dc7b424d8b3.jpg'], '【肥皂菌】繁华唱遍': ['https://www.bilibili.com/video/av42700672/', 'i2.hdslb.com/bfs/archive/974d64f02faf0847437862119480eca7a7261a9b.jpg'], '【FGO手书】迦勒底今天的饭': ['https://www.bilibili.com/video/av42939742/', 'i1.hdslb.com/bfs/archive/e4490f924bf5e461ef86e13d0a986e68e643e003.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1429364?from=1002', 'i0.hdslb.com/bfs/archive/13b87bfd8de7a28cc2f4126a333cb7d712364f71.jpg'], '考验兄弟情的时候到了': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C25%2Cb%7Cbilibili%2Cc%7C1%2Cd%7C4%2Ce%7CCJrlARAAGJCeASAAKAAwAzgZQh8xNTQ5NzY0MDEzOTUxcTE3MmEyMmE2MWE4MnEzNTE3SP%2FeiKmNLVIJ5pen6YeR5bGxWhLliqDliKnnpo%2FlsLzkuprlt55iBue%2BjuWbvWgAcAF4gICAgFCAAQCIAfAkkgEPMjA3LjI0MS4yMzIuMTIxmgH%2FAmFsbDpkZWZhdWx0LGVjcG06ZGVmYXVsdCxjcGNUYWdGaWx0ZXI6dW5kZWZpbmVkLGVuaGFuY2VDdHJRRmFjdG9yOnNxdWFyZSxhZE1lY2hhbmlzbU1vbml0b3I6b3RoZXIscGxheXBhZ2VjdHI6ZGlzYWJsZSx1cF9yZWNfZmxvd19jb250cm9sOnVuZGVmaW5lZCxicnVzaF9kdXBsaWNhdGU6ZGVmYXVsdCxwY3RyX2NwbTpjcG0sZGZ4X3NwZWNpZmljX3JhdGlvOnVuZGVmaW5lZCxwY3RyX3YyOmxyX3NlYXJjaCxkeW5hbWljX2Zsb3dfY29udHJvbDpzcGxpdCB0aGUgZmxvdyBieSBtaWQscGN2cjpkbGQsZnJlcUxpbWl0OmRlZmF1bHQsc21hbGxDb25zdW1lVW5pdDpkZWZhdWx0LG91dGVyQmVhdElubmVyOmVuYWJsZSxvdXRlclF1aXQ6ZW5hYmxlMjUsZmRzX3J0dDpkZWZhdWx0oAEAqAEAsgEgn7yNBL9MnenHT87siKgzNtpXpoR9gawXATanR7THF%2BK6AaEBaHR0cHM6Ly9hZC1iaWxpLWRhdGEuYmlsaWdhbWUuY29tL2FwaS9wYy9jbGlja0JpbGk%2FYWRfcGxhbl9pZD0xNTYzMiZtaWQ9X19NSURfXyZpcD0yMDcuMjQxLjIzMi4xMjEmcmVxdWVzdF9pZD0xNTQ5NzY0MDEzOTUxcTE3MmEyMmE2MWE4MnEzNTE3JnRzPV9fVFNfXyZ1YT1fX1VBX1%2FCAQDKAQDSAQDYAQXgAQDoAQDwAQD4AQCAAgCIAgC4AgDAAqCsT8gCANACANgCAOICAiws%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C2%2Ci%7C%2Cj%7C%2Ck%7C1549764025023%2Cl%7C23%2Cm%7C1549764017507%2Cn%7C1%2Co%7C&ts=1549764025023', 'i0.hdslb.com/bfs/sycp/creative_img/201902/af650822495064fe8c47e0db87b4b997.jpg']}, 'url': 'http://web.archive.org/web/20190210020014/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/ad0ab922ad1d8281ac45618dded419078c834d4f.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/a94ccf029bf9634271073e9f619c9f4b40c64ed4.png'}, 20190211: {'video': {'【帝玖管弦乐团】 交响组曲：「紫罗兰永恒花园」': ['https://www.bilibili.com/video/av43026096/', 'i2.hdslb.com/bfs/archive/837f12ef55bcd3f9a11ab9cea3b91cb19b538edd.jpg'], '乙女解剖\u3000歌ってみた【鹿乃】': ['https://www.bilibili.com/video/av42968655/', 'i0.hdslb.com/bfs/archive/3e2ee0c3623c4ea78253baedb993a3a9474cd8eb.jpg'], '【2019东方华灯宴单品】我是谁': ['https://www.bilibili.com/video/av42988958/', 'i1.hdslb.com/bfs/archive/d8129f114c7b838458e92927dbdba1d39f4d5a5d.jpg'], '【约定的梦幻岛手书】【剧透偏雷艾向】光と闇-弾き語りver-': ['https://www.bilibili.com/video/av43074488/', 'i0.hdslb.com/bfs/archive/59821cb3c1d1fed9b2b7b00a6b30ba031d4f13ff.jpg'], '那什么的梦幻岛【含剧透】': ['https://www.bilibili.com/video/av43079830/', 'i1.hdslb.com/bfs/archive/445a5322c2c7504c77d4ff69423bb4fcfaa05ac7.jpg'], '【家教同人】F·I·X·E·R': ['https://www.bilibili.com/video/av43000925/', 'i2.hdslb.com/bfs/archive/a03e388139894b57db91847b1653e4dfdb0eb94f.jpg'], '人性拷问！哆啦A梦五大变态道具，你记得几个？': ['https://www.bilibili.com/video/av43030473/', 'i1.hdslb.com/bfs/archive/c8add34320b98217305bf745165726d7c45ac48c.jpg'], '【果脑风暴】时王最终形态挑战审美极限！战队新作即将来临！': ['https://www.bilibili.com/video/av42967662/', 'i0.hdslb.com/bfs/archive/6a5d9dd633b74e509a577f7809970eae0ccb0a83.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv1975513', 'i0.hdslb.com/bfs/archive/1d517e3035ec1cf420de5f2d29b3f97eb1f7203b.jpg']}, 'url': 'http://web.archive.org/web/20190211044907/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/ce96c1599a42e732c96e08d7e73c6a0c3313b1cd.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/a94ccf029bf9634271073e9f619c9f4b40c64ed4.png'}, 20190212: {'video': {'【碧蓝航线】在瓜游里播放Bad Apple!!': ['https://www.bilibili.com/video/av43169022/', 'i1.hdslb.com/bfs/archive/67b92bf5b0ec20b876a12d235c8a8c5d7cabe82b.jpg'], '六小龄童公然违法！欺世盗名！你才应该向全国人民谢罪！': ['https://www.bilibili.com/video/av43171839/', 'i1.hdslb.com/bfs/archive/d78247bcbdaacd388e515d776631b62ff4c3a705.jpg'], '那什么的梦幻岛【含剧透】': ['https://www.bilibili.com/video/av43079830/', 'i1.hdslb.com/bfs/archive/445a5322c2c7504c77d4ff69423bb4fcfaa05ac7.jpg'], '【B站限定】小狐狸舰B首播(^・ω・^§)ﾉ碧蓝航线': ['https://www.bilibili.com/video/av43144732/', 'i0.hdslb.com/bfs/archive/734541d087c040cf4e32c34759f6be1908e71e12.jpg'], '【JOJO/短片】温泉的奇妙冒险': ['https://www.bilibili.com/video/av43128575/', 'i0.hdslb.com/bfs/archive/f3bdfc511bd68fb599b24d67e0a89087be482129.jpg'], '【肥皂菌】冠世一战': ['https://www.bilibili.com/video/av42704332/', 'i1.hdslb.com/bfs/archive/c9f4f3bffbcd5fa9393873f1fc9e6e7a02b6713c.jpg'], '夏色祭来了哦': ['https://www.bilibili.com/video/av43031096/', 'i2.hdslb.com/bfs/archive/64a91decad7d5a1a8d0b971196aa8ced81105bc1.jpg'], '【帝玖管弦乐团】 交响组曲：「紫罗兰永恒花园」': ['https://www.bilibili.com/video/av43026096/', 'i2.hdslb.com/bfs/archive/837f12ef55bcd3f9a11ab9cea3b91cb19b538edd.jpg']}, 'panel': {'': ['https://www.bilibili.com/bangumi/play/ss26484', 'i0.hdslb.com/bfs/archive/5b66fd62710ff159b53602d99690803abf396945.jpg']}, 'url': 'http://web.archive.org/web/20190212043120/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190213: {'video': {'【2019东方华灯宴单品】东方幻想嘉年华': ['https://www.bilibili.com/video/av43283609/', 'i1.hdslb.com/bfs/archive/9e0386038a78478a80bcac17e1efbe7ee48197b4.jpg'], '【我想吃掉你的胰脏】 最动人的告白 ——“君の膵臓をたべたい”': ['https://www.bilibili.com/video/av43174841/', 'i2.hdslb.com/bfs/archive/b92823fad5ce964fa718c1fa3fcae4d5b33815b4.jpg'], '开场倒贴同居，被老外疯狂吐槽的动画竟甜到肾虚': ['https://www.bilibili.com/video/av43210213/', 'i2.hdslb.com/bfs/archive/24e3b04a6018fd41ff584757281c24678125c306.jpg'], '【FGO】人理之光【迦勒底拜年祭单品】': ['https://www.bilibili.com/video/av42969828/', 'i1.hdslb.com/bfs/archive/b79de2b74b52df80ab05c80e9364db681ddfaa18.jpg'], 'B站能看的无节操逗比搞笑番推荐': ['https://www.bilibili.com/video/av43249598/', 'i1.hdslb.com/bfs/archive/91c536b298cbe06b64307c18d19ffc712b2b857d.jpg'], '北大学霸教你快速学会你想学的任何知识': ['https://www.bilibili.com/video/av43293133/', 'i2.hdslb.com/bfs/archive/0361dcb18017abe2c7c46301edcb50fe529d36a1.jpg'], '五姐妹人气逆袭？！盾勇竟被打出最差评？史莱姆被删哪些..【新番猛料】': ['https://www.bilibili.com/video/av43154753/', 'i1.hdslb.com/bfs/archive/fc5094976bfd8483847e8e6914129a627b28f363.jpg'], '【B站限定直播】画伯夏哥来了哦！2/10': ['https://www.bilibili.com/video/av43185629/', 'i2.hdslb.com/bfs/archive/fc3c805880f509c90b085ed3ed21425e04997a2b.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2050119?from=1002', 'i0.hdslb.com/bfs/archive/bc59571465d9376847f7dd69e0a1ad310a1f9607.jpg']}, 'url': 'http://web.archive.org/web/20190213125212/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190214: {'video': {'【2019东方华灯宴单品】东方幻想嘉年华': ['https://www.bilibili.com/video/av43283609/', 'i1.hdslb.com/bfs/archive/9e0386038a78478a80bcac17e1efbe7ee48197b4.jpg'], '洛天依，原创《勾指起誓》': ['https://www.bilibili.com/video/av43426592/', 'i0.hdslb.com/bfs/archive/7591c89704b448cd94a0cf749e65a39833c68d4f.png'], '【夏色祭】What dose the fox say?': ['https://www.bilibili.com/video/av43421191/', 'i1.hdslb.com/bfs/archive/7f6389f854d6c61708fb49ff6dcf308f797967e4.jpg'], '【崩坏3】动画op！月下与舰长的恋爱循环【MMD＆手书】': ['https://www.bilibili.com/video/av43290684/', 'i1.hdslb.com/bfs/archive/271f1cc20b478254cc45866a36b409976e6b853a.jpg'], '去你的情人节【UP主今年又疯了】': ['https://www.bilibili.com/video/av43359437/', 'i2.hdslb.com/bfs/archive/acf631b8d9a72d066b7e5849422a805efe8754df.jpg'], '【怪物猎人生态】炎王龙夫妇-这对秀起恩爱来FFF团也无能为力！情人节专题？': ['https://www.bilibili.com/video/av43437828/', 'i0.hdslb.com/bfs/archive/9b8ff4b6df14ca1bbc61e39374ccb6125e3655c5.jpg'], '【日语版】冠世一战【中二热血少年！声优台词灵魂注入！】': ['https://www.bilibili.com/video/av43276945/', 'i1.hdslb.com/bfs/archive/065e3c379b53ce4dbfd5829eb1925b20600aba93.jpg'], 'MeAqua - 从零开始的Minecraft：第五话【Aqua视角】': ['https://www.bilibili.com/video/av43393041/', 'i1.hdslb.com/bfs/archive/9bf006c5c42f173573d7723e222c3438ab7b9dc6.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2061673?from=1002', 'i0.hdslb.com/bfs/archive/8cb65d522ae8a0792980b07585f11e7bb91da2d5.png']}, 'url': 'http://web.archive.org/web/20190214234126/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190215: {'video': {'【2019东方华灯宴单品】东方幻想嘉年华': ['https://www.bilibili.com/video/av43283609/', 'i1.hdslb.com/bfs/archive/9e0386038a78478a80bcac17e1efbe7ee48197b4.jpg'], '【神楽めあ】黎明与萤火/夜明けと蛍【PV付】': ['https://www.bilibili.com/video/av43351298/', 'i0.hdslb.com/bfs/archive/48efa4944ff9babf5bbe8b067417bda02de20c8d.jpg'], '【东方手书】米国小妖精来了哦【全程高能】': ['https://www.bilibili.com/video/av43372730/', 'i2.hdslb.com/bfs/archive/c278fec99787f505c4484dbbc9f108d178dd1621.jpg'], '【某某阳】Apex跑酷教学，身法大师速成攻略！': ['https://www.bilibili.com/video/av43379168/', 'i2.hdslb.com/bfs/archive/4f2c2668685517a85261dd51d93611b55370bf79.jpg'], '【夏色祭】What dose the fox say?': ['https://www.bilibili.com/video/av43421191/', 'i1.hdslb.com/bfs/archive/7f6389f854d6c61708fb49ff6dcf308f797967e4.jpg'], '【崩坏3】动画op！月下与舰长的恋爱循环【MMD＆手书】': ['https://www.bilibili.com/video/av43290684/', 'i1.hdslb.com/bfs/archive/271f1cc20b478254cc45866a36b409976e6b853a.jpg'], '【日语版】冠世一战【中二热血少年！声优台词灵魂注入！】': ['https://www.bilibili.com/video/av43276945/', 'i1.hdslb.com/bfs/archive/065e3c379b53ce4dbfd5829eb1925b20600aba93.jpg'], '【洛天依原创】自暴自弃': ['https://www.bilibili.com/video/av43377419/', 'i1.hdslb.com/bfs/archive/66f5c223591bf7f51f53f4b8dbb570519c4eb362.jpg']}, 'panel': {'准备进入魔法世界！': ['https://www.bilibili.com/blackboard/topic/activity-sP5KyfLJ5.html', 'i0.hdslb.com/bfs/archive/c1cdc165fa57cfa48b2fd0dfe017a54a2ac1c9a7.jpg'], '蒙娜丽莎赝作大量出现！？': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C25%2Cb%7Cbilibili%2Cc%7C0%2Cd%7C4%2Ce%7CCLPXARAAGL2fASAAKAAwAzgZQh4xNTUwMTkwODMxMTk1cTE3MmEyM2E2M2E3NHE2MDZI28zL9I4tUgnml6fph5HlsbFaEuWKoOWIqeemj%2BWwvOS6muW3nmIG576O5Zu9aAFwAHiAgICAUIABAIgB7SKSAQ8yMDcuMjQxLjIzMi4xMjCaAZEDYWxsOmRlZmF1bHQsZWNwbTpkZWZhdWx0LGNwY1RhZ0ZpbHRlcjp1bmRlZmluZWQsZW5oYW5jZUN0clFGYWN0b3I6c3F1YXJlLGFkTWVjaGFuaXNtTW9uaXRvcjpvdGhlcixwbGF5cGFnZWN0cjpkaXNhYmxlLHVwX3JlY19mbG93X2NvbnRyb2w6dW5kZWZpbmVkLGJydXNoX2R1cGxpY2F0ZTpkZWZhdWx0LHBjdHJfY3BtOmNwbSxkZnhfc3BlY2lmaWNfcmF0aW86dW5kZWZpbmVkLHBjdHJfdjI6bHIsZHluYW1pY19mbG93X2NvbnRyb2w6c3BsaXQgdGhlIGZsb3cgYnkgbWlkLHBjdnI6Ym90aF9hXzFfYl8wLjA1X2NfMV9mXzFfMS41LGZyZXFMaW1pdDpkZWZhdWx0LHNtYWxsQ29uc3VtZVVuaXQ6ZGVmYXVsdCxvdXRlckJlYXRJbm5lcjpkZWZhdWx0LG91dGVyUXVpdDplbmFibGUyNSxmZHNfcnR0OmRlZmF1bHSgAQCoAQCyASBAYVlTZOJE7G%2B731dWLUT0vYVbdA54lxuedSF4ze8pHroBnwFodHRwczovL2FkLWJpbGktZGF0YS5iaWxpZ2FtZS5jb20vYXBpL3BjL2NsaWNrQmlsaT9hZF9wbGFuX2lkPTE3NDMmbWlkPV9fTUlEX18maXA9MjA3LjI0MS4yMzIuMTIwJnJlcXVlc3RfaWQ9MTU1MDE5MDgzMTE5NXExNzJhMjNhNjNhNzRxNjA2JnRzPV9fVFNfXyZ1YT1fX1VBX1%2FCAQDKAQDSAQDYAQXgAQDoAQDwAQD4AQCAAgCIAgC4AgDAAqCsT8gCANACANgCAOICAiws%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C2%2Ci%7C%2Cj%7C%2Ck%7C1550190847401%2Cl%7C23%2Cm%7C1550190840715%2Cn%7C1%2Co%7C&ts=1550190847401', 'i0.hdslb.com/bfs/sycp/creative_img/201902/01d751f4bb83382e2aa8e189aa25ff69.jpg'], '原画呈现守望先锋联赛2019赛季': ['https://live.bilibili.com/14073662', 'i0.hdslb.com/bfs/archive/40536b5186d046b3448364a010a038843ef53c83.png'], 'Apex：成为英雄！': ['https://www.bilibili.com/read/cv2060768', 'i0.hdslb.com/bfs/archive/cd9c94cb500a5e147004a11661d1322ef66905a8.jpg']}, 'url': 'http://web.archive.org/web/20190215003352/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190216: {'video': {'【湊あくあ】インドア系ならトラックメイカー【唱了首歌】': ['https://www.bilibili.com/video/av43635970/', 'i2.hdslb.com/bfs/archive/418b05e539093ffe6a5077820d6d5ad72ed862e1.jpg'], '【Aliga】书记舞️(￣^￣)ゞ我的IQ可不止3噢！辉夜大小姐想让我告白ed': ['https://www.bilibili.com/video/av43548666/', 'i2.hdslb.com/bfs/archive/e85068746d0957ccd697cf45308b406407480eea.jpg'], '「ZERO-GO」/ ピノキオピー- 零号 [Album trailer]': ['https://www.bilibili.com/video/av43473819/', 'i0.hdslb.com/bfs/archive/551433957dfed0c522804eadf966bca9631b45b6.jpg'], '【灯泡】30多个动漫人物同屏大聚会！？这谁顶得住啊？': ['https://www.bilibili.com/video/av43447053/', 'i0.hdslb.com/bfs/archive/755c1025eef4e32ea9b7d5aff05bcfefc90b5386.jpg'], '【游戏侦查冰】投资千万的国产独立游戏。': ['https://www.bilibili.com/video/av43534689/', 'i1.hdslb.com/bfs/archive/7822f81d8eb094cf9b1694228565aae9af2be021.jpg'], '【オリジナル】No Sweet N❤︎Life【初音ミク】': ['https://www.bilibili.com/video/av43553175/', 'i2.hdslb.com/bfs/archive/505a1837a52ab3116bb1916f6ff395a9f3de5d29.jpg'], '【湊あくあ】爆音表白湊阿夸': ['https://www.bilibili.com/video/av43499033/', 'i1.hdslb.com/bfs/archive/a85e66a863048ce13f68fb78c8be51bb6e764f85.jpg'], '洛天依，原创《勾指起誓》': ['https://www.bilibili.com/video/av43426592/', 'i0.hdslb.com/bfs/archive/7591c89704b448cd94a0cf749e65a39833c68d4f.png']}, 'panel': {'': ['https://www.bilibili.com/blackboard/activity-APEXzm.html', 'i0.hdslb.com/bfs/archive/4a29988e9141fa31bd18d35cbd9d47dda60778d4.png'], '可以和崽们打牌啦！': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C25%2Cb%7Cbilibili%2Cc%7C1%2Cd%7C4%2Ce%7CCLPXARAAGIihASAAKAAwAzgZQh8xNTUwMzI2NDU5ODY2cTE3MmEyM2E1OWEyMDhxNTQwSNrbobWPLVIJ5pen6YeR5bGxWhLliqDliKnnpo%2FlsLzkuprlt55iBue%2BjuWbvWgBcAF4gICAgFCAAQCIAe0ikgEPMjA3LjI0MS4yMjYuMjMwmgGBA2FsbDpjcGNfY3Jvd2RfdGFyZ2V0LGVjcG06ZGVmYXVsdCxjcGNUYWdGaWx0ZXI6dW5kZWZpbmVkLGVuaGFuY2VDdHJRRmFjdG9yOmRlZmF1bHQsYWRNZWNoYW5pc21Nb25pdG9yOm90aGVyLHBsYXlwYWdlY3RyOmRpc2FibGUsdXBfcmVjX2Zsb3dfY29udHJvbDp1bmRlZmluZWQsYnJ1c2hfZHVwbGljYXRlOmRlZmF1bHQscGN0cl9jcG06Y3BtLGRmeF9zcGVjaWZpY19yYXRpbzp1bmRlZmluZWQscGN0cl92MjpscixkeW5hbWljX2Zsb3dfY29udHJvbDpzcGxpdCB0aGUgZmxvdyBieSBtaWQscGN2cjpkbGQsZnJlcUxpbWl0OmRlZmF1bHQsc21hbGxDb25zdW1lVW5pdDpkZWZhdWx0LG91dGVyQmVhdElubmVyOmVuYWJsZSxvdXRlclF1aXQ6ZGVmYXVsdCxmZHNfcnR0OmRlZmF1bHSgAQCoAQCyASBpfMTW3wCWhmOGdmABRE5diZU2X75s3WmcIUA0nv9kq7oBoQFodHRwczovL2FkLWJpbGktZGF0YS5iaWxpZ2FtZS5jb20vYXBpL3BjL2NsaWNrQmlsaT9hZF9wbGFuX2lkPTE3MDI5Jm1pZD1fX01JRF9fJmlwPTIwNy4yNDEuMjI2LjIzMCZyZXF1ZXN0X2lkPTE1NTAzMjY0NTk4NjZxMTcyYTIzYTU5YTIwOHE1NDAmdHM9X19UU19fJnVhPV9fVUFfX8IBAMoBANIBANgBBeABAOgBAPABAPgBAIACAIgCALgCAMACoKxPyAIA0AIA2AIA4gICLCw%3D%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C2%2Ci%7C%2Cj%7C%2Ck%7C1550326470917%2Cl%7C23%2Cm%7C1550326464717%2Cn%7C1%2Co%7C&ts=1550326470917', 'i0.hdslb.com/bfs/sycp/creative_img/201902/436af661f42dcf6f91b84038debe7031.jpg']}, 'url': 'http://web.archive.org/web/20190216141420/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/e0223c831a9a436efb1cc91177891baa300c2501.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/4d27b106d16d2ba38bac6b497f80ae4e33a66ce0.png'}, 20190217: {'video': {'Galgame吧「Elite Galgame 2018」评选结果': ['https://www.bilibili.com/video/av43608832/', 'i0.hdslb.com/bfs/archive/6fd397b88b58b22124a44240585771a73643e740.jpg'], '【洛天依乐正绫原创】婆婆纳甸长河长2.0【大司徒】': ['https://www.bilibili.com/video/av43735926/', 'i2.hdslb.com/bfs/archive/98ed2cf9bd4b8d76cb7a86d124fab04da8bb769e.jpg'], '【手绘】假面骑士exaidVS假面骑士cronus': ['https://www.bilibili.com/video/av43714415/', 'i2.hdslb.com/bfs/archive/819b57c0da0607698e5bea427a67b883eb39b480.jpg'], '【赤九玖】书记舞❤圆润啦(○｀ 3′○)辉夜大小姐想让我告白ed': ['https://www.bilibili.com/video/av43725573/', 'i2.hdslb.com/bfs/archive/c9e9b835f32e4d3caa0857739191f87dae05d03c.jpg'], '【乱入】三位智障勇者在盾勇的世界会发生什么事？': ['https://www.bilibili.com/video/av43715586/', 'i1.hdslb.com/bfs/archive/df02dd206679a48fa671f77438f045d739846ab0.jpg'], '【洛天依】moss什么的，不干了啦【微量莫强求】': ['https://www.bilibili.com/video/av43749373/', 'i2.hdslb.com/bfs/archive/a422085522519585a879f5740a6d9f76b3d7f5da.jpg'], '曼珠沙華 / まふまふ': ['https://www.bilibili.com/video/av43639346/', 'i0.hdslb.com/bfs/archive/80481c09edb5134cc8e3ed73f66bb59669ba482c.jpg'], '如何用PR做出拉镜晃动': ['https://www.bilibili.com/video/av43688727/', 'i0.hdslb.com/bfs/archive/2bd87361e7844a79210831136130fe3c0862e10d.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2086245?from=1002', 'i0.hdslb.com/bfs/archive/997a6493c3e2919faed71cefe6fdf0ba5d52261e.jpg'], '英雄们！展示你的传奇战斗吧！': ['https://www.bilibili.com/blackboard/activity-APEX.html', 'i0.hdslb.com/bfs/archive/8556e55536e38fa7fbca3c52a5e623148ed375ae.jpg']}, 'url': 'http://web.archive.org/web/20190217162314/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190218: {'video': {'【藤原书记】红军最强大': ['https://www.bilibili.com/video/av43643375/', 'i1.hdslb.com/bfs/archive/f1b01ae575473d4d1015c14c550ff16ac9ec1f6c.jpg'], '【夏歌】拜托了darling': ['https://www.bilibili.com/video/av43841630/', 'i1.hdslb.com/bfs/archive/b099aed27cb87d33d3e584bf671acf405d0cc2c0.jpg'], '【手绘】假面骑士exaidVS假面骑士cronus': ['https://www.bilibili.com/video/av43714415/', 'i2.hdslb.com/bfs/archive/819b57c0da0607698e5bea427a67b883eb39b480.jpg'], '【乱入】三位智障勇者在盾勇的世界会发生什么事？': ['https://www.bilibili.com/video/av43715586/', 'i1.hdslb.com/bfs/archive/df02dd206679a48fa671f77438f045d739846ab0.jpg'], '【白上吹雪×夏色祭】夜间放送来啦！是久违了的联动杂谈じゃい(^・ω・^§)ﾉ': ['https://www.bilibili.com/video/av43769476/', 'i0.hdslb.com/bfs/archive/a019268e7d09d2db2f0dcd02ff352f84e5ef2b25.jpg'], '【洛天依】moss什么的，不干了啦【微量莫强求】': ['https://www.bilibili.com/video/av43749373/', 'i2.hdslb.com/bfs/archive/a422085522519585a879f5740a6d9f76b3d7f5da.jpg'], '【三/茶/银/漏/KB】冠世一战 抒情版【你从未见过的组合！】': ['https://www.bilibili.com/video/av43769371/', 'i0.hdslb.com/bfs/archive/a2524ac861ce1e3640346e8fc71e02c26244e992.jpg'], '一个你点进来就出不去的游戏视频': ['https://www.bilibili.com/video/av43845211/', 'i2.hdslb.com/bfs/archive/5a2e92b2b1d72b9fbcb7a1f278bd8c10c28340c7.jpg']}, 'panel': {'发车啦！': ['https://www.bilibili.com/read/cv2095034', 'i0.hdslb.com/bfs/archive/5c1ad0c27885c11d9de7729abd3dd20d923ce745.jpg'], '英雄们！展示你的传奇战斗吧！': ['https://www.bilibili.com/blackboard/activity-APEX.html', 'i0.hdslb.com/bfs/archive/8556e55536e38fa7fbca3c52a5e623148ed375ae.jpg'], '做真香料理，赢豪华奖励': ['https://www.bilibili.com/blackboard/activity-yJ1jz4Ijr.html', 'i0.hdslb.com/bfs/archive/ea6ecfe543c90515993aadf283e9f92951bf3650.jpg'], '为美丽的生命献上花朵': ['https://www.bilibili.com/read/cv2086245?from=1002', 'i0.hdslb.com/bfs/archive/997a6493c3e2919faed71cefe6fdf0ba5d52261e.jpg']}, 'url': 'http://web.archive.org/web/20190218153131/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190220: {'video': {'【Overidea】唱吧！中日友好春节直播！2019【Bilibili】': ['https://www.bilibili.com/video/av43926188/', 'i0.hdslb.com/bfs/archive/f6ae8e21647ef500529fc18c616f17c9b7db99b4.jpg'], '【夏歌】拜托了darling': ['https://www.bilibili.com/video/av43841630/', 'i1.hdslb.com/bfs/archive/b099aed27cb87d33d3e584bf671acf405d0cc2c0.jpg'], '喵探长福雷【2019拜年祭单品】': ['https://www.bilibili.com/video/av43927060/', 'i2.hdslb.com/bfs/archive/1a9c8bcef55991503e1259f24820626a2767f916.jpg'], '【碧蓝航线】不断称赞我的驱逐舰Z23老师': ['https://www.bilibili.com/video/av43951606/', 'i2.hdslb.com/bfs/archive/74f5b373f85b0d9059e833c580484bc2e0497619.jpg'], '炫酷又精巧的戏中戏：中传毕设《Story》': ['https://www.bilibili.com/video/av43830977/', 'i2.hdslb.com/bfs/archive/41c62607ea6fbf8ab518ee6ea963ef26c5098954.jpg'], '【呜哝x奶果】魔性书记舞（精分鬼畜 内有蟑螂）': ['https://www.bilibili.com/video/av43822719/', 'i0.hdslb.com/bfs/archive/017274a1e724ae3f56ec4b6584015294fdbb8e85.jpg'], '辉夜大小姐想让我告白OP 现场完整版地上波首次公开 ラブ・ドラマティック 鈴木雅之': ['https://www.bilibili.com/video/av43840720/', 'i1.hdslb.com/bfs/archive/8ab71c46f8f1463170bdf0de1178fcd2e7decbd7.jpg'], '【番声】一月真正的第一新番！日本动画史上第一权谋神剧！每周胡说八道环节（其四）': ['https://www.bilibili.com/video/av43841131/', 'i2.hdslb.com/bfs/archive/390fbc57430365555bfe2f521d10fafbf1d8e298.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2095034', 'i0.hdslb.com/bfs/archive/5c1ad0c27885c11d9de7729abd3dd20d923ce745.jpg'], '英雄们！展示你的传奇战斗吧！': ['https://www.bilibili.com/blackboard/activity-APEX.html', 'i0.hdslb.com/bfs/archive/8556e55536e38fa7fbca3c52a5e623148ed375ae.jpg'], '【专访】RNG Karsa：希望2019赛季能多Carry一些': ['https://www.bilibili.com/read/cv2046392?from=1002', 'i0.hdslb.com/bfs/archive/1afed7272ce7de9bfd8ea2df8d7d40f81c35632b.jpg']}, 'url': 'http://web.archive.org/web/20190220034904/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190221: {'video': {'HIMEHINA『人型』MV': ['https://www.bilibili.com/video/av44175308/', 'i2.hdslb.com/bfs/archive/608430e1896756471b0b4880da9e4cd9b6291c43.jpg'], '【手绘/完整版】爽爽子也要跳书记舞蹈（经费充足/全程流畅）': ['https://www.bilibili.com/video/av44186833/', 'i1.hdslb.com/bfs/archive/78f27007198a13c956fd03c58239f500e7e97547.jpg'], '【還願】插曲码头姑娘合唱版（巩莉芳&杜美心）': ['https://www.bilibili.com/video/av44136941/', 'i0.hdslb.com/bfs/archive/28ac4a1b14c104d462dff820f13b71312d9ae016.jpg'], '佛道合拍，弘扬文化的国产恐gao怖xiao游戏《还愿》P1': ['https://www.bilibili.com/video/av44214231/', 'i1.hdslb.com/bfs/archive/5f90611c186b176f20dbbdf367b971dcdc81a8ba.jpg'], '还愿Devotion | 湾湾解说 | 玩之前必知的七大民俗文化背景 AdamDD': ['https://www.bilibili.com/video/av44036648/', 'i2.hdslb.com/bfs/archive/171a156fe6db1baab0a81f6850f8fd510e5c9cc3.jpg'], '王老菊的乡村爱情故事04：波西亚情圣': ['https://www.bilibili.com/video/av44028741/', 'i0.hdslb.com/bfs/archive/db349061fc0f37a234e2fae09d6539024404ce6e.jpg'], '【白上吹雪x癒月巧可】极限俄罗斯方块大会！漏〇极限对战【宇森ひなこx犬山玉姬】': ['https://www.bilibili.com/video/av44091415/', 'i0.hdslb.com/bfs/archive/c3c918536fb24d4c258bc2455688281f2c720a65.jpg'], '【官方中文】第13回东方M-1漫才大赛 [中日双语字幕]': ['https://www.bilibili.com/video/av44211329/', 'i0.hdslb.com/bfs/archive/fa6c8f425f6c2f7b95ac54b286507e77f5469d14.jpg']}, 'panel': {'': ['https://www.bilibili.com/blackboard/topic/activity-Zcoq8mjHw.html', 'i0.hdslb.com/bfs/archive/8eefb69e2d80a923a62e8789fdaa29e79b5592f3.jpg'], '奥斯卡电影补片计划启动！': ['https://www.bilibili.com/blackboard/topic/activity-vfa06G3wf.html', 'i0.hdslb.com/bfs/archive/6b0d8030f906d032f921c1251d6ce6ed02c40972.jpg']}, 'url': 'http://web.archive.org/web/20190221210746/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190224: {'video': {'【超还原/V+版KDA】这是我做过最炫酷的视频了，收下吧！观众姥爷！【学动画三年系列】': ['https://www.bilibili.com/video/av44381048/', 'i1.hdslb.com/bfs/archive/4d63ea15200ec055d0cc6156b483863f1e38343f.jpg'], '【金庸群像】PV还原!——《冠世一战》真人版MV': ['https://www.bilibili.com/video/av44361730/', 'i0.hdslb.com/bfs/archive/bc5cc4be84f79224cae0ac8d2a74d0860c00495c.jpg'], '【游戏部】【翻唱】Lemon/米津玄師(Covered by风见凉)【Melon】': ['https://www.bilibili.com/video/av44335526/', 'i1.hdslb.com/bfs/archive/db24a3019015619d2c25f2bb9f3af39d4ccaece3.jpg'], '【fate/grand order】这次温泉据说是混浴——鬼乐百重塔活动攻略': ['https://www.bilibili.com/video/av44321748/', 'i1.hdslb.com/bfs/archive/b227d8433fb7db6f77b018161e53ee3b8f6d7374.jpg'], '【王老菊】我的回合，叠甲！': ['https://www.bilibili.com/video/av44461869/', 'i2.hdslb.com/bfs/archive/5343c8e1826882ca71ad87c9c770f0f752d14dae.jpg'], '【沙雕游戏】心心的问题发言': ['https://www.bilibili.com/video/av44315933/', 'i1.hdslb.com/bfs/archive/c10fc9259f386c5fbb43be0f05d29c3f9dcbbe92.jpg'], '【老E】很生气！所以我要发泄！': ['https://www.bilibili.com/video/av44467514/', 'i2.hdslb.com/bfs/archive/0e07443ca74c823da04117c127223220bed63b9f.jpg'], '君色に染まる - TOKOTOKO（西沢さんP） feat.GUMI': ['https://www.bilibili.com/video/av44425904/', 'i0.hdslb.com/bfs/archive/78629e2c9d0fcb59401edfb9153eb9019f257d0a.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2129296', 'i0.hdslb.com/bfs/archive/f89f561b60a83963edb2c25c40f6f078de25106b.jpg'], '18h不脱妆，自然不假面': ['https://cm.bilibili.com/cm/api/fees/pc/sync/v2?msg=a%7C25%2Cb%7Cbilibili%2Cc%7C1%2Cd%7C4%2Ce%7CCLrvARAAGJaiASAAKAAwHTgZQh8xNTUxMDI0OTc0MTk4cTE3MmEyM2E0OGEyNTRxNDgySPbSq4KSLVIJ5pen6YeR5bGxWhLliqDliKnnpo%2FlsLzkuprlt55iBue%2BjuWbvWgBcAF4gICAgFCAAQCIAYwmkgEPMjA3LjI0MS4yMjUuMjI3mgGaA2FsbDpjcGNfY3Jvd2RfdGFyZ2V0LGVjcG06ZGVmYXVsdCxjcGNUYWdGaWx0ZXI6dW5kZWZpbmVkLGVuaGFuY2VDdHJRRmFjdG9yOmRlZmF1bHQsYWRNZWNoYW5pc21Nb25pdG9yOm90aGVyLHBsYXlwYWdlY3RyOmRpc2FibGUsdXBfcmVjX2Zsb3dfY29udHJvbDp1bmRlZmluZWQsYnJ1c2hfZHVwbGljYXRlOmRlZmF1bHQscGN0cl9jcG06Y3BtLGRmeF9zcGVjaWZpY19yYXRpbzp1bmRlZmluZWQscGN0cl92MjpscixkeW5hbWljX2Zsb3dfY29udHJvbDpzcGxpdCB0aGUgZmxvdyBieSBtaWQscGN2cjpib3RoX2FfMV9iXzAuMDVfY18xX2ZfMV8xLjUsZnJlcUxpbWl0OmRlZmF1bHQsc21hbGxDb25zdW1lVW5pdDpkZWZhdWx0LG91dGVyQmVhdElubmVyOmRlZmF1bHQsb3V0ZXJRdWl0OmRlZmF1bHQsZmRzX3J0dDpkZWZhdWx0oAEAqAEAsgEg40r06tU5Z2PF7W56%2FU39UTH%2FVXKj4GE9BSmWdkwzJ7q6AXJodHRwOi8vYWQuZG91YmxlY2xpY2submV0L2RkbS90cmFja2Nsay9OODg5Ny4zMjk5NTM3L0IyMjM0NTI5NS4yNDA4NjUzNTM7ZGNfdHJrX2FpZD00Mzc2MzUzOTA7ZGNfdHJrX2NpZD0xMTI1MzE4NDDCAQDKAQDSAQDYAQXgAQDoAQDwAQD4AQCAAgCIAgC4AgDAAgDIAgDQAgDYAgDiAgIsLA%3D%3D%2Cf%7Cclick_sync_3%2Cg%7C1%2Ch%7C2%2Ci%7C%2Cj%7C%2Ck%7C1551024991868%2Cl%7C23%2Cm%7C1551024986760%2Cn%7C1%2Co%7C&ts=1551024991868', 'i0.hdslb.com/bfs/sycp/creative_img/201902/b3820d8335d7b9ed4c6d775ff99e9a53.jpg'], '我们偷的，是羁绊！': ['https://www.bilibili.com/video/av44379455/', 'i0.hdslb.com/bfs/archive/9b5e5fc32f5f8428d717c0c0b4e6bcf0c88bbd7a.png']}, 'url': 'http://web.archive.org/web/20190224161615/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/6c42c40ed54f4bb5ea491894aff693878afa6580.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/08f98bb10251bb89461c0f3d50c864327b1ac05d.png'}, 20190226: {'video': {'神乐mea的堕落【meaqua 夏色吹雪】': ['https://www.bilibili.com/video/av44551897/', 'i0.hdslb.com/bfs/archive/19c7ebd1445518c893e95da8411f6228e355dc15.jpg'], '【该细还得细】FGO国服《节分酒宴绘卷 鬼乐百重塔》攻略': ['https://www.bilibili.com/video/av44276085/', 'i0.hdslb.com/bfs/archive/17fbe88c8a5db724c20ba6519cca75b9495aaa8f.jpg'], '【千秋岁引】橙翼、绯村柯北、流浪的蛙蛙、卡修Rui、小爱的妈、祖娅纳惜': ['https://www.bilibili.com/video/av44566111/', 'i0.hdslb.com/bfs/archive/679aa5fd00b9ce3202b9813f9fce715f8cc469d2.jpg'], '【定格动画】高达魔性书记舞，高达宅舞团出道！~辉夜大小姐想让我告白': ['https://www.bilibili.com/video/av44600925/', 'i2.hdslb.com/bfs/archive/c1f37ca1f59f67d37c4d585cd793dc5c1bc02d47.jpg'], 'b站最真实分享：如果肚子不会饿 我愿意玩一辈子游戏': ['https://www.bilibili.com/video/av44583565/', 'i2.hdslb.com/bfs/archive/e9d5ad484fe1c73d9d175005472261d17636b740.jpg'], '比利王深情演唱「一Van年以后」': ['https://www.bilibili.com/video/av44469382/', 'i0.hdslb.com/bfs/archive/10f54fc52cb07a58793898b0319807ff48f20f4b.jpg'], '【神楽めあ】再见Midnight/さよならミッドナイト': ['https://www.bilibili.com/video/av44596341/', 'i1.hdslb.com/bfs/archive/91a4cce07b5e131503b57fa99506356982006ed7.jpg'], '【王老菊】我的回合，叠甲！': ['https://www.bilibili.com/video/av44461869/', 'i2.hdslb.com/bfs/archive/5343c8e1826882ca71ad87c9c770f0f752d14dae.jpg']}, 'panel': {'': ['https://www.bilibili.com/read/cv2002520?from=1002', 'i0.hdslb.com/bfs/archive/911a93be6d5767ebcd18e95ccd5fb2326627d902.jpg'], '他们全身都是圈粉点': ['https://www.bilibili.com/read/cv2149275', 'i0.hdslb.com/bfs/archive/860d0b9f396403c6b49032e9643375c4338f4faf.jpg']}, 'url': 'http://web.archive.org/web/20190226033042/https://www.bilibili.com/', 'headerUrl': 'i0.hdslb.com/bfs/archive/24e031e495699e234526586deb80c65d337cbe4d.png', 'logoUrl': 'i0.hdslb.com/bfs/archive/f612c0b3c80c42aa2f00de067f4c11f0ef873ac1.png'}, }
    function dayMove(dDict,limit,y,m,n){
    //目标字典，最大的偏移天数，年增减，月增减，日增减
    function yearM(year){
        if((year%4==0 && year%100!=0) || year%400==0)return [31,29,31,30,31,30,31,31,30,31,30,31]
        else return [31,28,31,30,31,30,31,31,30,31,30,31]
    }
    function mChange(yyyy,mm){
        while (mm>11){
            mm-=12
            yyyy+=1}
        while(mm<0){
            mm+=12
            yyyy-+1}
        return [yyyy,mm]
    }
    function dChange(yyyy,mm,dd){
        while(dd>yearM(yyyy)[mm]){
            dd-=yearM(yyyy)[mm]
            mm+=1
            a=mChange(yyyy,mm)
            mm=a[1]
            yyyy=a[0]
        }
        while(dd<1){
            mm-=1
            a=mChange(yyyy,mm)
            mm=a[1]
            yyyy=a[0]
            dd+=yearM(yyyy)[mm]
        }
        return [yyyy,mm,dd]

    }
    d=new Date()
    var yyyy=d.getFullYear()+y
    var mm=d.getMonth()+m
    a=mChange(yyyy,mm)
    yyyy=a[0];mm=a[1]
    var dd=d.getDate()+n
    a=dChange(yyyy,mm,dd)
    yyyyy=a[0];mm=a[1];dd=a[2]


    var monLis=yearM(d.getFullYear())
    num=0
    var date

    while(num<=limit){


        //优先减天数
        for(i=1;i<=2;i++){
            var years=yyyy;var months=mm;var days=dd
            days+=num
            a=dChange(years,months,days)
            years=a[0];months=a[1];days=a[2]
            date=years*10000+(months+1)*100+days
            if(dDict[date]){console.log(date);return date }
            //加天数
            num*=-1
        }
        num+=1
    }
    return ('不在范围内')
}
    let css=`#app{
            width: 90%;
            border: 2px solid rgb(187, 187, 187);
            padding: 0.6%;
            margin: 0 auto;
            border-radius: 20px;
        }
        .window{
            width: 28.21%;
            position: absolute;
            overflow: auto;

        }
        .box{
            width: 1000%;
        }
        .box div{
            float: left;
        }
        .box div a img{
            height: 100%;
            width: auto;
        }
        .desk{
            width: 66.66%;
            margin-left: 33.33%;
            font-size: 0;
            display: block;
            padding: 0;
            position: relative;
            left: 4%;

        }
        .desk li{
            width: 23%;
            margin:  0 auto;
            padding: 1%;
            border:0;
            min-width: 60px;
            display: inline-block;
            list-style: nano;
            font-size: 16px;
            vertical-align: bottom;

        }
        .desk li a img{
            width: 100%;
            border-radius: 10px;
            margin-bottom: 5px;
        }
        .desk li a div{
            width: 100%;
            height: 30px;
            overflow:hidden;
            font-size: 14px;
            line-height: 15px;
            color: black;
        }
        .desk li a{
            text-decoration:none;
        }
        .header{
            width:100%;
            height:30px;
            margin: auto;
        }
        .header div p{
            width:50%;
            color: black;
            font-size: 19px;
            font-family: fantasy;
            text-align: center;
            margin: auto;

        }
        .header div{
            width: 33.33%;
            float: left;
        }
        .leftButton{
            float: right;
        }`
    let style = document.createElement('style')
    style.innerHTML=css
    document.head.append(style)
    let text=`<div id="apps">


        <div class="header">
            <div><button class="leftButton" @click="dayFront()">前一天</button></div>
            <div><p>{{date}}</p></div>
            <div><button @click="dayBack()">后一天</button></div>
        </div>
        <div class="window">

            <div class="box">

                <div v-for="key in panelKeys">
                    <a target="_blank" v-bind:href="res['panel'][key][0]">
                    <img v-bind:src="'https://'+res['panel'][key][1]">
                    <p>{{key}}</p>
                    </a>
                </div>


            </div>
        </div>

        <ul class="desk" >
            <li v-for="key in videoKeys">
                <a target="_blank" v-bind:href="res['video'][key][0]">
                    <img v-bind:src="'https://'+res['video'][key][1]"></img>
                    <div>{{key}}</div>
                </a>
            </li>
        </ul>
    </div>`

    setTimeout(function(){
        document.getElementsByClassName('bili-grid')[1].innerHTML+=text
        document.getElementsByClassName('bili-grid')[1].classList=''
        var date=dayMove(result,10,-4,1,0)
        var res=result[date]
        var videoKeys=[];var panelKeys=[]
        for(key in res['video']){
            videoKeys.push(key)
        }
        for(key in res['panel']){
            panelKeys.push(key)
        }
        chagePic(res['headerUrl'],res['logoUrl'])
        //橱窗不想写了就这样吧
        //vue
        const desk = {
            data() {
                return {
                    dMove:0,
                    res:res,
                    videoKeys:videoKeys,
                    date:date,
                    panelKeys:panelKeys
                }
            },
            methods:{
                dayBack(){
                    do{
                        this.dMove+=1
                        var date1=dayMove(result,10,-4,1,this.dMove)
                    }while(this.date==date1)
                    this.date=date1
                    this.res=result[this.date]
                    this.videoKeys=[]; this.panelKeys=[]
                    for(key in this.res['video']){
                        this.videoKeys.push(key)
                    }
                    for(key in this.res['panel']){
            this.panelKeys.push(key)
        }
                    chagePic(this.res['headerUrl'],this.res['logoUrl'])

                    this.$forceUpdate()
                },
                dayFront(){
                    do{
                    this.dMove-=1
                    var date1=dayMove(result,10,-4,1,this.dMove)
                    }while(this.date==date1)
                    this.date=date1
                    this.res=result[this.date]
                    this.videoKeys=[]; this.panelKeys=[]
                    for(key in this.res['video']){
                        this.videoKeys.push(key)
                    }
                    for(key in this.res['panel']){
            this.panelKeys.push(key)
        }
                    chagePic(this.res['headerUrl'],this.res['logoUrl'])

                    this.$forceUpdate()
                }

            },
        }
        Vue.createApp(desk).mount('#apps')
    },400)


})();