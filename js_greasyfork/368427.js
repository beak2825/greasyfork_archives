// ==UserScript==
// @name         花瓣网下载
// @namespace    https://www.saintic.com/
// @version      1.4.1
// @description  花瓣网(huaban.com)用户画板图片批量下载到本地
// @author       staugur
// @match        http*://huaban.com/boards/*
// @match        http*://huaban.com/user/*
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_download
// @icon         https://static.saintic.com/cdn/images/favicon-64.png
// @license      BSD 3-Clause License
// @date         2018-05-25
// @modified     2025-11-25
// @github       https://github.com/staugur/grab_huaban_board/blob/master/grab_huaban_board.js
// @supportURL   https://blog.saintic.com/blog/256.html
// @downloadURL https://update.greasyfork.org/scripts/368427/%E8%8A%B1%E7%93%A3%E7%BD%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/368427/%E8%8A%B1%E7%93%A3%E7%BD%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //字符串是否包含子串
    function isContains(str, substr) {
        //str是否包含substr
        return str.indexOf(substr) >= 0;
    }
    //数组是否包含某元素
    function arrayContains(arr, obj) {
        let i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
    //判断页面中id是否存在
    function hasId(id) {
        //有此id返回true，否则返回false
        let element = document.getElementById(id);
        if (element) {
            return true;
        } else {
            return false;
        }
    }
    //获取url查询参数
    function getUrlQuery(key, acq) {
        /*
            获取URL中?之后的查询参数，不包含锚部分，比如url为http://passport.saintic.com/user/message/?status=1&Action=getCount
            若无查询的key，则返回整个查询参数对象，即返回{status: "1", Action: "getCount"}；
            若有查询的key，则返回对象值，返回值可以指定默认值acq：如key=status, 返回1；key=test返回acq
        */
        let str = location.search;
        let obj = {};
        if (str) {
            str = str.substring(1, str.length);
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            let arr = str.split('&');
            //let obj = new Object();
            // 将每一个数组元素以=分隔并赋给obj对象
            for (let i = 0; i < arr.length; i++) {
                let tmp_arr = arr[i].split('=');
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
        }
        return key ? obj[key] || acq : obj;
    }
    //计算百分比
    function calculatePercentage(num, total) {
        //小数点后两位百分比
        return Math.round((num / total) * 10000) / 100.0 + '%';
    }
    //加载css文件
    function addCSS(href) {
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = href;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    //加载js文件
    function addJS(src, cb) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = typeof cb === 'function' ? cb : function () {};
    }
    //时间戳转化为日期格式
    function formatUnixtimestamp(ts) {
        let unixtimestamp = new Date(ts * 1000);
        let year = 1900 + unixtimestamp.getYear();
        let month = '0' + (unixtimestamp.getMonth() + 1);
        let date = '0' + unixtimestamp.getDate();
        let hour = '0' + unixtimestamp.getHours();
        let minute = '0' + unixtimestamp.getMinutes();
        let second = '0' + unixtimestamp.getSeconds();
        return (
            year +
            '-' +
            month.substring(month.length - 2, month.length) +
            '-' +
            date.substring(date.length - 2, date.length) +
            ' ' +
            hour.substring(hour.length - 2, hour.length) +
            ':' +
            minute.substring(minute.length - 2, minute.length)
        );
    }
    //封装localStorage
    class StorageMix {
        constructor(key) {
            this.key = key;
            this.obj = window.localStorage;
            if (!this.obj) {
                console.error('浏览不支持localStorage');
                return false;
            }
        }

        //设置或跟新本地存储数据
        set(data) {
            if (data) {
                return this.obj.setItem(this.key, JSON.stringify(data));
            }
        }

        //获取本地存储数据
        get() {
            let data = null;
            try {
                data = JSON.parse(this.obj.getItem(this.key));
            } catch (e) {
                console.error(e);
            } finally {
                return data;
            }
        }

        clear() {
            //清除对象
            return this.obj.removeItem(this.key);
        }
    }
    //显示条款
    function showTerms(cb, onlyShow = false) {
        let s = new StorageMix('userTermsVer');
        if (s.get() !== 'yes') {
            let html = [
                '<blockquote style="padding:10px;border-left:5px solid #009688;border-radius:0 2px 2px 0;background-color:#f2f2f2;margin-bottom:10px;">',
                '本使用条款及免责声明（以下简称“本声明”）适用于',
                '所有用户脚本（以下简称“此脚本”），',
                '在您阅读本声明后若不同意此声明中的任何条款，',
                '或对本声明存在质疑，请立刻停止使用此脚本。',
                '若您已经开始或正在使用此脚本，则表示您已阅读并同意本声明的所有条款。',
                '</blockquote>',
                '<p style="color:red">总则：使用过程中请遵守所在国家或地区的相关法律法规。</p>',
                '<p>1. 此脚本使用localStorage存储公告、阅读条款状态等，不使用cookie技术。</p>',
                '<p>2. 此脚本不记录除远程方式外的下载情况，第三方Tdi下载与此脚本和作者无关。</p>',
                '<p>3. 此脚本使用BSD 3-Clause许可证开源，请遵循许可协议条款。</p>',
                '<p>4. 此脚本请个人使用，勿用于商业用途！</p>',
                '<p>5. 用户使用此脚本导致的版权、知识产权、所在网站本身侵权，此脚本作者概不负责！</p>',
                '<p>6. 用户须自己承担使用此脚本访问网站的风险，',
                '并承担为此而造成的风险责任，与作者本人及相关服务无关！</p>',
                '<p>7. 本声明可随时修改条款，如有变更通过公告发布，声明立时生效。</p>',
            ].join('');
            layer.open({
                type: 1,
                title: '使用条款与免责声明',
                closeBtn: false,
                area: '550px',
                shade: 0.7,
                shadeClose: false,
                id: 'userTerm', //设定一个id，防止重复弹出
                btn: onlyShow !== true ? ['我同意', '我不同意'] : ['关闭'],
                btnAlign: 'c',
                scrollbar: false,
                content: '<div style="padding: 20px; line-height: 20px;">' + html + '</div>',
                zIndex: layer.zIndex,
                success: function (layero) {
                    layer.setTop(layero);
                },
                yes: function (index, layero) {
                    layer.close(index);
                    if (onlyShow !== true) {
                        s.set('yes');
                        typeof cb === 'function' && cb();
                    }
                },
            });
        } else {
            if (onlyShow !== true) {
                typeof cb === 'function' && cb();
            }
        }
    }
    //由于@require方式引入jquery时layer使用异常，故引用cdn中jquery v1.10.1；加载完成后引用又拍云中layer v3.5.1
    addJS('https://static.saintic.com/cdn/jquery/1.10.1/jquery.min.js', function () {
        $.noConflict();
        addJS('https://static.saintic.com/cdn/layer/3.5.1/layer.js');
    });
    //当前URL
    var initUrl = window.location.href;
    //加载优化
    var loadingLayer = null;
    //正则
    var isEmail = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/i;
    var isMobile = /^1\d{10}$/i;
    var space = '&nbsp;&nbsp;&nbsp;&nbsp;';
    // 设置提醒弹框
    function setupRemind() {
        let email = getReceiveBy('email') || '',
            mobile = getReceiveBy('mobile') || '',
            token = getReceiveBy('token') || '';
        let content_overview = [
            '<div style="padding: 20px; line-height: 22px; font-weight: 300;">',
            '<h4><b>提醒设置：</b></h4>',
            '<div style="margin-left: 10px;">',
            '<p>仅供提交远程下载后查询下载进度、发送下载完成消息。</p>',
            `<p><form><a id="save_remind_email" class="submit-btn btn rbtn" href="javascript:;">保存邮箱</a> <input style="display:inline-block;height:28px;color:#777;background:#fcfcfc;border:1px solid #CCC" id="set_remind_email" type="text" placeholder="邮箱" value="${email}"></form></p>`,
            `<p><form><a id="save_remind_mobile" class="submit-btn btn rbtn" href="javascript:;">保存手机</a> <input style="display:inline-block;height:28px;color:#777;background:#fcfcfc;border:1px solid #CCC" id="set_remind_mobile" type="text" placeholder="手机号" value="${mobile}"></form></p>`,
            `<p><form><a id="save_remind_token" class="submit-btn btn rbtn" href="javascript:;">保存密钥</a> <input style="display:inline-block;height:28px;color:#777;background:#fcfcfc;border:1px solid #CCC" id="set_remind_token" type="text" placeholder="诏预开放平台密钥" value="${token}"></form></p>`,
            `<p>微信扫描下发公众号，发送"@下载链接"即可查询状态。</p>`,
            '<p><img src="https://static.saintic.com/cdn/images/gongzhonghao.jpg" width="150px" title="订阅消息二维码"></p>',
            '</div>',
            '<h4><b>服务公告：</b></h4>',
            `<p>${space}<a id="reset_notice_status" href="javascript:;">点击重置状态</a>：将已读公告标记为未读，下次请求会重新展示公告。</p>`,
            `<p>${space}<a id="reshow_notice" href="javascript:;">重新阅读公告</a>：手动查看花瓣网公告。</p>`,
            '<h4><b>问题帮助：</b></h4>',
            `<p>${space}<a href="javascript:;" id="grab_setting_help" title="查看帮助说明">查看FAQ</a>：关于设置方面的问题说明，亦可阅读<a href="https://docs.saintic.com/open/control.html" target="_blank">详细文档</a>！</p>`,
            `<p>${space}<a href="https://github.com/staugur/userscript/issues/new?assignees=&labels=&template=your-issue-topic.md&title=%E8%8A%B1%E7%93%A3%E7%BD%91%E8%84%9A%E6%9C%AC%E5%8F%8D%E9%A6%88" target="_blank">在线反馈。</a></p>`,
            '<h4><b>捐赠支持：</b></h4>',
            `<p>${space}如果您觉得此脚本对您有所裨益，您可以<a href="javascript:;" id="grab_setting_donation">点此捐赠</a>！</p>`,
            '<h4><b><a href="javascript:;" id="reshow_userterms">查看使用条款与免责声明。</a></b></h4>',
            '</div>',
        ].join('');
        let content_help = [
            '<div style="padding: 10px;">',
            '<p><b>1. 什么是密钥？</b><br>&nbsp;&nbsp;答：密钥是在您在诏预开放平台创建的<i>Api Token</i>，与用户一一对应，拥有它可以访问平台公共接口、处理您账号的相关事务等，此处仅作为您使用此脚本查询远端下载记录，以便及时下载完成的压缩包，省去了复制下载链接等步骤。切记密钥不可泄露，否则可能造成账号风险！</p>',
            '<p><b>2. 怎么创建密钥？</b><br>&nbsp;&nbsp;答：请登录开放平台：<a href="https://open.saintic.com/control/" target="_blank">https://open.saintic.com</a>，在控制台处可以创建密钥（您可以使用QQ/微博/码云/GitHub等快捷登录）！</p>',
            '<p><b>3. 微信怎么查询下载进度？</b><br>&nbsp;&nbsp;答：请使用微信APP扫描此二维码并关注，发送"@下载链接"即可，服务器会返回下载状态。</p>',
            '</div>',
        ].join('');
        let donation_content = [
            '<div style="padding:10px;text-align:center;vertical-align:middle;">',
            '<p>支付宝：</p>',
            '<p><img src="https://static.saintic.com/cdn/images/donation-alipay.jpg" height="200px"></p>',
            '<p>微信：</p>',
            '<p><img src="https://static.saintic.com/cdn/images/donation-wechat.png" height="200px"></p>',
            '</div>',
        ].join('');
        layer.open({
            type: 1,
            area: ['500px', '500px'],
            maxmin: true,
            resize: true,
            closeBtn: false,
            shade: 0,
            title: '花瓣网下载脚本功能设置',
            btn: ['关闭'],
            btnAlign: 'c',
            moveType: 1, //拖拽模式，0或者1
            content: content_overview,
            success: function (layero, index) {
                let body = layer.getChildFrame('body', index);
                body.context.getElementById('save_remind_email').onclick = function () {
                    let value = body.context.getElementById('set_remind_email').value;
                    if (value && !isEmail.test(value)) {
                        layer.msg('请输入正确的邮箱地址');
                        return;
                    }
                    setupReceiveTo('email', value);
                };
                body.context.getElementById('save_remind_mobile').onclick = function () {
                    let value = body.context.getElementById('set_remind_mobile').value;
                    if (value && !isMobile.test(value)) {
                        layer.msg('请输入正确的手机号');
                        return;
                    }
                    setupReceiveTo('mobile', value);
                };
                body.context.getElementById('save_remind_token').onclick = function () {
                    let value = body.context.getElementById('set_remind_token').value;
                    setupReceiveTo('token', value);
                };
                body.context.getElementById('reset_notice_status').onclick = function () {
                    let storage = new StorageMix('grab_huaban_board');
                    storage.clear();
                    layer.msg('重置成功', {
                        icon: 1,
                    });
                };
                body.context.getElementById('reshow_notice').onclick = function () {
                    let storage = new StorageMix('grab_huaban_board');
                    storage.clear();
                    showNotice();
                };
                body.context.getElementById('grab_setting_help').onclick = function () {
                    layer.open({
                        type: 1,
                        area: '460px',
                        title: 'FAQ',
                        content: content_help,
                        closeBtn: false,
                        shadeClose: false,
                        shade: 0,
                        btn: '我知道了',
                        btnAlign: 'c',
                        zIndex: layer.zIndex,
                        success: function (layero) {
                            layer.setTop(layero);
                        },
                        yes: function (index, layero) {
                            layer.close(index);
                        },
                    });
                };
                body.context.getElementById('grab_setting_donation').onclick = function () {
                    layer.open({
                        type: 1,
                        shade: 0,
                        area: '300px',
                        title: '捐赠支持',
                        closeBtn: false,
                        shadeClose: false,
                        btn: '关闭',
                        btnAlign: 'c',
                        content: donation_content,
                        success: function (layero) {
                            /*
                                layero[0].querySelector(
                                    '.layui-layer-title'
                                ).style.padding = '0px'
                                */
                        },
                    });
                };
                body.context.getElementById('reshow_userterms').onclick = function () {
                    let s = new StorageMix('userTermsVer');
                    s.clear();
                    showTerms(null, true);
                };
            },
        });
    }
    /**
     * 设置接收信息
     * @param type 参数: mobile|email|token
     */
    function setupReceiveTo(type, value) {
        let es = new StorageMix('grab_huaban_board_remind_email');
        let ms = new StorageMix('grab_huaban_board_remind_mobile');
        let ts = new StorageMix('grab_huaban_board_token');
        if (type === 'email') {
            if (value) {
                if (!isEmail.test(value)) {
                    layer.msg('请输入正确的邮箱地址');
                    return;
                }
                es.set(value);
                layer.msg('邮箱：' + value + '，设置成功！', {
                    icon: 1,
                });
            } else {
                es.clear();
                layer.msg('邮箱已清空！', {
                    icon: 1,
                });
            }
        } else if (type === 'mobile') {
            if (value) {
                if (!isMobile.test(value)) {
                    layer.msg('请输入正确的手机号');
                    return;
                }
                ms.set(value);
                layer.msg('手机号：' + value + '，设置成功！', {
                    icon: 1,
                });
            } else {
                ms.clear();
                layer.msg('手机号已清空！', {
                    icon: 1,
                });
            }
        } else if (type === 'token') {
            if (!value) {
                ts.clear();
                layer.msg('密钥已清空！', {
                    icon: 1,
                });
            } else {
                ts.set(value);
                layer.msg('密钥：' + value + '，设置成功！', {
                    icon: 1,
                });
            }
        } else {
            layer.msg('暂不支持此方式！');
            return;
        }
    }
    /**
     * 读取接收信息值
     * @param type 参数: mobile|email|token
     */
    function getReceiveBy(type) {
        let str = '',
            es = new StorageMix('grab_huaban_board_remind_email'),
            ms = new StorageMix('grab_huaban_board_remind_mobile'),
            ts = new StorageMix('grab_huaban_board_token');
        if (type === 'email') {
            str = es.get();
        } else if (type === 'mobile') {
            str = ms.get();
        } else if (type === 'token') {
            str = ts.get();
        }
        return str || '';
    }
    /**
     * 交互确定画板下载方式
     * @param {int} board_id: 画板id
     * @param {list} pins: 包含所有程序加载到的图片数据
     * @param {int} pin_number: 这个画板总共有多少图片
     * @param {str} user_id: 这个画板所属的用户
     */
    function interactiveBoard(board_id, pins, pin_number, user_id) {
        layer.close(loadingLayer);
        let downloadMethod = 0,
            msg = [
                '<div style="padding: 20px;">',
                `<b>当前画板共 ${pin_number} 张图片，抓取了 ${pins.length} 张，`,
                `抓取率：${calculatePercentage(pins.length, pin_number)}！</b>`,
                `<small>提示: 只有登录后才可以抓取几乎所有图片哦。</small><br/>`,
                '<b>请选择以下三种下载方式：</b><br/>',
                `1. <i>文本</i>： <br/>${space}即所有图片地址按行显示，提供复制，粘贴至下载工具批量下载即可(或<a href="https://static.saintic.com/download/python-gui/gui_batchdownload.exe" target="_blank">这个工具</a>)，推荐使用此方式。<br/>`,
                `2. <i>本地</i>： <br/>${space}即所有图片直接保存到硬盘中，由于是批量下载，所以浏览器设置中请关闭"下载前询问每个文件的保存位置"，并且允许浏览器下载多个文件的授权申请，以保证可以自动批量保存，否则每次保存时会弹出询问，对您造成困扰。<br/>`,
                `3. <i>远程</i>： <br/>${space}即所有图片将由远端服务器下载并压缩，提供压缩文件链接，直接下载此链接解压即可。<br/>`,
                '<br/><p><b>寻求帮助？</b><a href="https://blog.saintic.com/blog/256.html" target="_blank" title="FAQ、彩蛋、文档等" style="color: green;">请点击我！</a></p></div>',
            ].join('');
        layer.open({
            type: 1,
            area: '450px',
            title: '选择画板图片下载方式',
            content: msg,
            closeBtn: false,
            shadeClose: false,
            shade: 0,
            btn: ['文本', '本地', '远程'],
            btnAlign: 'c',
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            },
            yes: function (index, layero) {
                //文本方式下载，比如迅雷、QQ旋风
                downloadMethod = 1;
                layer.close(index);
                layer.open({
                    type: 1,
                    title: '文本方式下载',
                    area: '360px',
                    content: '<div style="padding: 20px;"><b>请点击复制按钮，粘贴到迅雷等工具中下载！</b></div>',
                    closeBtn: false,
                    shadeClose: false,
                    shade: 0,
                    btn: '复制',
                    btnAlign: 'c',
                    maxmin: true,
                    zIndex: layer.zIndex,
                    success: function (layero) {
                        layer.setTop(layero);
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                        GM_setClipboard(
                            pins
                                .map(function (pin) {
                                    return pin.imgUrl + '\n';
                                })
                                .join('')
                        );
                        layer.msg('复制成功', {
                            icon: 1,
                        });
                    },
                });
            },
            btn2: function (index, layero) {
                //本地下载
                downloadMethod = 2;
                layer.close(index);
                pins.map(function (pin) {
                    GM_download(pin.imgUrl, pin.imgName);
                });
            },
            btn3: function (index, layero) {
                //远端下载
                downloadMethod = 3;
                layer.close(index);
                // 提醒接收配置信息读取
                let email = getUrlQuery('email', getReceiveBy('email'));
                let mobile = getUrlQuery('sms', getReceiveBy('mobile'));
                jQuery.ajax({
                    url: 'https://open.saintic.com/CrawlHuaban/',
                    type: 'POST',
                    data: {
                        site: 1,
                        version: GM_info.script.version,
                        board_total: pin_number,
                        board_id: board_id,
                        user_id: user_id,
                        pins: JSON.stringify(pins),
                        email: email,
                        sms: mobile,
                    },
                    beforeSend: function (request) {
                        request.setRequestHeader('Authorization', 'Token ' + getReceiveBy('token'));
                    },
                    success: function (res) {
                        if (res.success === true) {
                            let msg = [
                                '<div style="padding: 20px;"><b>下载任务已经提交！</b><br>根据画板图片数量，所需时间不等，',
                                `请稍等数分钟后访问下载链接：<br><i><a href="${res.downloadUrl}" target="_blank">`,
                                `${res.downloadUrl}</a></i><br>它将于<b>${res.expireTime}</b>过期，那时资源会被删除，请提前下载。`,
                                `${res.tip}</div>`,
                            ].join('');
                            layer.open({
                                type: 1,
                                title: '温馨提示',
                                content: msg,
                                closeBtn: false,
                                shadeClose: false,
                                shade: 0,
                                area: '350px',
                                btn: '我已知晓并复制下载链接',
                                btnAlign: 'c',
                                maxmin: true,
                                zIndex: layer.zIndex,
                                success: function (layero) {
                                    layer.setTop(layero);
                                },
                                yes: function (index, layero) {
                                    layer.close(index);
                                    GM_setClipboard(res.downloadUrl);
                                    let tips = '复制成功！';
                                    if (email) {
                                        tips += ' 接收提醒邮箱:' + email;
                                    }
                                    if (mobile) {
                                        tips += ' 接收提醒手机:' + mobile;
                                    }
                                    layer.msg(tips, {
                                        icon: 1,
                                    });
                                },
                            });
                        } else {
                            layer.msg('远端服务提示: ' + res.msg, {
                                icon: 2,
                                time: 8000,
                            });
                        }
                    },
                });
            },
        });
    }
    //交互确定用户下载方式
    function interactiveUser(user_id, boards, board_number) {
        boards.map(function (board_id) {
            let msg = [
                `<div style="padding: 20px;"><b>当前画板是：${board_id}</b>！`,
                '<small>提示: 只有登录后才可以抓取几乎所有画板哦。</small><br/>',
                '<b>请选择以下两种功能按钮：</b><br/>',
                `1. <i>开始下载</i>： <br/>${space}点击此按钮将开始抓取画板图片，抓取完成后弹出下载方式，请选择某种方式后完成当前画板下载。<br/>`,
                `2. <i>跳过</i>： <br/>${space}即忽略此画板，并关闭本窗口。<br/>`,
                '<br/><p><b>请注意：</b>用户存在多个画板时会弹出多个窗口，请移动或最小化当前窗口以显示其他窗口。</p>',
                '<br/><p><b>寻求帮助？</b><a href="https://blog.saintic.com/blog/256.html" target="_blank" title="FAQ、彩蛋、文档等" style="color: green;">请点击我！</a></p></div>',
            ].join('');
            layer.open({
                type: 1,
                area: '450px',
                title: `花瓣网用户抓取：${user_id}`,
                content: msg,
                closeBtn: false,
                shadeClose: false,
                shade: 0,
                btn: ['开始下载', '跳过'],
                btnAlign: 'c',
                maxmin: true,
                zIndex: layer.zIndex,
                success: function (layero) {
                    layer.setTop(layero);
                },
                yes: function (index, layero) {
                    //按钮【开始下载】的回调
                    layer.close(index);
                    downloadBoard(board_id);
                },
                btn2: function (index, layero) {
                    //按钮【跳过】的回调
                    layer.close(index);
                },
            });
        });
        let content = [
            '<div style="padding: 20px;">',
            `<b>当前用户画板数量总共为 ${board_number}，抓取了 ${boards.length} 个，`,
            `抓取率：${calculatePercentage(boards.length, board_number)}！</b><br/>`,
            '<b>寻求帮助？Bug反馈？</b><a href="https://blog.saintic.com/blog/256.html" target="_blank" title="帮助文档" style="color: green;">请点击我！</a>',
            '</div>',
        ].join('');
        layer.open({
            type: 1,
            title: '温馨提示',
            content: content,
            closeBtn: false,
            shadeClose: false,
            shade: 0,
            btn: '我已知晓',
            btnAlign: 'c',
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            },
            yes: function (index, layero) {
                //按钮【我已知晓】的回调
                layer.close(index);
            },
        });
    }
    //画板解析与下载
    function downloadBoard(board_id) {
        if (!board_id) {
            console.error('画板ID不能为空！');
            return false;
        }
        console.group('花瓣网下载-当前画板：' + board_id);
        let limit = 100,
            loadingLayer = layer.load(0, {
                time: 5000,
            });
        //get first pin data
        jQuery.ajax({
            url: `/v3/boards/${board_id}/pins?limit=${limit}&sort=seq&fields=pins:PIN|board:BOARD_DETAIL|check`,
            async: false,
            success: function (res) {
                try {
                    console.log(res);
                    if (res.hasOwnProperty('board') === true) {
                        let board_data = res.board,
                            board_pins = res.pins;
                        //画板图片总数
                        let pin_number = board_data.pin_count,
                            user_id = board_data.user.urlname,
                            //尝试向上取整，计算加载完画板图片需要的最大次数
                            retry = board_pins.length < pin_number ? Math.ceil(pin_number / limit) : 0;
                        console.debug(
                            `Current board ${board_id} pins number is ${pin_number}, first pins number is ${board_pins.length}, retry is ${retry}`
                        );
                        let bf = setInterval(function () {
                            if (retry > 0) {
                                //说明没有加载完画板图片，需要ajax请求
                                let last_pin = board_pins[board_pins.length - 1].pin_id;
                                //get ajax pin data
                                let board_next_url = `/v3/boards/${board_id}/pins?limit=${limit}&sort=seq&fields=pins:PIN|board:BOARD_DETAIL|check&max=${last_pin}`;
                                jQuery.ajax({
                                    url: board_next_url,
                                    async: false,
                                    success: function (res) {
                                        //console.log(res);
                                        let _pin_data = res.pins;
                                        board_pins = board_pins.concat(_pin_data);
                                        console.debug(
                                            `ajax load board with pin_id ${last_pin}, get pins number is ${_pin_data.length}, merged.`
                                        );
                                        if (_pin_data.length === 0) {
                                            retry = 0;
                                            return false;
                                        }
                                        last_pin = _pin_data[_pin_data.length - 1].pin_id;
                                    },
                                });
                                retry--;
                            } else {
                                console.log(`画板 ${board_id} 共抓取 ${board_pins.length} 个pin`);
                                let pins = board_pins.map(function (pin) {
                                    let suffix = !pin.file.type ? 'png' : pin.file.type.split('/')[1];
                                    return {
                                        imgUrl: window.location.protocol + '//hbimg.huabanimg.com/' + pin.file.key,
                                        imgName: pin.pin_id + '.' + suffix,
                                    };
                                });
                                //交互确定下载方式
                                interactiveBoard(board_id, pins, pin_number, user_id);
                                clearInterval(bf);
                            }
                        }, 200);
                    }
                } catch (e) {
                    console.error('下载画板发生错误：');
                    console.error(e);
                }
            },
        });
        console.groupEnd();
    }
    //用户解析与下载
    function downloadUser(user_id) {
        if (!user_id) {
            console.error('用户ID不能为空！');
            return false;
        }
        console.group('花瓣网下载-当前用户：' + user_id);
        let limit = 10;
        //get first board data
        jQuery.ajax({
            url: `/v3/${user_id}/boards?limit=${limit}&fields=boards:BOARD|user,total,page_num,page_size&joined=1&urlname=${user_id}`,
            async: false,
            success: function (res) {
                try {
                    //console.log(res);
                    if (res.hasOwnProperty('user') === true) {
                        let user_data = res.user,
                            board_number = user_data.board_count,
                            board_ids = res.boards,
                            retry = board_ids.length < board_number ? Math.ceil(board_number / limit) : 0;
                        console.debug(
                            `Current user ${user_id} boards number is ${board_number}, first boards number is ${board_ids.length}, retry is ${retry}`
                        );
                        let uf = setInterval(function () {
                            if (retry > 0) {
                                let last_board = board_ids[board_ids.length - 1].board_id;
                                //get ajax board data
                                let user_next_url = `/v3/${user_id}/boards?max=${last_board}&limit=${limit}&fields=boards:BOARD|user,total,page_num,page_size&joined=1&urlname=${user_id}&&wfl=1`;
                                jQuery.ajax({
                                    url: user_next_url,
                                    async: false,
                                    success: function (res) {
                                        //console.log(res);
                                        let user_next_data = res.boards;
                                        board_ids = board_ids.concat(user_next_data);
                                        console.debug(
                                            `ajax load user with board_id ${last_board}, get boards number is ${user_next_data.length}, merged`
                                        );
                                        if (user_next_data.length === 0) {
                                            retry = 0;
                                            return false;
                                        }
                                        last_board = user_next_data[user_next_data.length - 1].board_id;
                                    },
                                });
                                retry--;
                            } else {
                                console.log(`用户 ${user_id} 共抓取 ${board_ids.length} 个board`);
                                let boards = board_ids
                                    .filter(function (board) {
                                        if (board.pin_count > 0) {
                                            return true;
                                        }
                                    })
                                    .map(function (board) {
                                        return board.board_id;
                                    });
                                //交互确定下载方式
                                interactiveUser(user_id, boards, board_number);
                                clearInterval(uf);
                            }
                        }, 200);
                    }
                } catch (e) {
                    console.error(e);
                }
            },
        });
        console.groupEnd();
    }
    //获取公告接口
    function showNotice() {
        jQuery.ajax({
            url: 'https://open.saintic.com/CrawlHuaban/notice?catalog=2',
            type: 'GET',
            success: function (res) {
                if (res.code === 0) {
                    let notices = res.data;
                    if (notices.length > 0) {
                        let storage = new StorageMix('grab_huaban_board');
                        let localIds = storage.get() || [];
                        let html = '';
                        notices.map(function (notice) {
                            //notice{id, ctime, content}
                            if (!arrayContains(localIds, notice.id) === true) {
                                localIds.push(notice.id);
                                html +=
                                    '<p><b><i>@' +
                                    formatUnixtimestamp(notice.ctime) +
                                    '</i></b> 【 ' +
                                    notice.content +
                                    ' 】</p>';
                            }
                        });
                        storage.set(localIds);
                        if (!html) {
                            return false;
                        }
                        layer.open({
                            type: 1,
                            title: '诏预开放平台公告',
                            closeBtn: false,
                            area: '550px',
                            shade: 0,
                            id: 'grab_huaban_board', //设定一个id，防止重复弹出
                            resize: true,
                            maxmin: true,
                            btn: ['我知道了'],
                            btnAlign: 'c',
                            moveType: 1, //拖拽模式，0或者1
                            content: [
                                '<div style="padding: 20px; line-height: 22px; font-weight: 300;">',
                                html,
                                '</div>',
                            ].join(''),
                            success: function (layero) {
                                layer.setTop(layero);
                            },
                            yes: function (index, layero) {
                                layer.close(index);
                            },
                        });
                    }
                }
            },
        });
    }
    /**
     * 主入口，分出不同模块：用户、画板，监听并刷新URL
     *
     */
    function main() {
        let dl_text = '下载',
            setup_text = '设置',
            pathnames = window.location.pathname.split('/');
        if (pathnames[1] === 'boards') {
            //当前在画板地址下
            let board_id = pathnames[2];
            //当前是PC版
            let pab = document.querySelectorAll(`button[data-button-name="分享"][data-board-id="${board_id}"]`)[1];
            //插入下载画板按钮
            if (pab) {
                let tmpHtml = [
                    `<button id="setupRemind" data-gd-click="button_click" data-button-name="设置" type="button" class="ant-btn ant-btn-text ant-btn-round ant-dropdown-trigger" data-board-id="${board_id}">${setup_text}</button>`,
                    `<button id="downloadBoard" data-gd-click="button_click" data-button-name="下载" type="button" class="ant-btn ant-btn-text ant-btn-round ant-dropdown-trigger" data-board-id="${board_id}">${dl_text}</button>`,
                ].join('');
                pab.insertAdjacentHTML('beforebegin', tmpHtml);
            } else {
                console.error('未找到分享按钮，无法插入下载按钮！');
            }
            //监听画板点击下载事件
            document.getElementById('downloadBoard').onclick = function () {
                showTerms(function () {
                    //展示公告
                    showNotice();
                    downloadBoard(board_id);
                });
            };
        } else if (pathnames[1] === 'user') {
            //判断是在用户主页
            let user_id = pathnames[2],
                exclude_path = [
                    'all',
                    'discovery',
                    'favorite',
                    'categories',
                    'apps',
                    'about',
                    'search',
                    'activities',
                    'settings',
                    'users',
                    'friends',
                    'partner',
                    'message',
                    'muse',
                    'login',
                    'signup',
                    'go',
                    'explore',
                ];
            if (arrayContains(exclude_path, user_id) === false) {
                //排除以上数组中的二级目录
                //当前是PC版
                let uca = document.querySelectorAll('button[data-button-name="分享"]')[0];
                //插入下载用户画板按钮
                if (uca) {
                    let tmpHtml = [
                        `<button id="setupRemind" data-gd-click="button_click" data-button-name="设置" type="button" class="ant-btn ant-btn-text ant-btn-round ant-dropdown-trigger">${setup_text}</button>`,
                        `<button id="downloadUser" data-gd-click="button_click" data-button-name="下载" type="button" class="ant-btn ant-btn-text ant-btn-round ant-dropdown-trigger">${dl_text}</button>`,
                    ].join('');
                    uca.insertAdjacentHTML('beforebegin', tmpHtml);
                } else {
                    console.error('未找到分享按钮，无法插入下载按钮！');
                }
                //监听用户点击下载事件
                document.getElementById('downloadUser').onclick = function () {
                    showTerms(function () {
                        //展示公告
                        showNotice();
                        downloadUser(user_id);
                    });
                };
            }
        }
        // check download button exist
        if (hasId('downloadBoard') === false && hasId('downloadUser') === false) {
            console.error('未插入下载按钮，脚本终止运行！');
            return;
        }
        // 监听设置提醒按钮
        document.getElementById('setupRemind').onclick = function () {
            setupRemind();
        };
        //采用循环方式判断url变化
        setInterval(function () {
            if (window.location.href != initUrl) {
                if (hasId('downloadBoard') === false && hasId('downloadUser') === false) {
                    if (window.location.pathname.split('/')[1] != 'pins') {
                        window.location.reload();
                    }
                }
            }
        }, 1000);
    }
    // 延迟加载入口
    window.onload = function () {
        setTimeout(function () {
            main();
        }, 2000);
    };
})();
