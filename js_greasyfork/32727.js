// ==UserScript==
// @name                 eBay Seller Assistant
// @name:zh-CN           eBay卖家助手
// @author               Antecer
// @version              3.1
// @description          Optimize Ebay function to make it more convenient (support ebay.com.hk domain name)
// @description:zh-CN    优化Ebay功能使其更方便（支持 ebay.com.hk 域名）
// @icon64               https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon                 https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @namespace            https://greasyfork.org/zh-CN/users/42351
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_xmlhttpRequest
// @grant                GM_registerMenuCommand
// @include              http*://*.ebay.com*
// @run-at               document-idle
// @compatible           chrome 测试通过
// @downloadURL https://update.greasyfork.org/scripts/32727/eBay%20Seller%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/32727/eBay%20Seller%20Assistant.meta.js
// ==/UserScript==

// 国家简称对照表
var CountryShortList = {"AD":"安道尔共和国","AE":"阿拉伯联合酋长国","AF":"阿富汗","AG":"安提瓜和巴布达","AI":"安圭拉岛","AL":"阿尔巴尼亚","AM":"亚美尼亚","AO":"安哥拉","AR":"阿根廷","AT":"奥地利","AU":"澳大利亚","AZ":"阿塞拜疆","BB":"巴巴多斯","BD":"孟加拉国","BE":"比利时","BF":"布基纳法索","BG":"保加利亚","BH":"巴林","BI":"布隆迪","BJ":"贝宁","BL":"巴勒斯坦","BM":"百慕大群岛","BN":"文莱","BO":"玻利维亚","BR":"巴西","BS":"巴哈马","BW":"博茨瓦纳","BY":"白俄罗斯","BZ":"伯利兹","CA":"加拿大","CF":"中非共和国","CG":"刚果","CH":"瑞士","CK":"库克群岛","CL":"智利","CM":"喀麦隆","CN":"中国","CO":"哥伦比亚","CR":"哥斯达黎加","CS":"捷克","CU":"古巴","CY":"塞浦路斯","CZ":"捷克","DE":"德国","DJ":"吉布提","DK":"丹麦","DO":"多米尼加共和国","DZ":"阿尔及利亚","EC":"厄瓜多尔","EE":"爱沙尼亚","EG":"埃及","ES":"西班牙","ET":"埃塞俄比亚","FI":"芬兰","FJ":"斐济","FR":"法国","GA":"加蓬","GB":"英国","GD":"格林纳达","GE":"格鲁吉亚","GF":"法属圭亚那","GH":"加纳","GI":"直布罗陀","GM":"冈比亚","GN":"几内亚","GR":"希腊","GT":"危地马拉","GU":"关岛","GY":"圭亚那","HK":"香港特别行政区","HN":"洪都拉斯","HT":"海地","HU":"匈牙利","ID":"印度尼西亚","IE":"爱尔兰","IL":"以色列","IN":"印度","IQ":"伊拉克","IR":"伊朗","IS":"冰岛","IT":"意大利","JM":"牙买加","JO":"约旦","JP":"日本","KE":"肯尼亚","KG":"吉尔吉斯坦","KH":"柬埔寨","KP":"朝鲜","KR":"韩国","KT":"科特迪瓦共和国","KW":"科威特","KZ":"哈萨克斯坦","LA":"老挝","LB":"黎巴嫩","LC":"圣卢西亚","LI":"列支敦士登","LK":"斯里兰卡","LR":"利比里亚","LS":"莱索托","LT":"立陶宛","LU":"卢森堡","LV":"拉脱维亚","LY":"利比亚","MA":"摩洛哥","MC":"摩纳哥","MD":"摩尔多瓦","MG":"马达加斯加","ML":"马里","MM":"缅甸","MN":"蒙古","MO":"澳门","MS":"蒙特塞拉特岛","MT":"马耳他","MU":"毛里求斯","MV":"马尔代夫","MW":"马拉维","MX":"墨西哥","MY":"马来西亚","MZ":"莫桑比克","NA":"纳米比亚","NE":"尼日尔","NG":"尼日利亚","NI":"尼加拉瓜","NL":"荷兰","NO":"挪威","NP":"尼泊尔","NR":"瑙鲁","NZ":"新西兰","OM":"阿曼","PA":"巴拿马","PE":"秘鲁","PF":"法属玻利尼西亚","PG":"巴布亚新几内亚","PH":"菲律宾","PK":"巴基斯坦","PL":"波兰","PR":"波多黎各","PT":"葡萄牙","PY":"巴拉圭","QA":"卡塔尔","RO":"罗马尼亚","RU":"俄罗斯","SA":"沙特阿拉伯","SB":"所罗门群岛","SC":"塞舌尔","SD":"苏丹","SE":"瑞典","SG":"新加坡","SI":"斯洛文尼亚","SK":"斯洛伐克","SL":"塞拉利昂","SM":"圣马力诺","SN":"塞内加尔","SO":"索马里","SR":"苏里南","ST":"圣多美和普林西比","SV":"萨尔瓦多","SY":"叙利亚","SZ":"斯威士兰","TD":"乍得","TG":"多哥","TH":"泰国","TJ":"塔吉克斯坦","TM":"土库曼斯坦","TN":"突尼斯","TO":"汤加","TR":"土耳其","TT":"特立尼达和多巴哥","TW":"台湾省","TZ":"坦桑尼亚","UA":"乌克兰","UG":"乌干达","US":"美国","UY":"乌拉圭","UZ":"乌兹别克斯坦","VC":"圣文森特岛","VE":"委内瑞拉","VN":"越南","YE":"也门","YU":"南斯拉夫","ZA":"南非","ZM":"赞比亚","ZR":"扎伊尔","ZW":"津巴布韦"};
// 验证网址是否包含某字符串
function UrlExp(textStr) {
    return RegExp(textStr).test(window.location.href);
}
// 创建选择器的简化写法
function dQuery(selector) {
    return document.querySelector(selector);
}
function dQueryAll(selector) {
    return document.querySelectorAll(selector);
}
// 出售记录 Page
if (UrlExp(/(MyeBayNextSold|MyeBayAllSelling|MyeBayNextAllSelling)/)) {
    console.log("启动出售记录页面内容优化");
    // 修改订单处理菜单（将查看订单信息和添加备注直接显示，不用点击下拉菜单）
    dQueryAll('#ItemDisplayContainer_SoldNext #mT').forEach((item, index, arr) => {
        let Transactions = item.querySelector('td').id.split('Transactions.')[1].split('_');
        let itemid = Transactions[0];
        let transId = Transactions[1];
        // 显示“檢視訂單詳細資料”菜单
        let paymentStatus = document.createElement('tr');
        paymentStatus.innerHTML = `<td>${dQuery('#hdn_al_241_pdm_js a[href*=VPS]').outerHTML.replace('#TID#', transId).replace('_Item_Id', itemid)}</td>`;
        item.parentNode.appendChild(paymentStatus);
        // 显示“新增备注/修改备注”菜单
        let remark = document.createElement('tr');
        remark.innerHTML = `<td>${dQueryAll('#hdn_al_241_pdm_js a[onclick*=ADDN]')[index].outerHTML.replace(/_Item_Id_\d+/g, itemid + '_' + transId).replace('_Item_Id_', itemid)}</td>`;
        item.parentNode.appendChild(remark);
        // 显示收件人信息
        let paymenAddr = document.createElement('tr');
        paymenAddr.innerHTML = `<td><div id=${transId}></div></td>`;
        item.parentNode.appendChild(paymenAddr);
        // 抓取订单详细资料,提取物品运送地址信息(暂时仅支持ebay香港站)
        let getPaymentUrl = paymentStatus.querySelector('a').href + '&getPaymentAddress';
        getPaymentUrl = `https://vod.ebay.com.hk/vod/FetchOrderDetails?${getPaymentUrl.split('?')[1]}`; // 因Ebay改版,获取地址信息的页面链接产生变更
        if(index == 0) console.log(`详细资料信息获取来源:${getPaymentUrl}`); // 打印调试信息
        if (document.domain == 'my.ebay.com.hk') {
            GM_xmlhttpRequest({
                method: "GET",
                url: getPaymentUrl,
                onload: function (request) {
                    let reqTxt = request.responseText;
                    if(index == 0) console.log(reqTxt); // 打印调试信息
                    let addrJson = reqTxt.match(/(?<=shippingAddress\":).*?\}/)[0]; // 提取shippingAddress信息
                    if(index == 0) console.log(addrJson); // 打印调试信息
                    let addrNodes = JSON.parse(addrJson); // 将shippingAddress字符串转换为JSON对象
                    addrNodes.country = `${addrNodes.country} - ${CountryShortList[addrNodes.country]}`; // 为国家缩写代码添加对应的中文全名
                    addrNodes.addressLine2 = addrNodes.addressLine2 == null ? "" : `, ${addrNodes.addressLine2}`; // 合并街道1和街道2地址
                    // 拼接地址信息
                    let addrNode = `<div id=${transId} style="position:absolute; text-align: left; left:520px; margin-top: -30px;">姓名：${addrNodes.name}<br/>国家：${addrNodes.country}<br/>省州：${addrNodes.stateOrProvince}<br/>城市：${addrNodes.city}<br/>邮编：${addrNodes.zip}<br/>电话：${addrNodes.phoneNumber}<br/>街道：${addrNodes.addressLine1}${addrNodes.addressLine2}<br/>城市&省州&邮编：${addrNodes.prettyCityStateZip}</div>`;
                    // 将地址信息插入网页
                    paymenAddr.innerHTML = `<td>${addrNode}</td>`;
                }
            });
        }
    });
    // 修改运单追踪功能 （使用17Track代替，追踪功能更强大）
    let trackAPI = '//www.17track.net/en/externalcall?resultDetailsH=356&fc=0&nums=';
    let _17Track = document.createElement('div');
    _17Track.id = 'trackBox';
    _17Track.innerHTML = '<style type="text/css">#trackBoxClose{text-decoration: none;position: absolute; right: 0px; top: 0px; width: 55px; height: 55px; line-height: 55px; background: #7FB0B0B0; color: #FFFFFFFF; font-size: 48px; text-align: center; font-family: Arial, Helvetica, sans-senif; z-index: 100; cursor: pointer;} #trackBoxClose:hover{ background:black;}</style><a id="trackBoxClose">×</a><iframe id="tracker" name="tracker" src="" frameborder="0" scrolling="no" height="600" width="600"></iframe>';
    _17Track.style.cssText = 'display:none;z-index:99999;position:absolute;left:-999;top:-999;width:600px;height:589px;box-shadow:rgba(0, 0, 0, 0.28) 0px 1px 1px 1px;';
    _17Track.addEventListener('click', (event) => {
        if (event.target.tagName == 'A') { _17Track.style.display = 'none'; }
    });
    dQuery('body').appendChild(_17Track);
    dQueryAll('[id^=track] [href^=javascript]').forEach((item) => {
        // 隐藏Paypal自带追踪功能
        item.style.display = 'none';
        // 创建17Track追踪元素
        let tracker = document.createElement('a');
        tracker.style.cursor = 'pointer';
        tracker.title = '17Track';
        tracker.innerHTML = item.innerHTML;
        item.parentNode.insertBefore(tracker, item);
    });
    dQuery('#ItemDisplayContainer_SoldNext').addEventListener('click', (event) => {
        // 监听运单号点击事件，显示运单追踪页面
        if (event.path[0].title == '17Track') {
            _17Track.querySelector('#tracker').src = trackAPI + event.path[0].innerHTML;
            _17Track.style.left = event.pageX + 'px';
            _17Track.style.top = event.pageY + 'px';
            _17Track.style.display = 'block';
        }
    });
    // 给 联络会员 超链接添加额外参数(追踪码,用于 联系买家Page 功能)
    dQueryAll('#ItemDisplayContainer_SoldNext .my_itl-itR').forEach((item) => {
        if(item.querySelector('[title="17Track"]')) {
           item.querySelector('[href*=contact]').href += ('#tracknum=' + item.querySelector('[title="17Track"]').innerHTML);
        }
    });
}
// 联系买家 Page
if (UrlExp(/contact/)) {
    // 从URL获取传入的追踪号
    let tracknum = window.location.href.match(/tracknum=(L\S\d{9}CN)/);
    console.log(tracknum);
    let trackingLink = '\r\nhttps://t.17track.net/en#nums=' + tracknum[1];
    // 创建常用沟通语句
    let contactMsgs = [
        ["投递成功", `Hello, I track your order has been delivered. Did you receive it?`],
        ["投递失败", `Hello, I tracked down your order delivery failed!\r\nI think you should contact the post office as soon as possible to find your package.`],
        ["抵达待取", `Hello, I track your order has arrived, But did not delivered. \r\nI think you should contact the post office as soon as possible to find your package.`],
        ["物流异常", `Hello, I track your order logistics information has not been updated for a long time. Do you know what happened?`]
    ]
    // 创建快捷留言按钮
    let buttonBar = document.createElement('div');
    contactMsgs.forEach((item) => {
        buttonBar.innerHTML += `<input type="button" value="${item[0]}" style="margin: 2px;"/>`;
    });
    dQuery('.top-head').appendChild(buttonBar);
    // 监听快捷留言按钮点击事件
    buttonBar.addEventListener('click', (event) => {
        if (event.path[0].type == 'button') {
            dQuery('#msg_cnt_cnt').value = contactMsgs.find(item => item[0] == event.path[0].value)[1] + trackingLink;
            // 使用input事件触发文本框change事件
            let msgInputEvent = document.createEvent("HTMLEvents");
            msgInputEvent.initEvent("input", true, true);
            dQuery('#msg_cnt_cnt').dispatchEvent(msgInputEvent);
        }
    });
}
// 新增或编辑追踪号码 Page
if (UrlExp(/AddTrackingNumber/)) {
    // 设置运送公司为 China Post
    dQuery('[title="Carrier Name"]').value = 'China Post';
}
// 留下信用评价 Page
if (UrlExp(/fdbk/)) {
    // 创建评价内容
    let leaveMessage = 'Thanks for your support!';
    // 创建输入框change事件触发器
    let inputChangeEvent = document.createEvent("HTMLEvents");
    inputChangeEvent.initEvent("change", true, true);
    // 创建评价按钮CSS样式
    let fdbkButtonStyle = 'cursor: pointer; background-color: #876543; color: #fff; padding: 0 10px; line-height: 40px; font-size: 16px; position: fixed; right: -2px; transform: rotate(-90deg) translate(50%,50%);';
    // 添加评价送达按钮
    let SeekButton = dQuery('#seek');
    if(SeekButton){
        let buttonOffset = UrlExp(/ebay.com.hk/) ? 0 : 1;
        let leaveNorm = document.createElement('div');
        leaveNorm.style.cssText = fdbkButtonStyle + `top: calc(50% - 17em - ${buttonOffset}em);`;
        leaveNorm.innerHTML = '评价送达';
        SeekButton.parentNode.insertBefore(leaveNorm, dQuery('#seek'));
        leaveNorm.addEventListener('click', () => {
            dQueryAll('.otd_section').forEach((item) => {
                item.parentNode.querySelector('.pnn_section [value=POSITIVE]').click();
                item.parentNode.querySelector('[id^=pnnComment]').value = leaveMessage;
                item.parentNode.querySelector('[id^=pnnComment]').dispatchEvent(inputChangeEvent);
            });
        });
        // 添加评价全部按钮
        let leaveAll = document.createElement('div');
        leaveAll.style.cssText = fdbkButtonStyle + `top: calc(50% - 11em - ${buttonOffset}em);`;
        leaveAll.innerHTML = '评价全部';
        SeekButton.parentNode.insertBefore(leaveAll, dQuery('#seek'));
        leaveAll.addEventListener('click', () => {
            dQueryAll('.pnn_section').forEach((item) => {
                item.parentNode.querySelector('.pnn_section [value=POSITIVE]').click();
                item.parentNode.querySelector('[id^=pnnComment]').value = leaveMessage;
                item.parentNode.querySelector('[id^=pnnComment]').dispatchEvent(inputChangeEvent);
            });
        });
        // 添加留下评价按钮
        let leaveButton = document.createElement('div');
        leaveButton.style.cssText = fdbkButtonStyle + `top: calc(50% - 5em - ${buttonOffset}em);`;
        leaveButton.innerHTML = '留下评价';
        SeekButton.parentNode.insertBefore(leaveButton, dQuery('#seek'));
        leaveButton.addEventListener('click', () => {
            dQueryAll('[id^=submitFeedbackBtn]:not([disabled])').forEach((item) => {
                item.click();
            });
        });
        // 默认触发一次评价送达
        leaveNorm.click();
    }
}
// APAC发货物流页UI优化
if (UrlExp(/manageTransactions/)) {
    let orderpanelCSS = document.createElement('style');
    orderpanelCSS.innerHTML = `#oly_17{ left: 10% !important; width: 80% !important;} #CNPOST-EPACKLabelFrame{ width: 100% !important; }`;
    document.querySelector('body').appendChild(orderpanelCSS);
}

// 插件菜单
GM_registerMenuCommand('Ebay卖家助手配置', () => {
    console.log(event);
    alert('功能规划中...');
});