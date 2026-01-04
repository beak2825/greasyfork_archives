// ==UserScript==
// @name         其乐快捷分类
// @namespace    https://greasyfork.org/users/101223
// @version      0.6
// @description  其乐论坛快捷分类/移动
// @author       Splash
// @match        https://keylol.com/forum.php?mod=viewthread&tid=*
// @match        https://keylol.com/t*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/400253/%E5%85%B6%E4%B9%90%E5%BF%AB%E6%8D%B7%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/400253/%E5%85%B6%E4%B9%90%E5%BF%AB%E6%8D%B7%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (!jQuery('#modmenu a:contains("移动")').length)
        return;
    const gdTypeid = [{
            name: '热点聚焦',
            fid: 161,
            typeid: [{
                    id: 459,
                    name: '试玩免费'
                }, {
                    id: 460,
                    name: '游戏应用'
                }, {
                    id: 461,
                    name: 'Steam'
                }, {
                    id: 526,
                    name: 'Steam硬件'
                }, {
                    id: 462,
                    name: '国产'
                }, {
                    id: 463,
                    name: '工具插件'
                }, {
                    id: 464,
                    name: '卡牌相关'
                }, {
                    id: 465,
                    name: '其他'
                }, {
                    id: 729,
                    name: 'Steam库封面图'
                }
            ]
        }, {
            name: '平台研讨',
            fid: 127,
            typeid: [{
                    id: 744,
                    name: 'Steam商城'
                }, {
                    id: 745,
                    name: 'Steam社区'
                }, {
                    id: 746,
                    name: 'Steam交易'
                }, {
                    id: 790,
                    name: 'Steam账号'
                }, {
                    id: 791,
                    name: 'Steam卡牌'
                }, {
                    id: 793,
                    name: 'Steam客户端'
                }, {
                    id: 792,
                    name: 'Steam相关网站'
                }, {
                    id: 747,
                    name: 'Steam其他'
                }, {
                    id: 748,
                    name: '零售站'
                }, {
                    id: 794,
                    name: '游戏'
                }, {
                    id: 750,
                    name: '其乐社区'
                }, {
                    id: 755,
                    name: '其他'
                }, {
                    id: 788,
                    name: '公告'
                }
            ]
        }, {
            name: '华语汉化',
            fid: 257,
            typeid: [{
                    id: 269,
                    name: '汉化补丁'
                }, {
                    id: 271,
                    name: '官方汉化'
                }, {
                    id: 270,
                    name: '汉化相关'
                }
            ]
        }, {
            name: '成就指南',
            fid: 235,
            typeid: [{
                    id: 639,
                    name: '成就指南'
                }, {
                    id: 640,
                    name: '攻略心得'
                }, {
                    id: 641,
                    name: '成就推荐'
                }, {
                    id: 679,
                    name: '视频专栏'
                }, {
                    id: 766,
                    name: '成就新闻'
                }, {
                    id: 643,
                    name: '其他'
                }, {
                    id: 642,
                    name: '公告'
                }
            ]
        }, {
            name: '游戏互鉴',
            fid: 129,
            typeid: [{
                    id: 631,
                    name: '公告'
                }, {
                    id: 632,
                    name: '游戏评测'
                }, {
                    id: 633,
                    name: '新游推荐'
                }, {
                    id: 636,
                    name: '游戏短评'
                }
            ]
        }, {
            name: '福利放送',
            fid: 319,
            typeid: [{
                    id: 469,
                    name: 'Steam'
                }, {
                    id: 470,
                    name: 'Origin'
                }, {
                    id: 471,
                    name: 'Uplay'
                }, {
                    id: 472,
                    name: 'GOG'
                }, {
                    id: 662,
                    name: 'Epic Games'
                }, {
                    id: 638,
                    name: 'Windows商店'
                }, {
                    id: 473,
                    name: 'Itch.io'
                }, {
                    id: 474,
                    name: 'Desura'
                }, {
                    id: 475,
                    name: '游戏内部'
                }, {
                    id: 477,
                    name: '领取心得'
                }, {
                    id: 742,
                    name: '脚本工具'
                }, {
                    id: 536,
                    name: '回收'
                }, {
                    id: 743,
                    name: '发Key通知'
                }, {
                    id: 476,
                    name: '其他'
                }
            ]
        }, {
            name: '购物心得',
            fid: 234,
            typeid: [{
                    id: 786,
                    name: '临时工'
                }, {
                    id: 529,
                    name: 'Steam日常特惠'
                }, {
                    id: 538,
                    name: 'Steam下架/不可购买'
                }, {
                    id: 539,
                    name: 'Steam价格调整'
                }, {
                    id: 646,
                    name: 'Steam社区物品'
                }, {
                    id: 468,
                    name: 'Steam预购'
                }, {
                    id: 259,
                    name: 'Paypal'
                }, {
                    id: 263,
                    name: '支付'
                }, {
                    id: 542,
                    name: '众筹'
                }, {
                    id: 776,
                    name: '实体'
                }, {
                    id: 260,
                    name: '亚马逊'
                }, {
                    id: 634,
                    name: 'GamersGate'
                }, {
                    id: 777,
                    name: 'Chrono'
                }, {
                    id: 778,
                    name: 'Gamesplanet'
                }, {
                    id: 261,
                    name: 'GMG'
                }, {
                    id: 262,
                    name: '俄区'
                }, {
                    id: 265,
                    name: '其他网站'
                }, {
                    id: 779,
                    name: '已拥有福利'
                }, {
                    id: 780,
                    name: '购买心得'
                }, {
                    id: 781,
                    name: '凭证/合集包变动'
                }, {
                    id: 782,
                    name: '发售折扣'
                }, {
                    id: 783,
                    name: '精选合集'
                }, {
                    id: 784,
                    name: '厂商活动'
                }, {
                    id: 785,
                    name: '优惠预告'
                }, {
                    id: 787,
                    name: '公告'
                }, {
                    id: 264,
                    name: '分享'
                }, {
                    id: 204,
                    name: '礼物'
                }, {
                    id: 205,
                    name: '折扣'
                }, {
                    id: 206,
                    name: '信用卡'
                }, {
                    id: 207,
                    name: '跨区'
                }
            ]
        }, {
            name: '慈善包',
            fid: 271,
            typeid: [{
                    id: 306,
                    name: 'Humble Bundle'
                }, {
                    id: 308,
                    name: 'Groupees'
                }, {
                    id: 309,
                    name: 'Indie Gala'
                }, {
                    id: 310,
                    name: 'Fanatical'
                }, {
                    id: 423,
                    name: 'Daily Indie Game'
                }, {
                    id: 592,
                    name: 'Otaku & Go Go'
                }, {
                    id: 604,
                    name: 'Cubic Bundle'
                }, {
                    id: 605,
                    name: '驰骋游域'
                }, {
                    id: 312,
                    name: '其它包包'
                }, {
                    id: 311,
                    name: 'Indie Game Stand'
                }, {
                    id: 422,
                    name: 'Flying Bundle'
                }, {
                    id: 307,
                    name: 'Indie Royale'
                }, {
                    id: 363,
                    name: '包包Key'
                }, {
                    id: 424,
                    name: '包包资讯'
                }, {
                    id: 775,
                    name: '脚本工具'
                }
            ]
        }, {
            name: '交易中心',
            fid: 201,
            typeid: [{
                    id: 47,
                    name: '出售'
                }, {
                    id: 48,
                    name: '收购'
                }, {
                    id: 49,
                    name: '交换'
                }, {
                    id: 637,
                    name: '代购'
                }, {
                    id: 657,
                    name: '实物'
                }, {
                    id: 656,
                    name: '公告'
                }
            ]
        }, {
            name: '分享互赠',
            fid: 254,
            typeid: [{
                    id: 495,
                    name: 'SG - 私人'
                }, {
                    id: 496,
                    name: 'SG - 群组'
                }, {
                    id: 497,
                    name: 'SG - 公开'
                }, {
                    id: 498,
                    name: 'SG - 白名单'
                }, {
                    id: 499,
                    name: '解谜'
                }, {
                    id: 500,
                    name: '明Key'
                }, {
                    id: 501,
                    name: '优惠券'
                }, {
                    id: 661,
                    name: '回帖抽奖'
                }, {
                    id: 502,
                    name: '其他'
                }
            ]
        }, {
            name: '资源载点',
            fid: 189,
            typeid: [{
                    id: 29,
                    name: '游戏备份'
                }, {
                    id: 24,
                    name: 'Steam皮肤和展柜'
                }, {
                    id: 26,
                    name: '游戏壁纸和图片'
                }, {
                    id: 27,
                    name: '修改和Mod'
                }, {
                    id: 30,
                    name: '其它资源'
                }
            ]
        }, {
            name: '内部资源',
            fid: 341,
            typeid: [{
                    id: 797,
                    name: '原声音乐'
                }, {
                    id: 822,
                    name: '漫画图片'
                }, {
                    id: 798,
                    name: '其他分享'
                }
            ]
        }, {
            name: '技术问题',
            fid: 301,
            typeid: [{
                    id: 376,
                    name: 'Steam - 帐号问题'
                }, {
                    id: 377,
                    name: 'Steam - 程序异常'
                }, {
                    id: 378,
                    name: 'Steam - 网络链接'
                }, {
                    id: 380,
                    name: 'Steam - 交易市场'
                }, {
                    id: 466,
                    name: 'Steam - 卡牌徽章'
                }, {
                    id: 397,
                    name: 'Steam - 其他相关'
                }, {
                    id: 478,
                    name: 'Origin - 技术问题'
                }, {
                    id: 480,
                    name: 'Uplay - 技术问题'
                }, {
                    id: 694,
                    name: 'Epic Games - 技术问题'
                }, {
                    id: 482,
                    name: '其他平台技术问题'
                }, {
                    id: 547,
                    name: '第三方插件/网站问题'
                }
            ]
        }, {
            name: '购物问题',
            fid: 302,
            typeid: [{
                    id: 382,
                    name: 'Steam商店限区&跨区'
                }, {
                    id: 384,
                    name: 'Steam商店支付&购买'
                }, {
                    id: 383,
                    name: 'Steam商店促销&折扣'
                }, {
                    id: 443,
                    name: 'Steam商店退款'
                }, {
                    id: 408,
                    name: '其他Steam商店购物'
                }, {
                    id: 395,
                    name: '慈善包网站相关'
                }, {
                    id: 484,
                    name: 'Origin购物相关'
                }, {
                    id: 483,
                    name: 'Uplay购物相关'
                }, {
                    id: 695,
                    name: 'Epic Games购物相关'
                }, {
                    id: 485,
                    name: '其他平台购物相关'
                }, {
                    id: 381,
                    name: '杉果相关'
                }, {
                    id: 409,
                    name: 'GMG相关'
                }, {
                    id: 410,
                    name: '亚马逊相关'
                }, {
                    id: 696,
                    name: '俄区零售Key相关'
                }, {
                    id: 385,
                    name: '其他网站购物'
                }
            ]
        }, {
            name: '社区问题',
            fid: 304,
            typeid: [{
                    id: 390,
                    name: '其乐 - 帐户问题'
                }, {
                    id: 391,
                    name: '其乐 - 积分&用户组问题'
                }, {
                    id: 392,
                    name: '其乐 - 制度问题'
                }, {
                    id: 394,
                    name: '其乐 - 其他问题'
                }, {
                    id: 678,
                    name: '其乐 - 提问指定悬赏'
                }, {
                    id: 411,
                    name: '7L - 确认求助'
                }, {
                    id: 393,
                    name: '7L - 其他相关问题'
                }, {
                    id: 528,
                    name: 'Keylol - 旧其乐站点相关'
                }
            ]
        }, {
            name: '资源／汉化问题',
            fid: 318,
            typeid: [{
                    id: 521,
                    name: '寻找资源'
                }, {
                    id: 523,
                    name: '寻求汉化'
                }, {
                    id: 635,
                    name: '临时索取'
                }, {
                    id: 524,
                    name: '汉化相关'
                }
            ]
        }, {
            name: '游戏 / 成就问题',
            fid: 303,
            typeid: [{
                    id: 387,
                    name: '游戏问题'
                }, {
                    id: 396,
                    name: '成就问题'
                }, {
                    id: 603,
                    name: '寻求游戏'
                }
            ]
        }, {
            name: '福利 / 软硬 / 其它',
            fid: 322,
            typeid: [{
                    id: 508,
                    name: 'Steamgifts/挖煤网'
                }, {
                    id: 509,
                    name: '福利领取'
                }, {
                    id: 540,
                    name: '软件硬件'
                }, {
                    id: 511,
                    name: '其他问题'
                }
            ]
        }, {
            name: '魔法学园',
            fid: 311,
            typeid: []
        }, {
            name: '综合讨论',
            fid: 251,
            typeid: [{
                    id: 663,
                    name: '新游资讯'
                }, {
                    id: 664,
                    name: '更新发布'
                }, {
                    id: 665,
                    name: '周边新闻'
                }, {
                    id: 666,
                    name: '游戏杂谈'
                }, {
                    id: 765,
                    name: '活动推广'
                }, {
                    id: 756,
                    name: '命运系列'
                }, {
                    id: 757,
                    name: '荒野大镖客系列'
                }, {
                    id: 758,
                    name: '奥日系列'
                }, {
                    id: 759,
                    name: '无主之地系列'
                }, {
                    id: 760,
                    name: '生化危机系列'
                }, {
                    id: 761,
                    name: '怪物猎人世界系列'
                }, {
                    id: 762,
                    name: 'Warframe'
                }, {
                    id: 763,
                    name: '只狼'
                }, {
                    id: 764,
                    name: '魂系列'
                }, {
                    id: 767,
                    name: '全面战争系列'
                }, {
                    id: 768,
                    name: '巫师系列'
                }, {
                    id: 769,
                    name: '骑马与砍杀系列'
                }, {
                    id: 771,
                    name: '辐射系列'
                }, {
                    id: 772,
                    name: '最终幻想系列'
                }, {
                    id: 773,
                    name: '生化奇兵系列'
                }, {
                    id: 774,
                    name: '赛博朋克2077'
                }, {
                    id: 840,
                    name: 'Wallpaper Engine'
                }, {
                    id: 667,
                    name: '其他'
                }
            ]
        }, {
            name: '谈天说地',
            fid: 148,
            typeid: [{
                    id: 375,
                    name: '灌水杂谈'
                }, {
                    id: 290,
                    name: '收藏分享'
                }, {
                    id: 457,
                    name: '投资理财'
                }, {
                    id: 407,
                    name: '运动养生'
                }, {
                    id: 291,
                    name: '影音时尚'
                }, {
                    id: 288,
                    name: '灵异小说'
                }, {
                    id: 585,
                    name: '社区技巧'
                }, {
                    id: 590,
                    name: '情感交流'
                }, {
                    id: 620,
                    name: '交友联机'
                }, {
                    id: 601,
                    name: '欧气满满'
                }, {
                    id: 710,
                    name: '好价实物'
                }, {
                    id: 731,
                    name: '每周话题'
                }, {
                    id: 770,
                    name: '愚人节快乐'
                }
            ]
        }, {
            name: '历史主题',
            fid: 163,
            typeid: []
        }
    ];
    let gdArea = jQuery('<div class="gd-thread-move"><div class="gd-thread-move-left"></div><div class="gd-thread-move-right"></div></div>'),
    currentFid = fid;
    addStyle(`
.gd-thread-move {
    left: 0;
    width: 300px;
    position: fixed;
    top: 45px;
}
.gd-thread-move a {
    display: block;
    padding: 10px;
}
.gd-thread-move-left,
.gd-thread-move-right {
    float: left;
    height: 800px;
    overflow: scroll;
}
.gd-thread-move-left::-webkit-scrollbar,
.gd-thread-move-right::-webkit-scrollbar {
    display: none;
}
.gd-thread-move-left {
    background-color: #eaba1d;
    width: 40%;
    border: 100px;
}
.gd-thread-move-left a.gd-highlight {
    background-color:#57bae8
}
.gd-thread-move-right {
    width: 60%;
    background-color: #00d5ff;
}
.gd-thread-move-right div{
    display: none;
}
.gd-thread-move-right div.gdShow{
    display: block;
}
`);
    for (let i = 0; i < gdTypeid.length; i++) {
        let gdTagForum = jQuery(`<a href="javascript:;" data-fid="${gdTypeid[i].fid}">${gdTypeid[i].name}</a>`),
        gdTagTypeGroup = jQuery(`<div data-fid="${gdTypeid[i].fid}"></div>`);
        for (let j = 0; j < gdTypeid[i].typeid.length; j++) {
            gdTagTypeGroup.append(jQuery(`<a href="javascript:;" data-typeid="${gdTypeid[i].typeid[j].id}">${gdTypeid[i].typeid[j].name}</a>`));
        }
        gdTagTypeGroup.append(jQuery(`<a href="javascript:;" data-typeid="0">无分类</a>`));
        if (fid == gdTypeid[i].fid) {
            gdTagForum.addClass('gd-highlight');
            gdTagTypeGroup.addClass('gdShow');
        }
        gdArea.find('.gd-thread-move-left').append(gdTagForum);
        gdArea.find('.gd-thread-move-right').append(gdTagTypeGroup);
    }
    gdArea.find('.gd-thread-move-left').on('mouseover', 'a', function () {
        let gdTagForum = jQuery(this),
        gdTagTypeGroup = gdArea.find(`.gd-thread-move-right div[data-fid="${gdTagForum.attr('data-fid')}"]`),
        thisFid = gdTagForum.attr('data-fid');
        if (currentFid != thisFid) {
            currentFid = thisFid;
            gdArea.find(`.gd-thread-move-left a:not([data-fid="${currentFid}"])`).removeClass('gd-highlight');
            gdArea.find(`.gd-thread-move-right div:not([data-fid="${currentFid}"])`).removeClass('gdShow');
            gdTagForum.addClass('gd-highlight');
            gdTagTypeGroup.addClass('gdShow');
        }
    });
    gdArea.find('.gd-thread-move-right').on('click', 'div a', function () {
        let gdTagType = jQuery(this),
        thisTypeid = gdTagType.attr('data-typeid');
        ajaxMove(thisTypeid, currentFid == fid ? null : currentFid);
    });
    jQuery('#wp').append(gdArea);
    function ajaxMove(toTypeid, toFid) {
        let formHash = jQuery('form input[name="formhash"]').val(),
        sendData = {
            formhash: formHash,
            fid: fid,
            redirect: `${location.origin}/t${tid}-1-1`,
            handlekey: 'mods',
            'moderate[]': tid,
            'operations[]': !toFid ? 'type' : 'move',
            reason: '按板块归类（版务章程 §15; §27）'
        };
        if (!toFid) {
            sendData.typeid = toTypeid;
        } else {
            sendData.threadtypeid = toTypeid;
            sendData.moveto = toFid;
        }
        jQuery.ajax({
            url: '/forum.php?mod=topicadmin&action=moderate&optgroup=2&modsubmit=yes&infloat=yes&inajax=1',
            type: 'post',
            timeout: 5e3,
            data: sendData,
            success: function (resp) {
                let response = resp.getElementsByTagName('root')[0].childNodes[0].nodeValue;
                if (response.indexOf('管理操作成功') > -1) {
                    //location.reload();
                    window.close();
                } else {
                    console.log(resp);
                    response = jQuery.trim(response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''));
                    showDialog(`${response!=''?response:'出现异常，请查看控制台！'}`, 'notice', null, null, 'true', null, null, null, null, 3);
                }
            },
            error: function (resp) {
                console.log(resp);
                showDialog("出现异常，请查看控制台！", 'notice', null, null, 'true', null, null, null, null, 3);
            }
        })
    }
    function addStyle(gd_style) {
        return jQuery('<style type="text/css">' + gd_style + '</style>').appendTo(jQuery('head'));
    }
})();