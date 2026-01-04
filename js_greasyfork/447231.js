// ==UserScript==
// @name         豆瓣表情插件
// @namespace    http://tampermonkey.net/
// @version      4.1.1
// @description  豆瓣表情插件，将关键词替换为表情包，同时附带快捷输入按钮，方便使用。
// @author       Time chicken;四月薰香满樱落
// @match        https://www.douban.com/group/*
// @icon         data:image/jpeg;base64,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
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447231/%E8%B1%86%E7%93%A3%E8%A1%A8%E6%83%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447231/%E8%B1%86%E7%93%A3%E8%A1%A8%E6%83%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var emojiData = {}
    emojiData[0] = ['[叁叁_叫我美女宝]',
                    '[叁叁_凑紫楠]',
                    '[叁叁_一正丨]',
                    '[叁叁_大傻呗]',
                    '[叁叁_别急]',
                    '[叁叁_你说谁1]',
                    '[叁叁_你说谁2]',
                    //'[叁叁_凑表脸]',
                    '[叁叁_吃瓜]',
                    '[叁叁_理发店]',
                    '[叁叁_要牛奶钱]',
                    '[叁叁_大傻呗2]',
                    '[叁叁_喝涮锅水]',
                    '[叁叁_绿码]',
                    '[叁叁_看看码]',
                    '[叁叁_熬夜]',
                    '[叁叁_结婚]',
                    '[叁叁_结婚b]',
                    '[叁叁_飞]',
                    '[叁叁_呀呀呀]',
                    '[叁叁_听我说]',
                    '[叁叁_学猫叫]',
                    '[叁叁_画饼]',
                    '[叁叁_恰饼]',
                    '[叁叁_鸭腿攻击]',
                    '[叁叁_邦邦邦邦]',
                    '[玉桂狗_敬礼]'
    ];
    //暂时改为6
    emojiData[1] = ['[嘉然_mua]',
                    '[嘉然_安详]',
                    '[嘉然_暗中观察]',
                    '[嘉然_锤头丧气]',
                    '[嘉然_点赞]',
                    '[嘉然_嘉人们]',
                    '[嘉然_嘉速心动]',
                    '[嘉然_流口水]',
                    '[嘉然_你好]',
                    '[嘉然_一米八]',
                    '[嘉然_一眼真]',
                    '[嘉然_biu]',
                    '[嘉然_绷不住了]',
                    '[嘉然_笔芯]',
                    '[嘉然_番茄炒蛋拳]',
                    '[嘉然_嘉油]',
                    '[嘉然_剪刀手]',
                    '[嘉然_略略略]',
                    '[嘉然_敲打]',
                    '[嘉然_吓人]',
                    '[嘉然_粉色小恶魔]',
                    '[嘉然_干饭]',
                    '[嘉然_嘉步]',
                    '[嘉然_我有嘉心糖]',
                    '[嘉然_我们是]',
    ];

    emojiData[2] = ['[向晚_打游戏]',
                    '[向晚_弹吉他]',
                    '[向晚_得意]',
                    '[向晚_顶碗]',
                    '[向晚_哈！]',
                    '[向晚_嗨起来]',
                    '[向晚_害羞]',
                    '[向晚_好可怕]',
                    '[向晚_嗯？]',
                    '[向晚_晚步]',
                    '[向晚_捂头]',
                    '[向晚_喜欢]',
                    '[向晚_下雨了]',
                    '[向晚_星星眼]',
                    '[向晚_AVA]',
                    '[向晚_等待]',
                    '[向晚_困]',
                    '[向晚_陶醉]',
                    '[向晚_头大]',
                    '[向晚_微笑]',
                    '[向晚_鼻涕泡]',
                    '[向晚_大头]',
                    '[向晚_给你一拳]',
                    '[向晚_水母]',
                    '[向晚_我们是]',
    ];

    emojiData[3] = ['[乃琳Queen_MUA]',
                    '[乃琳Queen_Wink]',
                    '[乃琳Queen_壁咚]',
                    '[乃琳Queen_标记]',
                    '[乃琳Queen_吃火锅]',
                    '[乃琳Queen_鼓掌]',
                    '[乃琳Queen_好坏女人]',
                    '[乃琳Queen_惊吓小乃琳]',
                    '[乃琳Queen_麻了]',
                    '[乃琳Queen_摸摸]',
                    '[乃琳Queen_乃琳摇]',
                    '[乃琳Queen_奶淇琳宝]',
                    '[乃琳Queen_女王的肯定]',
                    '[乃琳Queen_欧耶]',
                    '[乃琳Queen_取证中]',
                    '[乃琳Queen_双向奔赴]',
                    '[乃琳Queen_太喜欢了]',
                    '[乃琳Queen_晚安小乃琳]',
                    '[乃琳Queen_我们是]',
                    '[乃琳Queen_向日葵]',
                    '[乃琳Queen_小狐狸]',
                    '[乃琳Queen_笑嘻了]',
                    '[乃琳Queen_谢谢大家]',
                    '[乃琳Queen_隐藏gamer]',
                    '[乃琳Queen_遇到困难]',
    ];

    emojiData[4] = ['[珈乐Carol_Come on]',
                    '[珈乐Carol_OK]',
                    '[珈乐Carol_Vocal担当]',
                    '[珈乐Carol_啵啵]',
                    '[珈乐Carol_不懂二次元]',
                    '[珈乐Carol_草莓袜子]',
                    '[珈乐Carol_大哥]',
                    '[珈乐Carol_二甲]',
                    '[珈乐Carol_反诈骗]',
                    '[珈乐Carol_风情]',
                    '[珈乐Carol_富贵儿]',
                    '[珈乐Carol_隔岸]',
                    '[珈乐Carol_红色高跟鞋]',
                    '[珈乐Carol_皇珈骑士]',
                    '[珈乐Carol_决明子]',
                    '[珈乐Carol_哭哭]',
                    '[珈乐Carol_酷盖]',
                    '[珈乐Carol_狼牙土豆拳]',
                    '[珈乐Carol_睡了睡了]',
                    '[珈乐Carol_投降]',
                    '[珈乐Carol_团播像坐牢]',
                    '[珈乐Carol_我还有牌]',
                    '[珈乐Carol_我们是]',
                    '[珈乐Carol_小狼堡]',
                    '[珈乐Carol_小狼公主]',
    ];

    emojiData[5] = ['[贝拉kira_OK]',
                    '[贝拉kira_拜托]',
                    '[贝拉kira_贝式疑问]',
                    '[贝拉kira_笔芯]',
                    '[贝拉kira_别爱我]',
                    '[贝拉kira_别偷懒]',
                    '[贝拉kira_不会吧]',
                    '[贝拉kira_吃我贝极拳]',
                    '[贝拉kira_给我出去]',
                    '[贝拉kira_汗]',
                    '[贝拉kira_哼哼]',
                    '[贝拉kira_加油]',
                    '[贝拉kira_开心到劈叉]',
                    '[贝拉kira_看我可爱吗]',
                    '[贝拉kira_累趴]',
                    '[贝拉kira_送你小花花]',
                    '[贝拉kira_王之蔑视]',
                    '[贝拉kira_我晕了]',
                    '[贝拉kira_在吗在吗]',
                    '[贝拉kira_这题我会]',
                    '[贝拉kira_sorry]',
                    '[贝拉kira_芭蕾]',
                    '[贝拉kira_贝极星]',
                    '[贝拉kira_拖拉机下山]',
                    '[贝拉kira_我们是]',
    ];
    //暂时改为1
    emojiData[6] = ['[正组_乃0_NAIBI]',
                    '[正组_乐1_LEBI]',
                    '[正组_然10_RANBI]',
                    '[正组_拉50_BEIBI]',
                    '[正组_晚100_ZHUBI]',
                    '[正组_糖33_TANGBI]',
                    '[正组_哞哞哞_NIUBI]',
                    '[正组_随200_WINBI]',
    ];
    //绯月见白表情包
    emojiData[7] = ['[晚_我们是]',
                    '[贝_我们是]',
                    '[珈_我们是]',
                    '[然_我们是]',
                    '[乃_我们是]',
                    '[晚_变猪喷雾]',
                    '[晚_水母之歌]',
                    '[晚_剑眉星目]',
                    '[晚_傲娇]',
                    '[晚_发呆]',
                    '[晚_冰激凌]',
                    '[晚_大哭]',
                    '[晚_无语]',
                    '[贝_白舞裙]',
                    '[贝_我不道啊]',
                    '[贝_牛肉干]',
                    '[乐_酷盖]',
                    '[乐_骑士]',
                    '[乐_玉米肠]',
                    '[然_小恶魔]',
                    '[然_馋]',
                    '[然_害怕]',
                    '[乃_害羞]',
                    '[乃_好梦]',
                    '[三_喝咖啡]',
                    '[三_扔垃圾]',
                    '[三_刷手机]',
                    '[三_骑士]',
                    '[三_别急]',
                    '[三_开播]'
    ];
    //aazzzEi
    emojiData[8] = ['[啵啵_别急]',
                    '[啵啵_谢谢你]',
                    '[啵啵_喝流来]',
                    '[啵啵_理发店]',
                    '[啵啵_比心]',
                    '[啵啵_困]',
                    '[啵啵_拜拜]',
                    '[啵啵_复活]',
                    '[啵啵_哇]',
                    '[啵啵_吃糖]',
    ];

    //base64生成器：https://www.css-js.com/tools/base64.html
    var emojiImgSelector = ['"https://i0.hdslb.com/bfs/new_dyn/e7fb58dae8651b78666a97a964e394245858138.png"',
                            '"https://i0.hdslb.com/bfs/emote/770355925c296cf63736866a3531f1a0a9ba7b80.png"',
                            '"https://i0.hdslb.com/bfs/emote/75975262c8c2c9de25acdbb1092c0fc8aff31be9.png"',
                            '"https://i0.hdslb.com/bfs/emote/d9bbe91ce3d4d7dff814191492b4f40f394ee69b.png"',
                            '"https://i0.hdslb.com/bfs/emote/2396821dee0bc52228a98b96e135f50ad8d43509.png"',
                            '"https://i0.hdslb.com/bfs/emote/d1af2753dee495d35f82e4a10158b08896a75f29.png"',
                             '"https://i0.hdslb.com/bfs/album/899aac2ad2bfa06fedfcad6008d68acdd8f98e06.jpg"',
                             '"https://i2.hdslb.com/bfs/face/fb3bbd4bde5baddd101dc9f070b4b4c1d0073d38.jpg"',
                            //'"https://i0.hdslb.com/bfs/new_dyn/ccf3c3249400ecd544b76c3382a48d2e260240268.jpg"',

    ];
    //通过title显示表情包作者
    var emojiImgAuthor = [];

    var emojiImgs = {}
    emojiImgs[0] = ['"https://i0.hdslb.com/bfs/new_dyn/e25201330974e4227009a588b4861cdd5858138.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/e7fb58dae8651b78666a97a964e394245858138.png"',
                    '"https://i0.hdslb.com/bfs/album/6c4402cd7de9737e666970f6299e61f5806bbf73.jpg"',
                    '"https://i0.hdslb.com/bfs/album/d60f6a9c5bc4a109a72aaa610525e3bae2e872bf.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/c1aa8cd73f9857e5545d38c1c98355f85858138.png"',
                    '"https://i0.hdslb.com/bfs/album/58ac841450aa4da91f596f50cceb1fc893f5e16a.jpg"',
                    '"https://i0.hdslb.com/bfs/album/51e6222e60a5c53fffa7259a6d1e26593791ee6f.jpg"',
                    //'"https://i0.hdslb.com/bfs/album/8d5491159f8ed4e3199941c397f73b92a25a2ea3.jpg"',//凑表脸 待定
                    '"https://i0.hdslb.com/bfs/album/42fff4f4aa4ba7ad5a7ee448f1a952a1a6753741.png"',
                    '"https://i0.hdslb.com/bfs/album/101dbcd54aa6a6a5fc253ea9095748a65da7ce4a.png"',
                    '"https://i0.hdslb.com/bfs/album/6ce670604e2a98810d2dcd97d458750ea8cc0d79.png"',
                    '"https://i0.hdslb.com/bfs/album/9c195b9eaf46405059aeb8829a9945d6c44375ff.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/acee723a741fa60aa329fd98bf3ec4c6173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/3ca7273f92ec7e9d1e73a300179084e7173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/78e38e8adc885fec9cd424afa945ac1d173530952.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/35aaa2b541bb486b6c59e7f4d7fdebce173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/60bfd04d323e7289c4a716c2d944ede8173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/ad8a5f2afcdd946c2528a48b07e66bc7173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/c264c2f02f16f8f8927a99331c108737173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/9702d2212ae08b3d1af9785dcb9b6246173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/3d1ad47b76b523fbeb15453fddb87610173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/0c4c4eae2bb7dd8980e4b5d7cd18823f173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/6ce694af098ae09abfe58b4e1c0d815e173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/7fbf83f66d8b82776b5f1d2940af3877173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/0b2ff0e78d974438c51dee9d24470f38173530952.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/4461fb60f2ebab79504c52990622b091173530952.png"',
                    '"https://i0.hdslb.com/bfs/album/f8f8de3ef0b36b69fbff630a30ac33aee1fdfc96.png"'
    ];
    //暂时修改为6
    emojiImgs[1] = ['"https://i0.hdslb.com/bfs/emote/74ea9b89f8923df6a123cabe6053762b9e776387.png"',
                    '"https://i0.hdslb.com/bfs/emote/312359401cc72c34fcea3654cdba42db0f9f3dd0.png"',
                    '"https://i0.hdslb.com/bfs/emote/3acf0b43facfd0601f5ab88cca6e401aa4f5a02e.png"',
                    '"https://i0.hdslb.com/bfs/emote/e6342840311ffeba8f2c58d1c360d76644e75dff.png"',
                    '"https://i0.hdslb.com/bfs/emote/7017d90d4ceb9ea042cef8adc70d35eeb1f95e7e.png"',
                    '"https://i0.hdslb.com/bfs/emote/d270845c9590da372e9b311cd6d976459acd1087.png"',
                    '"https://i0.hdslb.com/bfs/emote/387035168f40ca81afce8b38303c60ceb0c5dc6c.png"',
                    '"https://i0.hdslb.com/bfs/emote/78bfeff475ad56a6d9379164b099f1ad8ecd7086.png"',
                    '"https://i0.hdslb.com/bfs/emote/d1530f972a59bca97bc4b8acf4f7e16f989f37c3.png"',
                    '"https://i0.hdslb.com/bfs/emote/3c95c19137e964807a46effd8f83a443eeddd71c.png"',
                    '"https://i0.hdslb.com/bfs/emote/ff436f5821db8b871517d0e5bb7ade7b64d3d0bf.png"',
                    '"https://i0.hdslb.com/bfs/emote/4e94191613e85e68328062df15fd255357494e35.png"',
                    '"https://i0.hdslb.com/bfs/emote/4f0a9ee7708d71083dba4e79768ff0b7c308eaf4.png"',
                    '"https://i0.hdslb.com/bfs/emote/332a6df0e6def8da77e09310a62f3bffdc397640.png"',
                    '"https://i0.hdslb.com/bfs/emote/27eb784d39e981f44b8fa586616c6ab2ac0078cf.png"',
                    '"https://i0.hdslb.com/bfs/emote/ee4d1908e2e9d0fe7ccd9c3a0423ecdc5f4d05aa.png"',
                    '"https://i0.hdslb.com/bfs/emote/04270781acabb35b309dc761b1aa7528a9e3f336.png"',
                    '"https://i0.hdslb.com/bfs/emote/88a0b8bf60d3582b2080d03c343f2a5e233b62ee.png"',
                    '"https://i0.hdslb.com/bfs/emote/438405970cbab6c6a06119bd9d9b474df62eb50c.png"',
                    '"https://i0.hdslb.com/bfs/emote/aa75d5dc15de31208304be653eef0267f152f172.png"',
                    '"https://i0.hdslb.com/bfs/emote/c406c3c64973459162b8c18ea8928431fc837809.png"',
                    '"https://i0.hdslb.com/bfs/emote/26c5e8f82ac6b0aed88af93b21d0daaf64716f3e.png"',
                    '"https://i0.hdslb.com/bfs/emote/72f1d84d13b45c0bdec9967d75f4320abce67cd4.png"',
                    '"https://i0.hdslb.com/bfs/emote/7579c6085f984f39ff0f6a2cb710301a2b113fac.png"',
                    '"https://i0.hdslb.com/bfs/emote/770355925c296cf63736866a3531f1a0a9ba7b80.png"'
    ];

    emojiImgs[2] = ['"https://i0.hdslb.com/bfs/emote/2d0ce04d2b9399a78871565c457c8e2fad7fb49e.png"',
                    '"https://i0.hdslb.com/bfs/emote/385aafdeca8eb84ca85888363bfd7beff184cb98.png"',
                    '"https://i0.hdslb.com/bfs/emote/409ae15b6469a8476295c428b4af78c9a04070a7.png"',
                    '"https://i0.hdslb.com/bfs/emote/d7e71687c8bc02d7c6a0d4351de328d5cbea7a9f.png"',
                    '"https://i0.hdslb.com/bfs/emote/ec2454f3be4b711b23e712a61d1f44c1eeb5ca77.png"',
                    '"https://i0.hdslb.com/bfs/emote/ce19f35f9778dc24786e52524370d15673406c8f.png"',
                    '"https://i0.hdslb.com/bfs/emote/d7ed9b20069bdee25977c579c6df225e239b0b00.png"',
                    '"https://i0.hdslb.com/bfs/emote/d3cdd48c4e47f90d5ebd124434c4bebd15e9902b.png"',
                    '"https://i0.hdslb.com/bfs/emote/c6232eededec721e2e5b886994dd6bd98f1fb7c0.png"',
                    '"https://i0.hdslb.com/bfs/emote/37a8accb333fddea7deede711997ccad99c96c39.png"',
                    '"https://i0.hdslb.com/bfs/emote/26bb8a3514b883f06afbec7bc17fd0d1f41a1085.png"',
                    '"https://i0.hdslb.com/bfs/emote/b2ccbe7b80e484543fc0066f896703eed7b3694d.png"',
                    '"https://i0.hdslb.com/bfs/emote/5113a8e3d6bb09ddb93b5441d9f7367883d3b1bf.png"',
                    '"https://i0.hdslb.com/bfs/emote/944fe863bc5694390e1e8244aae6f51be92226c0.png"',
                    '"https://i0.hdslb.com/bfs/emote/9e12a5cb7d44969232976a7759b553f1f81ccd30.png"',
                    '"https://i0.hdslb.com/bfs/emote/70c67e5f900398bf265d2376b3c05f3801d5cddb.png"',
                    '"https://i0.hdslb.com/bfs/emote/9b7d4508aa2ebe875c6ccf0021ab088074dee5e5.png"',
                    '"https://i0.hdslb.com/bfs/emote/8cc1625e336a7a74889d1c3e92673b893dcd9574.png"',
                    '"https://i0.hdslb.com/bfs/emote/2d3f73def7db09181598b88737c1e6347a4a728c.png"',
                    '"https://i0.hdslb.com/bfs/emote/ce62d28ded474b64380716552c556844d919ffc7.png"',
                    '"https://i0.hdslb.com/bfs/emote/a0cf9042164f7d43e15b4e1ec89ff0cb9019d6f1.png"',
                    '"https://i0.hdslb.com/bfs/emote/191e3f3144767ac3b54f0febf775d84810e37c01.png"',
                    '"https://i0.hdslb.com/bfs/emote/27dbfffde36f5b389fa667f0b73d09af71876af3.png"',
                    '"https://i0.hdslb.com/bfs/emote/aed3e5b11149dcc447a43def5c2af61afeaf3e3c.png"',
                    '"https://i0.hdslb.com/bfs/emote/75975262c8c2c9de25acdbb1092c0fc8aff31be9.png"'
    ];

    emojiImgs[3] = ['"https://i0.hdslb.com/bfs/emote/b31d1d7edd2991930d82865150b6d519cd17f125.png"',
                    '"https://i0.hdslb.com/bfs/emote/f938220f23b65795acc9fa34d983f11f943f5028.png"',
                    '"https://i0.hdslb.com/bfs/emote/72ce9fede252e3d91f8b6501cd1af76a2f4f7079.png"',
                    '"https://i0.hdslb.com/bfs/emote/2e6c8642f450a618cf7a7347938481be9b5904b4.png"',
                    '"https://i0.hdslb.com/bfs/emote/bc2db2da18785288df524f6b00b17576d2051f7a.png"',
                    '"https://i0.hdslb.com/bfs/emote/d75ba7019ad541892d3a233f60c3f319e5686cfc.png"',
                    '"https://i0.hdslb.com/bfs/emote/0d22d81ab603741f267fa643803ccdaa0b9353b9.png"',
                    '"https://i0.hdslb.com/bfs/emote/9efbe527e88868748c198f9354de03deae50ffb1.png"',
                    '"https://i0.hdslb.com/bfs/emote/9c4c6788478bf617c0ac2d791aeff39ffe3c3b88.png"',
                    '"https://i0.hdslb.com/bfs/emote/a5992fd268bd6e8e476812304a135db8727d713d.png"',
                    '"https://i0.hdslb.com/bfs/emote/b138113f805af6ceb0ca98e8a1909eeef509c2ae.png"',
                    '"https://i0.hdslb.com/bfs/emote/e51a3db8c72ff019f29fdfdee00924d2e43c75a0.png"',
                    '"https://i0.hdslb.com/bfs/emote/8ac51f6c140678129395e9c1403c5975fbafc055.png"',
                    '"https://i0.hdslb.com/bfs/emote/02d07d9b6703c0731e6e121509f71cba8da03e4c.png"',
                    '"https://i0.hdslb.com/bfs/emote/d99a4219ff888ee8ea53c7f437395caf7e0c7761.png"',
                    '"https://i0.hdslb.com/bfs/emote/2bdc245717d46e80a656630b9e6e2d56f8fc0e3f.png"',
                    '"https://i0.hdslb.com/bfs/emote/0b89106ad3a20f5643823d7eed4caca7a58b3c5c.png"',
                    '"https://i0.hdslb.com/bfs/emote/3bbcd2e17696033652240877b5c0f98066099f91.png"',
                    '"https://i0.hdslb.com/bfs/emote/d9bbe91ce3d4d7dff814191492b4f40f394ee69b.png"',
                    '"https://i0.hdslb.com/bfs/emote/ad55e8f6020c028169852ed809fabe8950c6e19a.png"',
                    '"https://i0.hdslb.com/bfs/emote/c2a7bd728add2aed53507b05d98c59b520773edb.png"',
                    '"https://i0.hdslb.com/bfs/emote/34697f4fb87d532a4492c98f6058d38352c98c2d.png"',
                    '"https://i0.hdslb.com/bfs/emote/5b2192adc9573ee0a9e2714914e41b0b79949bad.png"',
                    '"https://i0.hdslb.com/bfs/emote/2159bc0f566fca500aa20c2b79b8abd31312c1ff.png"',
                    '"https://i0.hdslb.com/bfs/emote/38cb2f6984d4a310929031b07cf8a091ba895b90.png"'
    ];

    emojiImgs[4] = ['"https://i0.hdslb.com/bfs/emote/253a0f64638220554e2fa69c1d229a6f37808c02.png"',
                    '"https://i0.hdslb.com/bfs/emote/dfab74714b44fb7edcc093a1afb3454d9b121dab.png"',
                    '"https://i0.hdslb.com/bfs/emote/d0a8e8a3f7d3e44ceb1580da07ecc5884509001c.png"',
                    '"https://i0.hdslb.com/bfs/emote/4022f02c8bb1ae3885fb518df3f5594596f075cd.png"',
                    '"https://i0.hdslb.com/bfs/emote/0f80b644fa2657d7c61fe22519bdd14ecd955288.png"',
                    '"https://i0.hdslb.com/bfs/emote/b78f048d1bfe593f728045281a7d0102c113ca85.png"',
                    '"https://i0.hdslb.com/bfs/emote/6b48bdf881c69cacbc714df875e290e9ec51de1e.png"',
                    '"https://i0.hdslb.com/bfs/emote/ded634bdf7e41046aeebc02efc9effab4ca2d4fe.png"',
                    '"https://i0.hdslb.com/bfs/emote/93f0cdb8d0a846fcc449b055564f374d59148677.png"',
                    '"https://i0.hdslb.com/bfs/emote/ebd89a6a74bfb19d9db5d85cea06c2584d87e3cd.png"',
                    '"https://i0.hdslb.com/bfs/emote/b727f81e774207fc726b82843767af45f5ebafe7.png"',
                    '"https://i0.hdslb.com/bfs/emote/34c0026b9597beee7c99bc480404e335bf3644d7.png"',
                    '"https://i0.hdslb.com/bfs/emote/d9c72a9c8b975ade4cefc3576359f7f395a1ff5e.png"',
                    '"https://i0.hdslb.com/bfs/emote/483a9510e9aab7d70a9ccd01f08d919a1dc2ee0d.png"',
                    '"https://i0.hdslb.com/bfs/emote/c9f83b57499c2252c0330aa8ed9de2fb9fc8f48e.png"',
                    '"https://i0.hdslb.com/bfs/emote/02a6118869e103a49de119eea1f2d3cad0b2f3ff.png"',
                    '"https://i0.hdslb.com/bfs/emote/69734fc2ffd05db744a742121888a3315f5f8533.png"',
                    '"https://i0.hdslb.com/bfs/emote/86ad388d0dc48bc2379c66d01fc26af13d1fed44.png"',
                    '"https://i0.hdslb.com/bfs/emote/9dfca9d12f6eef0e65710afd28e1b2b0715e0d66.png"',
                    '"https://i0.hdslb.com/bfs/emote/9ebfd28799e14b0cf7513404d209f2d157e2db85.png"',
                    '"https://i0.hdslb.com/bfs/emote/3a03b47ad200384d06918d76376f5192b7d9099d.png"',
                    '"https://i0.hdslb.com/bfs/emote/0e4357e1f05b5233b2823fea14114f005032dfd4.png"',
                    '"https://i0.hdslb.com/bfs/emote/643f027e3d5f7120ae68f0508981966e36cc5011.png"',
                    '"https://i0.hdslb.com/bfs/emote/07e35a7a220734aa7a75bb4484c33ea0f36c1f30.png"',
                    '"https://i0.hdslb.com/bfs/emote/2396821dee0bc52228a98b96e135f50ad8d43509.png"'
    ];

    emojiImgs[5] = ['"https://i0.hdslb.com/bfs/emote/9f6437e2bf1c386160d1d7c6820938339713b960.png"',
                    '"https://i0.hdslb.com/bfs/emote/d25f05cb5e48ddc1efd1c81dd600d6545531eb9f.png"',
                    '"https://i0.hdslb.com/bfs/emote/d7dcfb3a234a9dec0fd9a6845f631606ae6bdf6d.png"',
                    '"https://i0.hdslb.com/bfs/emote/3cbc05078eee45c0861ce37e63092e379ae93d57.png"',
                    '"https://i0.hdslb.com/bfs/emote/ff0b0d077f57d8d42abff3636d2b9d8cbde45e32.png"',
                    '"https://i0.hdslb.com/bfs/emote/4b30d06d1074d4b033b20af1f6e50991ed35d370.png"',
                    '"https://i0.hdslb.com/bfs/emote/ed1a82e99faf7c1b5f67de3f61fd3c578798f833.png"',
                    '"https://i0.hdslb.com/bfs/emote/36a1633caee0febe73f5956c5b1e18cec3a558b1.png"',
                    '"https://i0.hdslb.com/bfs/emote/3f35ab86df351494234eeaf37b2b9245cdd74bb9.png"',
                    '"https://i0.hdslb.com/bfs/emote/ce72a1f2daf8ce37f4ce016817e90828082a150d.png"',
                    '"https://i0.hdslb.com/bfs/emote/f9705395dc3536db243e4a4ffde66442e8440817.png"',
                    '"https://i0.hdslb.com/bfs/emote/eda63a6172a2b4b3fc753e609d32cd63a5ac2761.png"',
                    '"https://i0.hdslb.com/bfs/emote/e0ba7e59a46f52ba4a148c160fecb7c5d13c51dc.png"',
                    '"https://i0.hdslb.com/bfs/emote/2aa4cc655bd9ca48ccdcb87a8223acf5a5b9f667.png"',
                    '"https://i0.hdslb.com/bfs/emote/57c1f3491c40a9f6bf76dcdd5aa1729e3e67d5fe.png"',
                    '"https://i0.hdslb.com/bfs/emote/3f2bef0f3f479edfa00d9a09000af3941cdc9bd7.png"',
                    '"https://i0.hdslb.com/bfs/emote/3b749eb3f4c0db50258b85973c0e35af25d90e27.png"',
                    '"https://i0.hdslb.com/bfs/emote/a480e8977b142b9e2753af967a1b6586dc64d887.png"',
                    '"https://i0.hdslb.com/bfs/emote/754b452413bdf27d2e7061f8fd8637bdc18440a7.png"',
                    '"https://i0.hdslb.com/bfs/emote/3bf183525aa83c27d0f0fd0d706333ce6270ae59.png"',
                    '"https://i0.hdslb.com/bfs/emote/fc250cdc655d81f573ab7c506059ec172db40a12.png"',
                    '"https://i0.hdslb.com/bfs/emote/bb27c02c0b96adefc43ad61b572e6fd34e671b24.png"',
                    '"https://i0.hdslb.com/bfs/emote/b2b1174245840e18470e22b53ea61dd71033f690.png"',
                    '"https://i0.hdslb.com/bfs/emote/74cc4baea28aca5248aaeb7c23e00ec58348df28.png"',
                    '"https://i0.hdslb.com/bfs/emote/d1af2753dee495d35f82e4a10158b08896a75f29.png"'
    ];
    //暂时修改为1
    emojiImgs[6] = ['"https://i0.hdslb.com/bfs/album/ed83f611e37dccc9a5d4e275b48948a698509681.jpg"',
                    '"https://i0.hdslb.com/bfs/album/d955042a97506d984526a2cb72db73ca1b006f3d.jpg"',
                    '"https://i0.hdslb.com/bfs/album/899aac2ad2bfa06fedfcad6008d68acdd8f98e06.jpg"',
                    '"https://i0.hdslb.com/bfs/album/0a2d602f676bc6d65a6962b9f00d170d9a76afd7.jpg"',
                    '"https://i0.hdslb.com/bfs/album/73fa165de694a2ee9ead0e682b0d5fdcd37cbe8f.jpg"',
                    '"https://i0.hdslb.com/bfs/album/e30052b4d41e3afe593ea16b466cad775926ee43.jpg"',
                    '"https://i0.hdslb.com/bfs/album/a459950fff6a75a2ec5a52813bd17467db473763.jpg"',
                    '"https://i0.hdslb.com/bfs/album/f47faff803a125653da8a1db00c8f7400d0d1142.jpg"'
    ];
    //绯月见白表情包
     emojiImgs[7] = ['"https://i0.hdslb.com/bfs/article/e1ba3fecfe06d046eb11606b6aebe3afb4a92160.jpg"',
                    '"https://i0.hdslb.com/bfs/article/c44269cc1acb1734c4d2eea6c304c2466beb8833.jpg"',
                    '"https://i0.hdslb.com/bfs/article/1d1b3c6fa8533b7659f0d7c777e92a6132a16b26.jpg"',
                    '"https://i0.hdslb.com/bfs/article/8f162cbc55b21ed0df476d58ff5f1295b80660d7.jpg"',
                    '"https://i0.hdslb.com/bfs/article/83bc2b0f02566a9654f3047c04d68078126bba34.jpg"',
                    '"https://i0.hdslb.com/bfs/article/146f0709a8be5f745853bc40bd22f3aac186e228.jpg"',
                    '"https://i0.hdslb.com/bfs/article/255580e478e0824578b263654d1df011c00fc5aa.jpg"',
                    '"https://i0.hdslb.com/bfs/album/ac7ed9d97752f499f2f5057c63808a6af1b1ddde.jpg"',
                    '"https://i0.hdslb.com/bfs/album/3f670bb44a7862c6423073870b032464819cee7f.jpg"',
                    '"https://i0.hdslb.com/bfs/album/36fe23abb20c744aeecb4362e686c67043fc9fa2.jpg"',
                    '"https://i0.hdslb.com/bfs/album/76e4b9365d0e9c7433b248f08bdf167e5c65af60.jpg"',
                    '"https://i0.hdslb.com/bfs/album/f0346f2f129f8c98f9ab9d1162348728982e803a.jpg"',
                    '"https://i0.hdslb.com/bfs/album/bfbf1b952b5f3628cddc53bedb220be49a603fe3.jpg"',
                    '"https://i0.hdslb.com/bfs/article/4790f960e69c1d74288e3bee72c812b28e1746fa.jpg"',
                    '"https://i0.hdslb.com/bfs/article/d96ada8a770db35ee8b9a3b5e8384a18d0672b14.jpg"',
                    '"https://i0.hdslb.com/bfs/album/4776c0fc9ea88139d6092e3f46dbac79da9215f1.jpg"',
                    '"https://i0.hdslb.com/bfs/article/090a12ed4ba2df69886002e955869f7f93618047.jpg"',
                    '"https://i0.hdslb.com/bfs/article/95389b49383c25aac8d864b5eea96bb9ad5197e2.jpg"',
                    '"https://i0.hdslb.com/bfs/album/64c04e67819c298e501120ff08e6f95ac7831019.jpg"',
                    '"https://i0.hdslb.com/bfs/article/8a0f1c9d26b657deb972d1edd49e193259ef4e7e.jpg"',
                    '"https://i0.hdslb.com/bfs/article/a9f341899b2925d6489b2e457fa4cc3b2340f0ed.jpg"',
                    '"https://i0.hdslb.com/bfs/album/a3f04e4aff396183e2643c76bba50729804e4178.jpg"',
                    '"https://i0.hdslb.com/bfs/article/3fca0c680ebf67b2d297d21b183fd1033fff85b3.jpg"',
                    '"https://i0.hdslb.com/bfs/article/d7c1f252b5706e9d1246e2fd136dd553cc4574ed.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/cf1de8b86da5fd041f3cb7b3cb8bbd2b13195721.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/cf8e8d805acdb823e4b707afdbc267c413195721.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/4dbdb7d57cc2821c8613bb5a60a3c80413195721.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/faf08c2326b149a120f0435aa1b34d4613195721.jpg"',
                    '"https://i0.hdslb.com/bfs/new_dyn/b064d91ad95946b3956d3fe2895091d213195721.png"',
                    '"https://i0.hdslb.com/bfs/new_dyn/8cff65c63a13ae5c3a7d18b7dcf7f5a813195721.png"'
    ];
    //aazzzEi 原动态删除 链接失效
    // emojiImgs[8] = ['"https://i0.hdslb.com/bfs/new_dyn/ef10f77ddb6bfbffc3e921970c8e90ce260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/20caec52eba1e81f5542f0cc96a8b585260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/cf201bff9ce9c2586d7aaea06ebc7cd5260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/dbeb705a741141263b93b16804e328f2260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/9993dcaa8c5a8f2952580bc5d7d2c09a260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/545159e9416c26c113203049a7f75b08260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/1b5ae09a2d12b117fe1a64055c89cbb2260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/fad8afe0944224638d3d905d687aeb4e260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/904acda3040792750ffde882b94012f3260240268.jpg"',
    //                 '"https://i0.hdslb.com/bfs/new_dyn/ccf3c3249400ecd544b76c3382a48d2e260240268.jpg"',
    // ];
    // 评论区分辨率 //
    var emojiImgHeight = {}
    var emojiImgWidth = {}

    emojiImgHeight[0] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    //暂时改为6
    emojiImgHeight[1] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    emojiImgHeight[2] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    emojiImgHeight[3] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    emojiImgHeight[4] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    emojiImgHeight[5] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    //暂时改为1
    emojiImgHeight[6] = ['120', '120', '120', '120', '120'
                         , '120', '120', '120'
    ];

    emojiImgHeight[7] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];
    emojiImgHeight[8] = ['80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
                         , '80', '80', '80', '80', '80'
    ];


    emojiImgWidth[0] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    //暂时改为6
    emojiImgWidth[1] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    emojiImgWidth[2] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    emojiImgWidth[3] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    emojiImgWidth[4] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    emojiImgWidth[5] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    //暂时改为1
    emojiImgWidth[6] = ['220', '220', '220', '220', '220'
                        , '220', '220', '220'
    ];

    emojiImgWidth[7] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    emojiImgWidth[8] = ['80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
                        , '80', '80', '80', '80', '80'
    ];
    //宠物数据库
    
    //宠物数据库
    //同接bot
    function botdetect(){
        var result=[];
        var NickNameData = {};
        var NickName = document.querySelectorAll("h4 a");
        var NickNameNum = NickName.length;//当前同接数
        NickName.forEach(cnt=>{
            var temp = cnt.innerText;
            var k=0;
            var repeat = 0;
            for (k in NickNameData){
                if(NickNameData[k][0]==temp){
                    NickNameData[k].push(temp)
                    repeat++;
                }
            }
            if(!repeat) NickNameData[++k]=[temp];
        });
        console.log(NickNameData);
        //对数据进行分析
        var maxlen=0;
        var maxnn="";
        for (var num in NickNameData){
            var lentemp = NickNameData[num].length
            if (maxlen<lentemp){
                maxlen=lentemp;
                maxnn = NickNameData[num][0];
            }
        }
        result.push(num);//不重复同接数
        result.push(NickNameNum);//同接数
        result.push(maxnn);//最多回复人
        result.push(maxlen);//回复数量
        return result
    }
    //南征北战
    function nbdetect(){
        var RegionResult=[];
        var RegionData = {};
        var Region = document.querySelectorAll("h4 span.pubtime");
        var RegionNum = Region.length;//当前同接数
        //RegionData[0]=[document.querySelector("h3 span.create-ip").innerText];//可以把楼主统计在内
        Region.forEach(cnt=>{
            var temp = cnt.innerText.split(" ")[2];
            var k=0;
            var repeat = 0;
            for (k in RegionData){
                if(RegionData[k][0]==temp){
                    RegionData[k].push(temp)
                    repeat++;
                }
            }
            if(!repeat) RegionData[++k]=[temp];
        });
        console.log(RegionData);
        //对数据进行分析
        var maxlen=0;
        var maxnn="";
        for (var num in RegionData){
            var lentemp = RegionData[num].length
            if (maxlen<lentemp){
                maxlen=lentemp;
                maxnn = RegionData[num][0];
            }
        }
        RegionResult.push(num);//不重复同接数
        RegionResult.push(RegionNum);//同接数
        RegionResult.push(maxnn);//最多回复人
        RegionResult.push(maxlen);//回复数量
        return RegionResult
    }
    $("head").append("<style>em.bqbbutton {display: flex;justify-content: center;align-items: center;width: 70px;height: 100%;border: 1px solid #428bd4;border-radius: 4px;cursor: pointer;color: #ffffff;background-color: #428bd4;float:right;margin-left: 10px;}</style>");//margin-left: auto;
    $("head").append("<style>em.bqbbutton1 {display: flex;justify-content: center;align-items: center;width: 70px;height: 100%;border: 1px solid #628bd4;border-radius: 4px;cursor: pointer;color: #ffffff;background-color: #628bd4;float:right;margin-left: 10px;}</style>");
    $("head").append("<style>em.botbutton {display: flex;justify-content: center;align-items: center;width: 70px;height: 100%;border: 1px solid #9862d4;border-radius: 4px;cursor: pointer;color: #ffffff;background-color: #9862d4;float:right;margin-left: 10px;}</style>");
    $("head").append("<style>em.nbbutton {display: flex;justify-content: center;align-items: center;width: 70px;height: 100%;border: 1px solid #9862d4;border-radius: 4px;cursor: pointer;color: #ffffff;background-color: #9862d4;float:right;margin-left: 10px;background-image: linear-gradient(45deg, #cd2323, transparent);}</style>");
    //为过长图片提供缩放效果
    $("head").append("<style>.emojiDataPicdiv img {object-fit: contain;}</style>");

    var isShow = false;
    var comment = document.getElementsByClassName("comment-wrapper");
    var textArea = document.getElementById("last");

    var currentEmojiListID = 0;
    var emojiDataColNum = 10; // 每行多少个表情包 //

    var ep = document.querySelectorAll("p");
    //console.log(ep);
    ep.forEach(epe => {
        if (epe != null) {
            var epih = epe.innerHTML;
            for (let i = 0; i < emojiImgSelector.length; i++) {
                for (let j = 0; j < emojiImgs[i].length; j++) {
                    epih = epih.replaceAll(emojiData[i][j], "<img height=" + emojiImgHeight[i][j] + " width=" + emojiImgWidth[i][j] + " src=" + emojiImgs[i][j] + " alt=" + emojiData[i][j] + ">");

                }
            }

            epe.innerHTML = epih;
        }

    });

    var emojiEmDiv = document.createElement("div");
    var emojiEm = document.createElement("em");
    var botEm = document.createElement("em");
    var nbEm = document.createElement("em");
    var emojiList = document.createElement("em");
    emojiList.style = "float: left;";
    //bot
    botEm.append('同接检测')
    botEm.className = "botbutton"
    botEm.id = 'botbutton'
    botEm.title="测试中，只能检测第一页(即前100条回复)"//提示语
    botEm.addEventListener('click', () => {
        var botr = botdetect();
        if(botr[3]==1){
            textArea.value += "当前帖子 不重复回复 / 回复 为 "+botr[0]+" / "+botr[1]+" 。（该条回复不计入统计）"
        }
        else{
            textArea.value += "当前帖子 不重复回复 / 回复 为 "+botr[0]+" / "+botr[1]+" ，最多回复的人是 "+botr[2]+" ,回复了 "+botr[3]+" 条。（该条回复不计入统计）";
        }
    }, false)
    //南征北战
    nbEm.append('南征北战')
    nbEm.className = "nbbutton"
    nbEm.id = 'nbbutton'
    nbEm.title="测试中，只能检测第一页(即前100条回复)"//提示语
    nbEm.addEventListener('click', () => {
        var nbr = nbdetect();//botdetect();
        if(nbr[3]==1){
            textArea.value += "检测到当前一共有来自 "+nbr[1]+" 个不同地区的回复。（该条回复不计入统计）"
        }
        else{
            textArea.value += "检测到当前一共有来自 "+nbr[0]+" 个不同地区的回复。其中 "+nbr[2]+" 人 ,回复了 "+nbr[3]+" 条。（该条回复不计入统计）";
        }
    }, false)
    //表情包
    emojiEm.append('表情包')
    emojiEm.className = 'bqbbutton';
    emojiEm.id = 'emojibutton'
    emojiEm.addEventListener('click', () => {
        isShow = !isShow;
        if (isShow) {
            var arr = [];
            arr.push('<div class="emojiDataDiv">');
            arr.push('<em>');
            arr.push('<div class="emojiDataHeadDiv"');
            arr.push('<em>');
            for (let idx = 0; idx < emojiImgSelector.length; idx++) {
                arr.push('<img id="emojilist' + String(idx) + '" src=' + emojiImgSelector[idx] + ' height="33" width="33" alt="' + String(idx) + '">');
            }
            arr.push('</em>');
            arr.push('</div>'); //emojiDataHeadDiv
            arr.push('<div class="emojiDataPicdiv">');
            arr.push('<em>');
            for (let i = 0; i < emojiData[0].length; i++) {
                if (i != 0 && i % emojiDataColNum == 0) { arr.push('<br/>'); }
                let html = '<img id="emojidata' + String(i) + '" src=' + emojiImgs[0][i] + ' height="60" width="60" alt="' + emojiData[0][i] + '">';
                //console.log(html);
                arr.push(html);
            }
            arr.push('</em>');
            arr.push('</div>'); //emojiDataPicdiv
            arr.push('</em>');
            arr.push('</div>'); //emojiDataDiv
            emojiList.innerHTML = arr.join('');

            for (let k = 0; k < emojiImgs[currentEmojiListID].length; k++) {
                let emojili = document.getElementById("emojidata" + String(k));
                if (emojili != null) {
                    let emojival = emojili.alt;
                    emojili.addEventListener('click', () => {
                        textArea.value += emojival;
                    }, false)
                }

            }

            // 表情包列表头 //
            for (let j = 0; j < emojiImgSelector.length; j++) {
                let emojili = document.getElementById("emojilist" + String(j));
                emojili.addEventListener('click', () => {
                    var emojiArr = [];
                    currentEmojiListID = j;
                    //console.log("表情包列表头" + currentEmojiListID);
                    let emojiDataPicdiv = document.getElementsByClassName("emojiDataPicdiv");
                    if (emojiDataPicdiv != null) {
                        for (let idx = 0; idx < emojiImgs[j].length; idx++) {
                            if (idx != 0 && idx % emojiDataColNum == 0) { emojiArr.push('<br/>'); }
                            let html = '<img id="emojidata' + String(idx) + '" src=' + emojiImgs[j][idx] + ' height="60" width="60" alt="' + emojiData[j][idx] + '">';
                            //console.log(html);
                            emojiArr.push(html);
                        }
                        emojiDataPicdiv[0].innerHTML = emojiArr.join('');
                    }

                    for (let k = 0; k < emojiImgs[currentEmojiListID].length; k++) {
                        let emojili = document.getElementById("emojidata" + String(k));
                        if (emojili != null) {
                            let emojival = emojili.alt;
                            emojili.addEventListener('click', () => {
                                //console.log("emojidata.alt=" + emojival)
                                textArea.value += emojival;
                            }, false)
                        }
                    }
                }, false)
            }

        } else {
            emojiList.innerHTML = '';
            currentEmojiListID = 0;
        }
    }, false)
    emojiEmDiv.style="float: right;"
    emojiEmDiv.appendChild(emojiEm)
    emojiEmDiv.appendChild(botEm)
    emojiEmDiv.appendChild(nbEm)
    emojiEmDiv.appendChild(emojiList)
    try{comment[0].appendChild(emojiEmDiv)}catch(err) {}
    $("#emojibutton").hover(function () {
        emojiEm.className = 'bqbbutton1';
    }, function () {
        emojiEm.className = 'bqbbutton';
    });
    //帖子内去广告
    try{
        document.getElementById('dale_group_topic_new_bottom_right').remove();
        document.getElementById('dale_group_topic_new_inner_middle').remove();
        document.getElementById('dale_group_topic_new_top_right').remove();
    }catch(err) {}
    //pet
    //reg
    var list_hero=[
        "向晚",
        "贝拉",
        "珈乐",
        "嘉然",
        "乃琳"
    ]
    var list_character=[
        "胆小",
        "勇敢",
        "胆大",
        "保守",
        "孤独",
        "急躁",
        "害羞",
        "冷静",
        "狂妄",
        "温顺"
    ]
    var list_feature=[
        "摆烂",
        "摸鱼",
        "省电",
        "拉跨",
        "罕见",
        "风情",
        "武圣",
        "二甲",
        "口胡",
        "嘴硬",
        "打嗝",
        "音速",
        "大力",
        "暴食",
        "好色",
        "大聪明",
        "近视",
        "逆天",
        "敏感",
        "铸币",
        "酷盖",
        "清纯",
        "小",
        "大",
        "圣",
        "萌",
        "憨",
        "烧",
        "巧克力"
    ]
    var list_exp=[
        2880,
        5760,
        8640,
        43200,
        999999999
    ]
    var hero_img=[
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABICAYAAACjpDbfAAAKOklEQVRogd1b349fRRU/3ewDLz4AATVaQwmrD2gRsqasJJsmRUgIsSGmrgZSIhjkt2sVaKDUUCBpAWuVFqoRpZVGdwkhENMXs8m6hiwNm2LD7gNuYoViDCUL/wFLPvO9n9kz5565d+53Nxo9yTff7849c8753HNm5syZ2XXLy8vSDw1d+NnQcfHsv9f1JaCQVqtnoF+li/88tXrrCwm6CLQr9QXwf4n+7wEOdu2AUDn6yt+KeUv4SsYXdIah0XEsdgbYRhrUFV+4VUa+PNrYY3Z+Jumz1pPWmgGkkXdddyRpB4AcSD7Tz9d6du4EMBeeaLfASDAeQHLPLFGOF479hOmqPQiFL/xsroiXQAlsZMulWd6RLXN9Lw2aVgWwaYzNTi2s/DbAPI96YOHNnPdLqXiZsOE5NvpL2fHDO/Lht+XS+AGBl8TflscSZIMXukgM01K7sx4sEbL/F8/KxMy9K2Arr1mDvZD0PK/7a9kl9uXGpQuQ40qH2aHjN8fff3r5tfA9/vQ9iXGeJ3LtaLPP+FvrhY4D9zwddF5/w1WxXU9q6JebfGohasHlQkiDk8wYyoGzIL32Jl3WLsiAzV7UJQA9cPiNcBnbfjC02TdJ2jR6fiu4HBjbbmWBoJORA1tgk9aRAxkBBhe/cToIR6fxR0YTxcsD9RAfuWxdGCMTL+2qPVstQSZkQ4clbQtshK2wGbYDgwYZ94MESDoxsxQ6jH3rMRnafHkESe8RnFTGgF8r5ZvV3qBM+ze+rcepO8ifuVdmT/XshBfXfdz7PXH07gDIyh362oY46Qw0gcsRwEEhxkaY6SpD1pIgE7KhA7o8T+qXoV+w9mLjOohOmP4Xp9+M3iM47UW9RHgy+AGP/pvPLYGP6x+BESRsgC2wCWPO669pUBtC6hmbWXxPLYdpG3SgWrRz4Npm0SYeDTKSM5vS9pzNRanayXefk6WFc6MHD6hsRIPDzBYNVBlONlOZWgh85K2ldBVIymb0nFg4Le+8+5yI3OHK1dRpR68nFgtOGzZx53k1Q8UsCbGNWY7ZNnk6crPqmgEcuugyV3Fsm5+J4PCtvRiBwWMmEW9Kwq0ubUMJ9VWTcd80wE1eI7J5OH48kHp/yBfCMMVv26dNbxtlx2Bb4lwDd+d5MnTlWO3Z4t77ZOwZsw+sQIY+O5+MvEM70z4lgHITHGlQM+ZmMwvGkjVUE9phMIhApbBPG8im2Zs04D1oTJCVQsxw+FsbuviPhSTTf2LHg73nCNnJa+IHbXhm+TXIaFdDXSfa5exEhACR1ujtUBeQmi+AuTjtd8PdN8ri6xM1GWjDM8sPGaSmDXWTrcCSpGqaUb+BtkWaxJoMDIY30A9tuUKUJssPGaJk6kpAGzhvmEWAQHzTj4f7Bon6jEw+L+MHh3sLOLL8g8MiZ+fznc7O1/knn+/JKiAPHDDojW/iQQuyaTOKN6szl0gAOTov47vPaQanQe4+J/RBX0vQoWs4HuXA1QDWQM7PBAUIl3feeEpseVDnoSFvfObDojffRJCh00AbotoW2BZSuAw40ftBS9zd00taEYRpsOQJWQwWeo+m51ae6d+WpufCDIowLdEJnhw4aUu2+QYhDEJyhGQcBsU1zzMebdNzK79bwJ10kmltA19A8UJvCW8EXkSFWVQRFkuEXVKkAilq/XKBtgCzsixpG7h86CWhE8AmgiIbMlaJV+FiRuNlME39oatkyfFoVaV7C7JmdAXo9lfeDt/7Tp4N31tGvhm+D2/9UvjOpWxiwrIfKgIY9mpMhVTaxDD23r4FB3pgx3W9th8di88AErxWjpZNb8bjtsK1WTpveCvBWkETOE2PX//5+Jf+HeVUIJM2JdvTXUKdQ7Qp6Q3gmHdOz/U89IdHw59Lx34lS1N/ibxsv/27D/dCdfNwyE+bzv/62Q928iAzBq+KnIBj+FUgQOff+IPkQwKPDmOC1HJZbc+V+vsC2OVgs8vFhBLqckSWO5MgtXqwrfTHS0Gh4vV+NSteOSY379wT66eN8k8tB15WAyADstou/5R6003VbFhYoCz3YUG2N55QFOLMp71qq2Ea/PatX12ZNR15PEnO2dKUi2aPzyQzY0EQsgeAs2FJcLpt5tjP3VIf2vBMUwBpqmbQAV3Q6a2JtDEXqokHc+MueUtmd86Q0uCoCAs6wi9Xy4QXj+zdLVOzr4a/dX94MpTrP/120gehbKNLU3Y/2AbOEqZ8fGCABffn274SwB3e8yl5dnopLAWW0IZn4AEv+ug7MpAZwCFBn67blRuD1pPxdMnL9Sy40NmUBvG3Bbf3rQ3B8O3Hb5HPXXVB4AMgeAQfAsYz8IAXfWogHV3aCTmQwEI5jXXR3NUOrdiOuYu2bZTD2yQB10QEeXTPb0Vko8iv30pka294TvDO+jUNeN5rq5FiVstl90PfOJaAOzFe31qR+Iwg0dcj6GKdpvQYnF4szmT02YI07MPszPrF9evl72fO1OShDc+a+oopacaSf4dsJgAsOcPTCsL613Jf7F+vfRA+UoHEbErCb4LTfDmCLm6CS0ES04BuQCd9dO1V1uLO3aw5XNgfuut78t6LPwlhVzoG8UEf9PXSNP5td/rWPthuh9cgBzJmJ9xWwGkpvntkDl7CS0ivPlpP2pD0wlO3bzJ9Ldk5wos2ANs0umI7vrkeurcseJxtUyJxTmE5FtGfO3UNikaj7fFDvwu/4Sndbnmx8FMmweVuKno3OvQti2SZCDcbXtqlwrR+zYrE3bVeczTR2A3rz42tAEYgut0CFeM5XUWoHedV92M0Bk21dRAMTTd0o+CqsqV5MXkg9crRtV/fGJ6cPvNRlgcypra+mui0h6bWvtmpun2kQZF6kTd3XOUp4t96B6GvftiE2gOk+fXOwuqQhl295mG6FsbgJRd8ZpknPHR1090TbpVIdslIajLfuakRXKQ/vtDri8KxkaUPYtoKTtp+2In5IXhwJRNIJxR7eqPb4n6waT1UhnvkFac00ZN6P9hkm7Yfzw8dN8sEL7ZxytVEgeGwo7rykatAJxXsaieQLezmqt1adxWW+qTJ2kbvHfjpTLIBTpYJhkNtEDt3ru0yQRnf/3YvrWINlGX5bHmxArhv//Hw/ZvJI4k8bya19lg7dWSlJ7yZ+yqe4NzR8gNP7AifYHAGnDD8ELrTc4GX/TzqAs62Bw/qN9WWl+pDT3eCUTWVfffvTzxiiR7XwGzZw040bUfaHI+MrKLdhM75+IZKEu6cR7rw6ERbXw0r3VEMitlYzs7Xz8eTC3FtE4yi0rJhyf0zb6LxjtBpV20MokG/LU3xfnTD2CNdve338TcX7RwvnoHH6+tRXPire+QeOOJgW5Kq2VlLvymue1IYnmtJOsJ4miyZyLI7HLcmo8HhbVm3t9Gu3X/tBK+E3048Pdt6iz+P2b00rgZQg2Oh9T/prRLS6ySyFSQpuWstyULPnFScAmoplf7LDakrf04Gy4nMQSmnVtlejaL/Jrm2i8gnXlYyr1g4rLMAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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"
    ]
    //p
    //deletedata();
    //showdata();
    var confirm_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAZCAYAAACB6CjhAAABnUlEQVRYhWP8//8/Awi499ZCGCMA7CxuZoT5EhwAIM/HeYiMFP8zTJ9xj+HI5IngQGB066kBez5aOx+uYOnViQPqQHoAWCAwDXuf4gELFy78P6IDAARYYIyRkOyxAZwpALlMoBborbhItEmkqKUEsODSS0mKADm+uEOfZD3EiJFqLiGAMwAoASBHwgIB3RPIfJhnYGKEPEeLVEGTAGBA8gyyp5BTBraAINZMagKaBQADiVmBmNilWQBwsNEuHNDNRuYjs6v7jFHUtRadxRCjBQC7gJMGAVCTc5KhZYo5mEb3GDIbpAZdDwzQwl3ogCY2IHsanwdJMQfdLGoBmrQEsTkUV4rApg7ZHGRMC0CXpjByzOMKBJgaYgKJmoBmmQzZI+ixhy6HnjVgbGwBQe2UAO4O54fIUNXQoQDaeq4xpJoY0ScLDGYwGgCDwA10A17y6RhWgQNAV9RiuPoZBWx7OJPh/ZcfKP4FD4ra5Ob/X96ZNCgcSQ8QWT4PXACCAHxYHBQIw9vbCADzPMj/8AAAAdAg4YC6jL6AkYGBgQEAGLGwUf0XRXYAAAAASUVORK5CYII=";
    var egg_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABfUlEQVRYhWMYBaNgxANGfAHw//9/rOJPmlswJGRqa7CaxciI1wrSHHC6Yu5/Se7nDELhDgzMvBxw8b+ffzC8W3kAq0Oo5gCQ5YaNvmD2v5+vEWq+fgc7AAT+fHnPcHPVKwbTjmS4uVRxALLlyADmEHyOIOQAJryyUAAKdry+4OaEs1l4BAmqJ8kBIN9LlKVh18wuCmcjpwk+b32wPqo4gBTfwAApoUBUFNASsOAzGxSMevkecD5y6mdAiwJ0gBQNeFMhXgdAglEfxWJkS9EdhF0/fkBSFODzMbmAaAdgs5waDsLrgOdfJRl+Pn9OtkUg/RQ5gByAXB4QA/A6AFScftp6kSiDYEUxCLBICDKA9CHXCbgAwRAABSMotf999whDDj0XgHwPcwgxwQ8CRFdGevn6EEuE5FAcAKuIYJaDfH+x7QTRlRHJ1fGvh7fwxvOliRepXx0jOwJUuIimeGCofT1nBzjY0eOdqg5Adgi6GK4ER8gBo2AUjHDAwMAAAA5gt27Sor0VAAAAAElFTkSuQmCC";
    var egg_size=32;
    var nnstr = GM_getValue('nnstr', "");
    var elynum = GM_getValue('ely', 0);
    var levelnum = GM_getValue('level', 0);
    var expnum = GM_getValue('exp', 0);
    var expmax;
    var heronum = GM_getValue('heronum', 0);
    var charnum = GM_getValue('charnum', 0);
    var featnum = GM_getValue('featnum', 0);
    var sorm = GM_getValue('sorm', 0);
    var herostr = "未孵化"//list_hero[heronum];
    var racetips;
    //var i = 0;
    var obj = document.querySelector("div[id=top-nav-appintro]")
    if(levelnum<3){egg_size +=levelnum*16}else{egg_size=80;herostr = list_hero[heronum]}
    if(levelnum>2){herostr=list_hero[heronum]}else{racetips="孵化期无法查看种族"};
    //ui
    var uiself=`
        <div class="attribute">
        <img id="hero_img" width=`+egg_size+` src=`+egg_img+`>
        <a class="nickname">昵称:`+nnstr+` </a>
        <a class="nickname">性格:`+list_character[GM_getValue('charnum', 0)]+` </a>
        <a class="nickname">特性:`+list_feature[featnum]+` </a>
        <a class="race" title=`+racetips+`>种族:`+herostr+` </a>
        <a class="leveltag" title="孵化期:Lv.0-Lv.2\n幼年期:Lv.3-lv.4">等级: Lv.`+levelnum+` </a>
        <a class="exptag">经验: `+expnum+` </a>
        <a class="elytag">金钱: `+elynum+` </a>
        </div>`;
    //command
    function deletedata(){
    var databuff = GM_listValues();
        databuff.forEach(db=>{GM_deleteValue(db)})
    }
    function readdata(){
        nnstr = GM_getValue('nnstr', "");
        elynum = GM_getValue('ely', 0);
        levelnum = GM_getValue('level', 0);
        expnum = GM_getValue('exp', 0);
        heronum = GM_getValue('heronum', 0);
        charnum = GM_getValue('charnum', 0);
        featnum = GM_getValue('featnum', 0);
        sorm = GM_getValue('sorm', 0);
    }
    function showdata(){
    var databuff = GM_listValues();
        databuff.forEach(db=>{console.log(db+":"+GM_getValue(db,""))})
    }
    // Your code here...
    //调试状态 使窗口处于长时间悬浮状态
    //GM_setValue('register', 0);
    //console.log(GM_listValues());
    if(0)document.querySelector("div.top-nav-doubanapp").className="top-nav-doubanapp more-active"
    //定位下载豆瓣位置，进行重写
    document.querySelector("a.lnk-doubanapp").textContent="豆瓣宠物"
    document.querySelector("a.lnk-doubanapp").href=""//去除链接跳转
    obj.innerHTML="";//重写
    //注册 判断是否有存档
    var isregister = GM_getValue('register', 0);
    if(!isregister){
        obj.innerHTML=`<div class="register"><p class="wenben">未检测到存档，<br>是否领养一只(ฅ´ω\`ฅ)</p><a class="confirm"><img src=`+confirm_img+`></a>`;
        var btn_confirm = document.querySelector("a.confirm");
        btn_confirm.onclick = function(){
            obj.innerHTML="";//抹掉进入创建角色界面
            var creatui = document.createElement("div");//创建角色ui
            var egg_small = document.createElement("img");//小蛋
            var btn_creat = document.createElement("a");//确定
            var btn_creat_img = document.createElement("img");//确定
            var description = document.createElement("p");
            var tips = document.createElement("p");
            var nickname = document.createElement("INPUT");
            nickname.setAttribute("type", "text");
            nickname.id="nickname";
            tips.id="tips";
            tips.style="color: deeppink;";
            nickname.style="text-align: center;";//居中
            creatui.className="creatui";
            egg_small.src=egg_img;
            description.textContent="给TA取个昵称吧(ฅ´ω\`ฅ)"
            btn_creat_img.src=confirm_img;
            //载入图片
            btn_creat.className="creatbtn";
            btn_creat.appendChild(btn_creat_img);
            //按钮行为
            btn_creat.onclick = function(){
                var nickname_str = document.querySelector("input[id=nickname]");
                var nickname_len = nickname_str.value.length;
                 var tips = document.querySelector("p[id=tips]")
                //console.log(nickname_len)
                if(nickname_len<8){
                    tips.textContent="";
                    //初始化角色
                    var herobit_temp = Math.floor(Math.random()*list_hero.length);//角色位
                    var charbit_temp = Math.floor(Math.random()*list_character.length);//性格位
                    var featbit_temp = Math.floor(Math.random()*list_feature.length);//特性位
                    var sorm_temp = Math.floor(Math.random()*2)//
                    GM_setValue('heronum', herobit_temp);
                    GM_setValue('charnum', charbit_temp);
                    GM_setValue('featnum', featbit_temp);
                    GM_setValue('sorm', sorm_temp);
                    GM_setValue('nnstr', document.querySelector("input[id=nickname]").value);
                    //console.log(list_character[charbit_temp]+"的"+list_feature[featbit_temp]+list_hero[herobit_temp])
                    //注册完毕封装
                    GM_setValue('register', 1);
                    readdata();
                    obj.innerHTML=`
        <div class="attribute">
        <img width=`+egg_size+` src=`+egg_img+`>
        <a class="nickname">昵称:`+GM_getValue('nnstr', "")+` </a>
        <a class="nickname">性格:`+list_character[GM_getValue('charnum', 0)]+` </a>
        <a class="nickname">特性:`+list_feature[GM_getValue('featnum', 0)]+` </a>
        <a class="race" title=`+racetips+`>种族:`+herostr+` </a>
        <a class="leveltag" title="孵化期:Lv.0-Lv.2\n幼年期:Lv.3-lv.4">等级: Lv.`+GM_getValue('levelnum', 0)+` </a>
        <a class="exptag">经验: `+GM_getValue(expnum,0)+` </a>
        <a class="elytag">金钱: `+GM_getValue(elynum,0)+` </a>
        </div>`
                    //计数器

                    var timer = setInterval(function () {
                        GM_setValue('ely', ++elynum);
                        GM_setValue('exp', ++expnum);
                        //升级判断
                        //升级判断
                        for(var cnt = 0;cnt<list_exp.length;cnt++){
                            if(list_exp[cnt]>expnum){
                                expmax=list_exp[cnt];
                                levelnum=cnt;
                                GM_setValue('level',cnt);
                                break;
                            }
                        }
                        document.querySelector("a.elytag").textContent="金钱: "+ elynum;
                        document.querySelector("a.exptag").textContent="经验: "+ expnum+"/"+expmax;
                    },1000);
                }else{
                    tips.textContent="最大长度不能超过7";
                }
            }
            //载入创捷界面
            creatui.appendChild(egg_small);
            creatui.appendChild(description);
            creatui.appendChild(nickname);
            creatui.appendChild(tips);
            creatui.appendChild(btn_creat);
            //载入
            obj.appendChild(creatui);
        }
    }else{
        obj.innerHTML=uiself
        if(levelnum>2){document.querySelector("img[id=hero_img]").src=hero_img[heronum];document.querySelector("img[id=hero_img]").width=44}
        //计数器
        var timer = setInterval(function () {
            //expnum = 0;
            //elynum=0;
            GM_setValue('ely', ++elynum);
            GM_setValue('exp', expnum+=1);
            //升级判断
            for(var cnt = 0;cnt<list_exp.length;cnt++){
                if(list_exp[cnt]>expnum){
                    expmax=list_exp[cnt];
                    levelnum=cnt;
                    GM_setValue('level',cnt);
                    break;
                }
            }
            document.querySelector("a.leveltag").textContent="等级: Lv."+ levelnum;
            document.querySelector("a.elytag").textContent="金钱: "+ elynum;
            document.querySelector("a.exptag").textContent="经验: "+ expnum+"/"+expmax;
        },1000);
    }
})();