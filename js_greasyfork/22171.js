// ==UserScript==
// @name         NotSwtForcedChat
// @name:zh-cn   禁止商务通强制对话
// @description  主动屏蔽忠仕网站商务通的强制对话,但不影响商务通的加载与统计,打开页面自动提示自己人,强制对话强制拒绝.
// @namespace    http://www.qs5.org/?NotSwtForcedChat
// @version      0.1.8
// @author       ImDong
// @include      http://*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22171/NotSwtForcedChat.user.js
// @updateURL https://update.greasyfork.org/scripts/22171/NotSwtForcedChat.meta.js
// ==/UserScript==

(function(window) {
    window.BsNotSwt = {};  // 注册全局对象

    // 获取定义的自己的名字
    BsNotSwt.userName = GM_getValue('userName', false);

    // 如果未定义自己的名字则提示定义
    if(!BsNotSwt.userName) {
        alert("《禁止商务通强制对话》\n\n首次使用，请先设置自己的名字。");
        setUserName(true);
    }
    console.log('[UserScript:BsNotSwt] ' + BsNotSwt.userName + " / 修改名字请执行 BsNotSwt_setUserName();");

    // 自己公司的商务通ID列表
    BsNotSwt.isSwtList = [
        'COM38872093', // 口岸
        'COM39003278', // 深科
        'COM40157565', // 友谊
        'COM46040293', // 百合
        'COM53390611', // 未知
        'COM53821142', // 胃思宝
        'LDF31671888', // 交通
        'LEF11806507', // 圳康
        'LEF20952069', // 岭南妇科
        'LEF21469130', // 仁德
        'LEF39238750', // 博仕
        'LEF39558855', // 九洲
        'LEF40845115', // 九州男科
        'LEF42294496', // 霄边
        'LEF47269960', // 济生
        'LEF50886118', // 民生
        'LEF60856177', // 东湖
        'LEF67775286', // 台兴
        'LEF91003721', // 九龙
        'LEF92880883', // 华南
        'LEF93611084', // 银梁
        'LTY39120666', // 科大
        'LSK22220101', // 深科
        'LKT82939119', // 双流航都
        'LWS36120222', // 胃思宝
        'PRT37254025', // 无记录
        'PRT40095004', // 石狮九州 打不开
        'PCT99461422', // 岭南男科
        'SWT39756713', // 国境口岸
        'LEF33907315'  // 调试出来的
    ];

    // 生成一个表情 163 为鲜花
    BsNotSwt.getFace = function(id) {
        return '<img src="http://ctc.qzonestyle.gtimg.cn/qzone/em/e'+id+'.gif"/>';
    };

    // 获取当前时间
    BsNotSwt.getDate = function() {
        var myDate = new Date(), retDate = '';
        retDate+= myDate.getFullYear() + '/';
        retDate+= myDate.getMonth() + '/';
        retDate+= myDate.getDate() + ' ';
        retDate+= myDate.getHours() + ':';
        retDate+= myDate.getMinutes() + ':';
        retDate+= myDate.getSeconds();
        return retDate;
    };

    // 创建覆盖函数
    BsNotSwt.openZoosUrl = function(ot) {
        console.log('[UserScript:BsNotSwt] 收到对话邀请', ot);

        if(ot != 3 && 'fchatwin' != ot)
            return BsNotSwt.openZoosUrl_bak(ot);

        // 根据是否自己公司选择回复语句
        var sendStr = '[' + BsNotSwt.getDate() + '] ';
        sendStr+= BsNotSwt.isSwtList.indexOf(LR_websiteid) >= 0 ? BsNotSwt.userName + ' 拒绝了您的本次邀请(可接受 直接对话 / 快速邀请)' : '该用户残忍的拒绝了您的对话邀请';

        BsNotSwt.SendIdentit(sendStr + ', 并送了您一朵小花以示安慰 ' + BsNotSwt.getFace(163), 1);
    };

    // 发送标记说明 并断开对话邀请
    BsNotSwt.SendIdentit = function(reme, qz) {
        console.log('[UserScript:BsNotSwt] 发送对话消息:', reme, qz);
        var url = '&e=' + escape(escape(reme));
        // 发送消息
        LR_hcloopJS(LR_lxurl + 'js/CheckInvitejs.aspx', 'id=' + LR_siteid + '&sid=' + LR_sid + url + ((LR_GetObj('LRMINIWIN') !== null && LR_GetObj('LRMINIWIN').style.display == 'none') ? ('&oid=' + LR_maxoid) : ''));
        // 设置强制则发送断开邀请信息
        if(qz == 1) LR_hcloopJS(LR_sysurl + 'LR/CdEnd.aspx', 'id=' + LR_siteid + '&m=1&lng=' + LR_lng + '&sid=' + LR_sid);
    };

    // 死循环检查是否有 LR_websiteid  如果有就说明会加载商务通 则覆盖他
    BsNotSwt.ci = 0;    // 统计检查时间
    BsNotSwt.id = setInterval(function() {
        if (typeof LR_websiteid == 'string') {
            clearInterval(BsNotSwt.id);
            setTimeout(function() {
                console.log('[UserScript:BsNotSwt] 已加载商务通: ', LR_websiteid);
                // 备份并接管原有函数
                BsNotSwt.openZoosUrl_bak = openZoosUrl;
                openZoosUrl = BsNotSwt.openZoosUrl;
                // 判断是否是自己公司的 延迟3秒后 主动发送消息
                if (BsNotSwt.isSwtList.indexOf(LR_websiteid) >= 0){
                    setTimeout(function() {
                        BsNotSwt.SendIdentit('自己人, ' + BsNotSwt.userName + ' , 谢谢.' + BsNotSwt.getFace(100));
                    }, 0);
                }
            }, 500);
        }
        // 超过 2分钟还没加载就结束定时器
        else if(BsNotSwt.ci++ > 240){
            console.log('[UserScript:BsNotSwt] 检查是否加载商务通超时，可能页面没有加载商务通。');
            clearInterval(BsNotSwt.id);
        }
    }, 100);

    // 注册一个修改用户名的方法
    function setUserName(reload) {
        if(typeof reload == 'undefined') reload = false;
        do{
            BsNotSwt.userName = prompt("请输入自己的名字, 例如 (某部门的某某人):", '');
            if(BsNotSwt.userName === null && !reload){
                alert('您取消了修改名字!');
                return false;
            } else if( '' === BsNotSwt.userName || BsNotSwt.userName === null) {
                BsNotSwt.userName = false;
                alert('名字必须设置且不能为空!');
            } else {
                GM_setValue('userName', BsNotSwt.userName);
            }
        } while(!BsNotSwt.userName);

        alert('您的名字已修改为: ' + BsNotSwt.userName + "\n\n如需修改名字请 按F12 进入控制台(Console) 查看修改方法.");
        return true;
    }
    // 注册到全局
    BsNotSwt_setUserName = setUserName;

    // 删除名字 调试用 一般请勿调用
    function unsetUserName() {
        GM_setValue('userName', false);
    }
    // 注册到全局
    BsNotSwt_unsetUserName = unsetUserName;

})(window);
