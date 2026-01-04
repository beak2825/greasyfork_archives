// ==UserScript==
// @name         自用相薄跳转脚本
// @namespace    自用相薄跳转脚本
// @version      6.0
// @description  供自己方便使用的相薄跳转脚本
// @author       B站百科全书
// @copyright    2023,B站百科全书(https://space.bilibili.com/8350763)
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @match        http*://t.bilibili.com/*
// @match        http*://www.bilibili.com/opus/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/449665/%E8%87%AA%E7%94%A8%E7%9B%B8%E8%96%84%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449665/%E8%87%AA%E7%94%A8%E7%9B%B8%E8%96%84%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
更新记录
2019-07-23-v2.0——简化代码运行逻辑，提高脚本执行效率

2019-07-25-v2.0——修改脚本许可协议，由GPL改为MIT

2019-07-29-v2.1——添加注释

2019-07-31-v2.2——更新注释信息

2019-08-11-v2.3——1、优化注释信息 2、修改作者名称（由小写字母改为大写字母） 3、更新基本信息，添加版权信息

2019-10-27-v2.4——更新作者信息

2019-12-01-v2.5——1、更新作者信息 2、更新版本号格式 3、增加更新记录

2020-02-23-v2.6——1、优化代码，提高脚本执行成功率 2、更新注释信息 3、更新作者信息 4、更新版权信息 5、更新版本号格式

2021-03-13-v3.0——1、支持B站相薄改动后从用户个人空间--投稿/收藏--相薄页面打开带图动态可以跳转 2、更新版权信息

2021-03-31-v4.0——检测到动态包含B站官方抽奖功能时不进行跳转

2021-04-07-v4.1——修复某些动态不能跳转的问题

2021-04-09-v4.2——检测到动态包含B站官方稿件预约功能时不进行跳转

2021-04-09-v4.3——优化代码

2021-04-09-v4.4——修复动态跳转判断错误的问题

2021-06-18-v4.5——1、检测到动态包含B站官方投票功能时不进行跳转

2021-06-19-v4.6——1、检测到动态包含B站官方直播预约功能时默认不进行跳转 2、包含B站官方抽奖、稿件/直播预约和投票功能的动态可以根据注释修改代码选择是否进行跳转，默认不跳转

2021-11-30-v4.7——检测到动态包含相关作品/推荐信息时可以根据注释修改代码选择是否进行跳转，默认不跳转

2022-04-09-v4.8——修复功能失效的问题（发现B站相关页面前端部分更新）

2022-08-16-v5.0——1、跳转时支持同步传输评论锚点信息 2、更新注释信息 3、更新作者信息及版权信息

2023-02-21-v5.9——1、初步支持新版"OPUS"动态 2、优化程序运行逻辑 3、修复带有评论锚点的链接跳转后锚点信息被清除的问题 4、更新注释信息 5、更新版权信息

2023-05-20-v6.0——修复功能失效的问题（发现B站相关获取动态信息AIP需要验证包含有效登录信息的Cookie）
*/

//如果频繁出现打开页面后和刷新页面都无法跳转的情况时可以试试按住Ctrl点击打开，等新打开的标签页加载完毕后再切换过去

//设置全局变量
var isOpus, opus_relation_id, url, dynamic_id, replyID, imag, forward, dynamic_index, shop_panel, space;

//获取旧版动态（t.bilibili.com/xxx）信息方法
function get_dynamic_info() {
    //获取当前页面URL的路径部分，例如："/123456789"
    url = window.location.pathname;
    //将获取到的当前页面URL的路径部分从String类型转换成Number类型并去掉"/"，得到的一串数字就是动态ID
    dynamic_id = url.substring(url.lastIndexOf('/') + 1).match(/[^\/]*$/)[0];
    //判断并获取当前页面URL的评论锚点标签值部分，例如："#reply123456789"，如果存在则为true，不存在则为false
    replyID = window.location.hash.includes('reply') ? window.location.hash : false;
    //获取类名为"bili-album__preview__picture__img"的div的length。带有上传的图片的动态会生成类名为"bili-album__preview__picture__img"的div，有则length为大于0，没有则为0
    imag = document.getElementsByClassName("bili-album__preview__picture__img").length;
    //获取类名为"bili-dyn-content__orig reference"的div的length。有转发信息的动态会生成类名为"bili-dyn-content__orig reference"的div，有则length大于0，没有则为0
    forward = document.getElementsByClassName("bili-dyn-content__orig reference").length;
    //获取类名为"bili-dyn-home--member"的div盒子的length。动态列表首页会生成类名为"bili-dyn-home--member"的div，有则length为大于0，没有则为0
    dynamic_index = document.getElementsByClassName("bili-dyn-home--member").length;
    //获取类名为"bili-dyn-content__orig__additional"的div盒子的length。带有相关作品/推荐信息/直播预约等额外信息的动态会生成类名为"bili-dyn-content__orig__additional"的div，有则length为1，没有则为0
    shop_panel = document.getElementsByClassName("bili-dyn-content__orig__additional").length;
    //获取当前页面URL的参数部分。从用户个人空间--投稿/收藏--相薄页面中打开的带图动态不会自动跳转，其动态ID也是真正的相薄ID，不需要通过B站相关api接口查询即可直接拼接打开，此类动态包含参数“type=2”，有则为ture，没有则为false
    space = window.location.search.includes('type=2');
}

//获取新版动态（www.bilibili.com/opus/xxx）信息方法
function get_opus_dynamic_info() {
    //获取当前页面URL的路径部分，例如："/123456789"
    url = window.location.pathname;
    //将获取到的当前页面URL的路径部分从String类型转换成Number类型并去掉"/"，得到的一串数字就是动态ID
    dynamic_id = url.substring(url.lastIndexOf('/') + 1).match(/[^\/]*$/)[0];
    //判断并获取当前页面URL的评论锚点标签值部分，例如："#reply123456789"，如果存在则为true，不存在则为false
    replyID = window.location.hash.includes('reply') ? window.location.hash : false;
    //获取类名为"opus-para-pic"的div的length。带有上传的图片的动态会生成类名为"opus-para-pic"的div，有则length为大于0，没有则为0
    let imagT1 = document.getElementsByClassName("opus-para-pic").length;
    //获取类名为"opus-module-top"的div的length。带有上传的图片的大封面动态会生成类名为"opus-module-top"的div，有则length为大于0，没有则为0
    let imagT2 = document.getElementsByClassName("opus-module-top").length;
    //判断并储存动态是否带图
    imag = imagT1 > 0 ? imagT1 : imagT2;
    //获取类名为"opus-para-link-card"的div盒子的length。带有相关作品/推荐信息/直播预约等额外信息的图文动态会生成类名为"opus-para-link-card"的div，有则length为1，没有则为0
    shop_panel = document.getElementsByClassName("opus-para-link-card").length;
}

//判断动态是旧版动态还是新版动态方法
function judge_opus() {
    //搜索当前页面URL，图文动态的URL中包含“opus”，有则为ture，没有则为false
    isOpus = window.location.href.includes('opus');
    //如果是新版动态
    if (isOpus) {
        //部分类型的新版动态会在当前页面的"__INITIAL_STATE__"中载入信息，其中包含可能关联的稿件ID，暂时获取不使用
        try {
            opus_relation_id = window.__INITIAL_STATE__.detail.basic;
            console.log("当前新版动态可能包含的关联稿件ID："+opus_relation_id.comment_id_str);
        } catch (error) {
            console.log("当前新版动态暂无关联稿件信息");
        }
        //获取新版动态信息
        get_opus_dynamic_info();
        //设置forward变量为0，新版动态必无转发信息
        forward = 0;
        //设置dynamic_index变量为0，新版动态必非动态首页
        dynamic_index = 0;
        //设置space变量为false，新版动态必非个人空间--投稿/收藏--相薄途径打开
        space = false;
    } else {//如果是旧版动态
        //获取旧版动态信息
        get_dynamic_info();
    }
}
//由于页面刚打开无法立即获取页面链接，所以设置延迟1秒再获取动态信息，不过也会小概率发生页面链接的路径部分获取不到的情况，可以通过调整延迟时间来优化
setTimeout(judge_opus, 1000);

//个人空间跳转方法
function space_jump() {
    //判断是否存在评论锚点，如果存在则跳转时添加锚点信息
    if (replyID) {
        //在当前页面进行跳转
        window.location.href = "https://h.bilibili.com/" + dynamic_id + replyID;
    } else {
        //在当前页面进行跳转
        window.location.href = "https://h.bilibili.com/" + dynamic_id;
    }
}

//主跳转程序
function jump() {
    shop_panel = 0;//【手动控制包含相关作品/推荐信息/直播预约等额外信息时是否跳转，默认不跳转。需要跳转请取消本行的注释状态】
    //判断条件，1、不带有图片的动态 2、有转发信息的动态 3、动态列表首页 4、有相关作品信息的动态，这个4种动态页面不进行跳转，其他情况则进行跳转
    if (((imag > 0 && forward === 0) && dynamic_index === 0) && shop_panel === 0) {
        //判断条件，从用户个人空间--投稿/收藏--相薄中打开的动态直接跳转，其他情况则通过B站相关API接口查询后再跳转
        if (space) {
            //个人空间跳转
            space_jump();
        } else {
            //使用jQuery的ajax方法通过B站相关API接口获取与动态ID对应的数据
            $.ajax({
                type: 'GET',
                url: "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=" + dynamic_id,
                //设置发送请求时携带同源Cookies信息
                xhrFields: {
                    withCredentials: true
                },
                //得到成功响应后进行判断及跳转
                success: function (data) {
                    function normal_jump() {//正常跳转方法
                        //从返回的数据中获取"rid"的内容（一串数字），这串数字就是对应的相薄ID
                        let dynamic_desc_rid = data.data.card.desc.rid;
                        //判断是否存在评论锚点，如果存在则跳转时添加锚点信息
                        if (replyID) {
                            //在当前页面进行跳转
                            window.location.href = "https://h.bilibili.com/" + dynamic_desc_rid + replyID;
                        } else {
                            //在当前页面进行跳转
                            window.location.href = "https://h.bilibili.com/" + dynamic_desc_rid;
                        }
                    }

                    //如果报错则说明当前浏览器本地无B站Cookie信息，或B站Cookie中无有效登录信息，提示需要登录账号并退出程序
                    try {
                        //从返回的数据中获取"type"的内容，这是动态类型（例如包含转发信息的动态类型为1，仅带图动态类型为2，纯文字动态类型为4，专栏动态类型为64）
                        var dynamic_type = data.data.card.desc.type;
                    } catch (error) {
                        console.log("当前动态信息获取失败，请先登录！");
                        return;
                    }

                    //判断动态类型，如果动态类型为2（即为仅带图动态）则继续程序，否则退出
                    if (dynamic_type == 2) {
                        //如果报错则说明返回的数据中不存在“lott”内容，不包含B站官方抽奖功能
                        try {
                            //从返回的数据中获取"lott"的内容，然后判断是否含有“lottery_id”，有则为ture，没有则为false
                            var lottery_id = data.data.card.extension.lott.includes('lottery_id');

                            lottery_id = false;//【手动控制包含B站官方抽奖功能时是否跳转，默认不跳转。需要跳转请取消本行的注释状态】

                            //如果有则说明包含B站官方抽奖功能，相薄动态不支持抽奖，所以不进行跳转
                            if (lottery_id) {
                                return;
                            } else {
                                normal_jump();
                            };
                        } catch (error) {
                            //如果报错则说明返回的数据中不存在“text”内容，不包含B站官方稿件/直播预约功能
                            try {
                                //从返回的数据中获取"type"的内容，然后判断是否为“reserve”，是则为ture，不是则为false
                                var appointment = data.data.card.display.add_on_card_info[0].reserve_attach_card.type.includes('reserve');

                                appointment = false;//【手动控制包含B站官方稿件/直播预约功能时是否跳转，默认不跳转。需要跳转请取消本行的注释状态】

                                //如果有则说明包含B站官方稿件/直播预约功能，相薄动态不支持稿件预约，所以不进行跳转
                                if (appointment) {
                                    return;
                                } else {//如果不包含B站官方抽奖和稿件/直播预约功能但没有全部报错则进行跳转
                                    normal_jump();
                                }
                            } catch (error) {
                                //如果全部报错说明不包含B站官方抽奖和稿件/直播预约和投票功能，进行跳转
                                try {
                                    //从返回的数据中获取"vote_cfg"的内容，然后判断是否含有“vote_id”，有则为ture，没有则为false
                                    var vote_id = data.data.card.extension.vote_cfg.hasOwnProperty('vote_id');

                                    vote_id = false;//【手动控制包含B站官方投票功能时是否跳转，默认不跳转。需要跳转请取消本行的注释状态】

                                    //如果有则说明包含B站官方投票功能，相薄动态不支持投票，所以不进行跳转
                                    if (vote_id) {
                                        return;
                                    } else {
                                        normal_jump();
                                    };
                                } catch (error) {
                                    normal_jump();
                                }
                            }
                        }
                    } else {
                        return;
                    }
                }
            })
        }
    } else {
        return;
    }
}
//为配合动态信息获取设置延迟1.1秒再执行主程序
setTimeout(jump, 1100);