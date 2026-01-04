// ==UserScript==
// @name         轻流QingFlow超级插件(Tampermonkey版本)
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  轻流QingFlow应用自动超级字段插件
// @author       Mr.Dragon King
// @license      Mr.Dragon King
// @match       *://*.qingflow.com/*
// @match       *://*.uat.scholarshipsgateway.gov.sg/*
// @match       *://*.app4355.eapps.dingtalkcloud.com/*
// @icon         https://file.qingflow.com/assets/logo-pure.png
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455465/%E8%BD%BB%E6%B5%81QingFlow%E8%B6%85%E7%BA%A7%E6%8F%92%E4%BB%B6%28Tampermonkey%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455465/%E8%BD%BB%E6%B5%81QingFlow%E8%B6%85%E7%BA%A7%E6%8F%92%E4%BB%B6%28Tampermonkey%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==

//消息推送
var MessagePushState = false;//是否开启消息推送 功能下线 请勿开启
var QW_QrobotHook = "";//企业微信群机器人Hook

//——————————————————————————————————————————————//
//——————————————————————————————————————————————//
/**
 * 按钮配色方案(皮肤方案)
 * 开启本地皮肤方案  （在线功能下线）
 */
var ButtonColorOpen = true;
/**
 * 按钮配色方案(皮肤方案)
 * 是否开启看板娘
 */
var ButtonColorOpen_Live2DWidget = true;
/**
 * 按钮配色方案(皮肤方案)
 * 皮肤ID
 */
var ButtonColorTypeID = "1004";
//——————————————————————————————————————————————//
//——————————————————————————————————————————————//



//——————————————————————————————————————————————//
//——————————————————————————————————————————————//
/**
 *  悬浮动画开关
 */
var floatingAnimationOpen = false;
/**
 * 预设的悬浮动画方案
 * id==custom 为自定义动画元素图片，支持base64、png、jpg、gif
 * 当id==custom时floatingAnimationCustom参数必填，自定义动画元素资源
 * 当id==1000时为默认动画资源配置
 */
var floatingAnimationTypeID = "1000";
/**
 * 当id==custom时floatingAnimationCustom参数必填，自定义动画元素资源
 */
var floatingAnimationCustom = "";

//——————————————————————————————————————————————//
//——————————————————————————————————————————————//


//Imean帮助中心
/**
 * 是否开启Imean帮助中心
 */
var ImeanOpen = false;//开启Imean帮助中心 功能下线
/**
 * Imean项目ID
 * Imean工作台网址:https://useimean.com/home/
 */
var ImeanProjectIdID = "tc1KoYSaBnR90fuTDg-OU";//Imean项目ID


//@Data
var fieldUN = "未同步！！！";//字段数量
var PageOptimizationOpen = false;
//@注册基础元素-字段
var field_Textfield = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[1]";//单行文字
var field_Textarea = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[2]";//多行文字
var field_Number = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[3]";//数字
var field_Link = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[4]";//链接
var field_Date = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[5]";//日期
var field_StartStopTime = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[6]";//起止时间
var field_Phone = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[7]";//电话
var field_Mailbox = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[8]";//邮箱
var field_AloneChoice = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[9]";//单项选择
var field_DropDownChoice = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[10]";//下拉选择
var field_MultipleChoice = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[11]";//多项选择
var field_ImagesChoice = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[12]";//图片选择
var field_FileUpload = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[13]";//附件上传
var field_Address = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]/div/div/div[14]";//地址


//@注册基础元素-字段基础参数
var field_Title = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/qf-title-and-hint/div[2]/input";//字段标题
var fieldParameter_Required = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[1]/label";//必填
var fieldParameter_QRCode = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[2]/label";//扫码（默认二维码）
var fieldParameter_BarCode = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[2]/qf-radio-group/label[2]";//扫码-条形码
var fieldParameter_NotDuplicateValue = "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[3]/label"//不允许重复值

//@注册基础元素-字段高级参数
var fieldParameter_AssociateExistingData = "";//关联已有数据
var fieldParameter_LimitWords = "";//限制字数
var fieldParameter_DecimalsAllowed = "";//允许小数
var fieldParameter_DisplayAmount = ""//显示金额
var fieldParameter_TimeFormat = "";//时间格式
var fieldParameter_TimeOverlapNotAllowed = "";//不允许时间重叠
var fieldParameter_FixedTelephone = "";//支持固定电话
var fieldParameter_SMSVerification = "";//短信验证
var fieldParameter_OptionContent = "";//选项内容

//@Excel表头导入字段关键字识别-匹配字段类型并设置字段参数
var fieldData_type_testData = [
    {
        RegExp: "金额",//关键词【字符串】
        fieldData_type: "【数字】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "日期",//关键词【字符串】
        fieldData_type: "【日期】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "单价",//关键词【字符串】
        fieldData_type: "【数字】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "资本",//关键词【字符串】
        fieldData_type: "【数字】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "编号",//关键词【字符串】
        fieldData_type: "【单行文本】",//字段类型【字符串】
        fieldData_parameter: [{ type: "必填" }],//字段参数【数组】
    },
    {
        RegExp: "邮箱",//关键词【字符串】
        fieldData_type: "【邮箱】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "电话",//关键词【字符串】
        fieldData_type: "【电话】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    },
    {
        RegExp: "手机",//关键词【字符串】
        fieldData_type: "【电话】",//字段类型【字符串】
        fieldData_parameter: [],//字段参数【数组】
    }
]

//打印控制台版本信息
console.log("=====================================================================")
console.log("|| @name         QingFlow Dragon King Super Tools")
console.log("|| @description  轻流QingFlow应用自动超级字段插件")
console.log("|| @author       Mr.Dragon King")
console.log("|| @license      Mr.Dragon King")
console.log("=====================================================================")



console.log("Hello,欢迎使用【QingFlow Dragon King Super Tools】\n轻流QingFlow应用自动超级字段插件🐲\n\n@author       Mr.Dragon King \n\n使用帮助：\nhttps://www.yuque.com/g/mrscott-prexr/bgia0r/hfwq3pdgm0y7m50i/collaborator/join?token=Je5Br7K9hrV1R8FE# 《QingFlow Dragon King Super Tools使用帮助》\n\n更多信息可联系作者");

/**
 * @jquery库
 * 引入jquery库
 */
function jquery() {
    var myScript = document.createElement('script');
    myScript.src = 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js';
    document.getElementsByTagName('head')[0].appendChild(myScript);
}


/**
 * @XPath方法
 * 引入XPath方法
 */
function $x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}


/**
 * @xlsx库
 * 引入xlsx库
 */
function xlsx() {
    var myScript = document.createElement('script');
    myScript.src = 'http://libs.baidu.com/jquery/2.1.4/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(myScript);
}


//@页面启动
(function () {
    //加载库
    setTimeout(function () {
        jquery();
        Menu();
        xlsx();
        ButtonColorScheme();
        floatingAnimation()
        Imean()
    }, 2000);
})();


$(function () {
    $(document).on("click", "#a", function () {
        console.log("优化界面完成")
    });
});


//=================================功能菜单=================================
//@菜单menu
/**
 * 加载操作菜单
 */
function Menu() {
    //编辑页菜单
    var BatchAddFields = "<button id='BatchAddFields'  style='height: 36px;margin-left:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><text style='margin-left:6px;'>批量添加字段</text></button>";//批量添加字段按钮
    var Help = "<button id='Help'  style='height: 36px;margin-left:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><text style='margin-left:6px;'>插件使用帮助</text></button>";//插件使用帮助按钮
    var SystemDesignDrawing = "<button id='SystemDesignDrawing'  style='height: 36px;margin-left:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><img src='https://dss0.bdstatic.com/-0U0bXSm1A5BphGlnYG/tam-ogel/1208056450_-1268512460_88_88.png' width='20' height='20'><text style='margin-left:6px;border-radius:20px'>QingFlow系统设计图</text></button>";//系统设计图
    var PageOptimization = "<button id='PageOptimization'  style='height: 36px;margin-left:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><text style='margin-left:6px;border-radius:20px'>面板界面优化</text></button>";//界面优化
    var ExcelImport = "<input type='file' id='excel-file' style='height: 36px;margin-left:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'>";//Excel导入

    //首页菜单
    var ImeanButton = "<button id='Imean'  style='height: 36px;margin-right:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><img src='https://useimean.com/home/assets/favicon.13d0c104.ico' width='20' height='20'><text style='margin-left:6px;'>iMean帮助引导</text></button>";//Imean帮助引导
    var ButtonColorButton = "<button id='Imean'  style='height: 36px;margin-right:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><img src='https://dss0.bdstatic.com/-0U0bXSm1A5BphGlnYG/tam-ogel/1208056450_-1268512460_88_88.png' width='20' height='20'><text style='margin-left:6px;'>QIngFlow皮肤中心</text></button>";//QIngFlow皮肤中心
    var SecondaryScreenMode = "<button id='Imean'  style='height: 36px;margin-right:20px; margin-bottom:20px;  margin-top: 20px; border: 1px solid #e6eaf0;  border-radius: 4px; border-radius: 4px; color: #494f57;cursor: pointer; background: #F9FAFC;'><img src='https://676f-gokuschool-3gl85srrc0c313c4-1304791592.tcb.qcloud.la/cmsReminderServiceResources/%E6%98%BE%E7%A4%BA%E5%99%A8.svg?sign=1bccc6f03433c82667a353584ed45c77&t=1683267914' width='20' height='20'><text style='margin-left:6px;'>副屏模式</text></button>";//副屏模式

    setInterval(function () {
        //校验编辑应用页面
        if (window.location.href.indexOf('/f/') !== -1 && $x("/html/body/qf-root/qf-pages/qf-app-item/qf-creation/qf-header-edit/div").length <= 0) {
            $("body > qf-root > qf-pages > qf-app-item > qf-creation > qf-header-edit > header").before("<div style='z-index:999'>" + BatchAddFields + PageOptimization + Help + SystemDesignDrawing + ExcelImport + "</div>");
        }
        /**校验轻流首页
        if(window.location.href.indexOf('/index/') !== -1 &&$x("/html/body/qf-root/qf-pages/div").length <= 0 ){
            $("body > qf-root > qf-pages >").before("<div style='z-index:999'>" + ImeanButton + ButtonColorButton + SecondaryScreenMode + "</div>");
        }
        */
        /*轻流 （旧版本）
        */
        if (window.location.href.indexOf('/tag/') !== -1 && $x("/html/body/qf-root/qf-pages/div").length <= 0) {
            $("body > qf-root > qf-pages >").before("<div style='z-index:999'>" + ImeanButton + ButtonColorButton + SecondaryScreenMode + "</div>");
        }

    }, 3000);
}


/**
 * 新版本菜单
 */
function Menu2() {
    (function () {
        // 定义公共样式
        const buttonStyle = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 116px;
        height: 36px;
        border: 1px solid #e6eaf0;
        border-radius: 4px;
        background: #F9FAFC;
        color: #494f57;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        margin:8px 4px 0 0
    `;

        // 定义菜单项模板
        const createMenuItem = (imgUrl, text) => `
        <span style="margin-left;4px; font-size:14px;font-weight:600;">超级工具</span>
       <div style="margin:10px 0 0 0 ; width: 20px; height: 20px;">
          <div style="${buttonStyle}">
              <img src="${imgUrl}" style="margin-right: 1px; width: 20px; height: 20px;">
              ${text}
          </div>
        </div>
    `;

        // 创建菜单栏
        const menuContainer = document.createElement('div');
        menuContainer.style.display = 'grid';
        menuContainer.style.gridTemplateColumns = '1fr 1fr';
        menuContainer.style.gap = '10px';
        menuContainer.style.padding = '26px 0 0 10px';

        // 添加标题
        const title = document.createElement('div');
        title.innerText = '超级工具';
        title.style.fontSize = '14px';
        title.style.fontWeight = '600';
        title.style.gridColumn = 'span 2';
        title.style.marginBottom = '10px';
        menuContainer.appendChild(title);

        // 定义菜单项数据
        const menuItems = [
            { img: 'icon1.png', text: '批量添加字段' },
            { img: 'icon2.png', text: 'Excle导入' },
            { img: 'icon2.png', text: 'UI大屏适配' },
        ];

        // 生成菜单项并添加到菜单栏
        menuItems.forEach(item => {
            menuContainer.innerHTML += createMenuItem(item.img, item.text);
        });

        // 插入菜单栏到指定位置
        function injectMenu() {
            const targetElements = document.evaluate(
                "/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[1]",
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for (let i = 0; i < targetElements.snapshotLength; i++) {
                const targetElement = targetElements.snapshotItem(i);
                if (targetElement && !document.getElementById('custom-menu')) {
                    menuContainer.id = 'custom-menu'; // 防止重复注入
                    targetElement.appendChild(menuContainer);
                }
            }
        }

        // 定期检查并注入菜单栏
        setInterval(function () {
            if (window.location.href.indexOf('/f/') !== -1) {
                injectMenu();
            }
        }, 3000);
    })();


}







//===========================================================================
//=================================插件使用帮助=================================
//@插件使用帮助Help
$(function () {
    $(document).on("click", "#Help", function () {
        window.open("https://exiao.yuque.com/pc5k40/ngqg4r/lv64cgq5rdy4xvtn?singleDoc# 《QingFLow浏览器插件工具介绍》", "_blank");
    });
});
//=================================轻流系统设计图=================================
//@轻流系统设计图SystemDesignDrawing
$(function () {
    $(document).on("click", "#SystemDesignDrawing", function () {
        window.open("https://exiao.yuque.com/pc5k40/ngqg4r/oucgap?singleDoc", "_blank");
    });
});

//=================================面板界面优化=================================
//@面板界面优化PageOptimization
$(function () {
    $(document).on("click", "#PageOptimization", function () {
        PageOptimizationOpen = true;
        setTimeout(() => {
            $x("/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]")[0].style.cssText = "width:750px";
            console.log("优化界面完成")
        }, 1000)
    });
});
//=================================Imean帮助中心=================================
/**
 * Imean帮助中心
 */
function Imean() {
    if (ImeanOpen) {
        console.log("启动Imean");
        // 创建并插入 link 元素
        var linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://useimean.com/sdk/main.css';
        document.head.appendChild(linkElement);

        // 创建并插入第一个 script 元素
        var scriptElement1 = document.createElement('script');
        scriptElement1.src = 'https://useimean.com/sdk/main.js';
        scriptElement1.onload = function () {
            try {
                ImeanSDK.init({
                    projectId: ImeanProjectIdID, // 项目id
                    baseUrl: 'https://useimean.com', // 请求服务器地址
                    onStepChange: function ({ recording, currentIndex }) { }, // 引导中步骤变化
                    onFinish: function ({ recording }) { }, // 引导步骤完成
                    onExit: function ({ recording }) { }, // 引导中主动退出
                    identity: function () { return {} }, // 返回用户信息
                    hideHelp: false, // 设置为false即展示帮助中心
                });
            }
            catch (error) { }
        };
        document.head.appendChild(scriptElement1);

    }
};
//=================================按钮配色优化方案=================================
/**
 * 获取皮肤方案
 */
function ButtonColorScheme() {
    if (ButtonColorOpen) {
        var a = $x("/html/body/qf-root/qf-pages/qf-new-index/div/div[1]/qf-index-sidebar/div");
        if (a.length > 0) {
            var attrs = a[0].attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attrName = attrs[i].name;
                var match = attrName.match(/_ngcontent-0-c(\d+)/);
                if (match) {
                    var num = match[1];
                    console.log(num);
                    switch (ButtonColorTypeID) {
                        case "1001": {
                            // 粉紫色渐变
                            let styles = [
                                { "explain": "导航栏背景", "pourInto": `<style>.window-left[_ngcontent-0-c${num}]{background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);}</style>` },
                                { "explain": "元素颜色适配", "pourInto": `<style>:root { --brand-primary-05: #f2e9ff; --brand-primary-10: #e4d3ff; --brand-primary-20: #c9a6ff; --brand-primary-30: #ae7aff; --brand-primary-40: #944dff; --brand-primary-50: #7931ff; --brand-primary-base: #231557; --brand-primary-70: #1b0e41; --brand-primary-80: #14082b; --brand-primary-90: #0c0414; --brand-primary-100: #05020a; --qf-brand-neutral-color-05: #ffffff; --qf-brand-neutral-color-10: #e6eaf0; --qf-brand-neutral-color-20: #ccd4e0; --qf-brand-neutral-color-30: #9ea7b3; --qf-brand-neutral-color-40: #767e89; --qf-brand-neutral-color-50: #494f57; --qf-brand-neutral-color-60: #2a2c30; --qf-brand-neutral-color-70: #242629; --qf-brand-neutral-color-80: #1e1f22; --qf-brand-neutral-color-90: #18191c; --qf-brand-neutral-color-100: #121315; }</style>` },
                            ];

                            let styleString = styles.map(style => `${style.pourInto}`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "1002": {
                            // 粉黄色渐变面板
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%);}` },
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "1003": {
                            // 天空蓝渐变
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #7CF7FF 0%, #4B73FF 100%);}` },
                                { "explain": "元素颜色适配", "pourInto": `:root { --brand-primary-05: #eef3ff; --brand-primary-10: #dde7ff; --brand-primary-20: #bbcfff; --brand-primary-30: #99b8ff; --brand-primary-40: #779fff; --brand-primary-50: #5586ff; --brand-primary-base: #4B73FF; --brand-primary-70: #0a2fcf; --brand-primary-80: #0027a3; --brand-primary-90: #001a7a; --brand-primary-100: #000e56; --qf-brand-neutral-color-05: #ffffff; --qf-brand-neutral-color-10: #e6eaf0; --qf-brand-neutral-color-20: #ccd4e0; --qf-brand-neutral-color-30: #9ea7b3; --qf-brand-neutral-color-40: #767e89; --qf-brand-neutral-color-50: #494f57; --qf-brand-neutral-color-60: #2a2c30; --qf-brand-neutral-color-70: #242629; --qf-brand-neutral-color-80: #1e1f22; --qf-brand-neutral-color-90: #18191c; --qf-brand-neutral-color-100: #121315;}` }
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "1004": {
                            // 粉紫渐变(浅色)
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #B7DCFF 0%, #FFA4F6 100%);}` },
                                { "explain": "元素颜色适配", "pourInto": `:root { --brand-primary-05: #ffebfb; --brand-primary-10: #ffd8f8; --brand-primary-20: #ffb2f1; --brand-primary-30: #ff8ceb; --brand-primary-40: #ff66e5; --brand-primary-50: #ff40df; --brand-primary-base: #FFA4F6; --brand-primary-70: #cc82c5; --brand-primary-80: #996193; --brand-primary-90: #663f62; --brand-primary-100: #331e31; --qf-brand-neutral-color-05: #ffffff; --qf-brand-neutral-color-10: #e6eaf0; --qf-brand-neutral-color-20: #ccd4e0; --qf-brand-neutral-color-30: #9ea7b3; --qf-brand-neutral-color-40: #767e89; --qf-brand-neutral-color-50: #494f57; --qf-brand-neutral-color-60: #2a2c30; --qf-brand-neutral-color-70: #242629; --qf-brand-neutral-color-80: #1e1f22; --qf-brand-neutral-color-90: #18191c; --qf-brand-neutral-color-100: #121315; }` }
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "1005": {
                            // 深绿色渐变
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #00B960 0%, #00552C 100%);}` }
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "1006": {
                            // 黄绿色渐变
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #FFEB3A 0%, #4DEF8E 100%);}` }
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');
                            break;
                        }
                        case "newyear01": {
                            // 新年方案1
                            let styles = [
                                { "explain": "导航栏背景色", "pourInto": `.window-left[_ngcontent-0-c${num}]{background: linear-gradient(220.55deg, #FF0000 0%, #470000 100%);}` },
                                { "explain": "元素颜色适配", "pourInto": `:root { --brand-primary-05: #ffe5e5; --brand-primary-10: #ffcccc; --brand-primary-20: #ff9999; --brand-primary-30: #ff6666; --brand-primary-40: #ff3333; --brand-primary-50: #ff1a1a; --brand-primary-base: #FF0000; --brand-primary-70: #cc0000; --brand-primary-80: #990000; --brand-primary-90: #660000; --brand-primary-100: #330000; --qf-brand-neutral-color-05: #ffffff; --qf-brand-neutral-color-10: #e6eaf0; --qf-brand-neutral-color-20: #ccd4e0; --qf-brand-neutral-color-30: #9ea7b3; --qf-brand-neutral-color-40: #767e89; --qf-brand-neutral-color-50: #494f57; --qf-brand-neutral-color-60: #2a2c30; --qf-brand-neutral-color-70: #242629; --qf-brand-neutral-color-80: #1e1f22; --qf-brand-neutral-color-90: #18191c; --qf-brand-neutral-color-100: #121315; }` }
                            ];
                            let styleString = styles.map(style => `<style>${style.pourInto}</style>`).join('');
                            $(styleString).appendTo('head');

                            //网页新年灯笼挂件
                            $("body > qf-root > qf-pages >").before(" <script src='https://cdn.jsdelivr.net/gh/fz6m/china-lantern@1.1/dist/china-lantern.min.js'></script>");
                            break;
                        }
                    }

                }
                /**
                 * 是否开启看板娘
                 */
                if (ButtonColorOpen_Live2DWidget) {
                    //注入看板娘（修版本注入方案）
                    // $(`<script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css"/><script src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/autoload.js"></script>`).appendTo('head');

                    // 创建并插入 jQuery script 元素
                    var scriptJQuery = document.createElement('script');
                    scriptJQuery.src = 'https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js';
                    document.head.appendChild(scriptJQuery);

                    // 创建并插入 Font Awesome link 元素
                    var linkFontAwesome = document.createElement('link');
                    linkFontAwesome.rel = 'stylesheet';
                    linkFontAwesome.href = 'https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css';
                    document.head.appendChild(linkFontAwesome);

                    // 创建并插入 Live2D Widget script 元素
                    var scriptLive2D = document.createElement('script');
                    scriptLive2D.src = 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/autoload.js';
                    document.head.appendChild(scriptLive2D);

                }
            }
        } else {
            console.log("没有找到匹配的元素");
        }
    }
}
function replaceString(str, replaceStr) {
    // 使用正则表达式 / \$\$\$/g 来匹配所有的 "$$$"，并用 replaceStr 替换它们
    return str.replace(/\$\$\$/g, replaceStr);
}
//=================================设计图添加=================================
//@批量添加字段BatchAddFields
$(function () {
    $(document).on("click", "#BatchAddFields", function () {
        BatchAddFields();
    });
});


//@触发批量添加字段BatchAddFields
function BatchAddFields() {
    var InputValue = prompt("Hello,欢迎使用【QingFlow Dragon King Super Tools】\n轻流QingFlow应用自动超级字段插件🐲\n@author       Mr.Dragon King \n\n请批量输入字段信息", "【单行文本】字段名称");
    if (InputValue != null && InputValue != "") {
        AnalysisOfConstructionContent(InputValue)
    }
}

//@解析文字算法AnalysisOfConstructionContent
function AnalysisOfConstructionContent(InputData) {
    InputData = InputData.replace(/\ +/g, "");
    InputData = InputData.replace(/[\r\n]/g, "");
    var FieldAnalysisData = [];//解析结果

    // 定义识别类型
    const DistinguishType = {
        FieldType: 1,
        FieldTitle: 2,
        FieldParameter: 3
    }

    var fieldData = {//字段数据
        type: "",//字段类型
        title: "",//字段标题
        parameter: [],//字段参数
    };

    var fieldData_parameter_textData = "";//解析参数字段内容 二次解析内容

    var distinguishType = DistinguishType.FieldType;//默认为1，即字段类型

    for (let textLengthIndex = 0; InputData.length > textLengthIndex; textLengthIndex++) {
        // 校验字段类型添加
        if (InputData[textLengthIndex].match(/\【/)) {
            // 识别上个字段内容并添加到字段信息中
            if (fieldData.type.length != 0) {
                FieldAnalysisData.push(fieldData);
                // 初始化值
                fieldData = {
                    type: "",
                    title: "",
                    parameter: []
                };
                fieldData_parameter_textData = "";
            }
            // 转换识别类型为1，即字段类型
            distinguishType = DistinguishType.FieldType;
        }

        // 校验字段类型添加结束，添加字段标题
        if (InputData[textLengthIndex].match(/\】/)) {
            fieldData.type = `${fieldData.type}${InputData[textLengthIndex]}`;
            distinguishType = DistinguishType.FieldTitle;
        }

        // 校验字段标题添加结束，添加字段参数
        if (InputData[textLengthIndex].match(/\(/) || InputData[textLengthIndex].match(/（/)) {
            distinguishType = DistinguishType.FieldParameter;
        }

        if (distinguishType === DistinguishType.FieldType) {
            fieldData.type = `${fieldData.type}${InputData[textLengthIndex]}`;
        }

        if (distinguishType === DistinguishType.FieldTitle) {
            if (InputData[textLengthIndex] != "】") {
                fieldData.title = `${fieldData.title}${InputData[textLengthIndex]}`;
            }
        }

        if (distinguishType === DistinguishType.FieldParameter) {
            if (InputData[textLengthIndex] != "(" && InputData[textLengthIndex] != "（") {
                if (InputData[textLengthIndex].match(/\)/) || InputData[textLengthIndex].match(/）/)) {
                    if (fieldData_parameter_textData.length == 0) {
                    } else {
                        let outfieldData_parameter_textData = ResolveFieldParameters(fieldData_parameter_textData);
                        if (outfieldData_parameter_textData.type == "非注册参数") {
                            alert(`Hello,欢迎使用【QingFlow Dragon King Super Tools】\n轻流QingFlow应用自动超级字段插件🐲\n\n@author       Mr.Dragon King
                                \n@version      0.2\n\n【非注册参数】\n发现未注册的字段参数，错误参数将无法进行添加到字段中！！！\n\n${fieldData.type}${fieldData.title}(${fieldData_parameter_textData})\n\n如有疑问可仔细查阅插件帮助文档，更多信息可联系作者！`);
                            fieldData_parameter_textData = "";
                        } else {
                            fieldData.parameter.push(outfieldData_parameter_textData);
                            fieldData_parameter_textData = "";
                        }
                    }
                } else {
                    if (InputData[textLengthIndex].match(/;/) || InputData[textLengthIndex].match(/；/)) {
                        let outfieldData_parameter_textData = ResolveFieldParameters(fieldData_parameter_textData);
                        if (outfieldData_parameter_textData.type == "非注册参数") {
                            alert(`Hello,欢迎使用【QingFlow Dragon King Super Tools】\n轻流QingFlow应用自动超级字段插件🐲\n\n@author       Mr.Dragon King
                                \n@version      0.2\n\n【非注册参数】\n发现未注册的字段参数，错误参数将无法进行添加到字段中！！！\n\n${fieldData.type}${fieldData.title}(${fieldData_parameter_textData})\n\n如有疑问可仔细查阅插件帮助文档，更多信息可联系作者！`);
                            fieldData_parameter_textData = "";
                        } else {
                            fieldData.parameter.push(outfieldData_parameter_textData);
                            fieldData_parameter_textData = "";
                        }
                    } else {
                        fieldData_parameter_textData = `${fieldData_parameter_textData}${InputData[textLengthIndex]}`;
                    }
                }
            }
        }

        if (textLengthIndex == InputData.length - 1) {
            console.log("字段校验完成判断是否存在fieldData数据...");
            if (fieldData.type.length != 0) {
                console.log("存在fieldData数据，添加到FieldAnalysisData");
                FieldAnalysisData.push(fieldData);
                console.log("添加到FieldAnalysisData完成");

            } else {
                console.log("不存在fieldData数据,添加到FieldAnalysisData");
            }
            //初始化值
            fieldData = {//字段数据
                type: "",//字段类型
                title: "",//字段标题
                parameter: [],//字段参数
            }
            fieldData_parameter_textData = "";//解析参数字段内容 二次解析内容
            console.log("【QingFlow Dragon King Super Tools】-->字段解析完成:", FieldAnalysisData);
            AddField(FieldAnalysisData);
        }
    }

}

//@解析字段参数算法ResolveFieldParameters
function ResolveFieldParameters(fieldData_parameter_textData) {
    fieldData_parameter_textData = fieldData_parameter_textData.replace(/\ +/g, "");
    fieldData_parameter_textData = fieldData_parameter_textData.replace(/[\r\n]/g, "");
    var fieldData_parameter = {
        type: "",//参数类型
    };//缓存字段参数
    switch (fieldData_parameter_textData) {
        case "必填": {
            fieldData_parameter.type = "必填";
        }
            break;
        case "二维码": {
            fieldData_parameter.type = "二维码";
        }
            break;
        case "条形码": {
            fieldData_parameter.type = "条形码";
        }
            break;
        case "不允许重复值": {
            fieldData_parameter.type = "不允许重复值";
        }
            break;
        case "金额￥": {
            fieldData_parameter.type = "金额￥";
        }
            break;
        case "金额$": {
            fieldData_parameter.type = "金额$";
        }
        case "不允许时间重叠": {
            fieldData_parameter.type = "不允许时间重叠";
        }
            break;
        case "年": {
            fieldData_parameter.type = "年";
        }
            break;
        case "年月": {
            fieldData_parameter.type = "年月";
        }
            break;
        case "年月日": {
            fieldData_parameter.type = "年月日";
        }
            break;
        case "年月日时分": {
            fieldData_parameter.type = "年月日时分";
        }
            break;
        case "年月日时分秒": {
            fieldData_parameter.type = "年月日时分秒";
        }
        case "固定电话": {
            fieldData_parameter.type = "年月日时分秒";
        }
            break;
        case "短信验证": {
            fieldData_parameter.type = "年月日时分秒";
        }
            break;
        default: {
            if (fieldData_parameter_textData.slice(1, 7) == "关联已有数据") {
                fieldData_parameter.type = "关联已有数据";
                var DataType = 1
                var AssociateExistingData = {
                    "app": "",
                    "field": "",
                }
                for (let index = 8; index < fieldData_parameter_textData.length; index++) {
                    if (DataType == 1) {
                        if (fieldData_parameter_textData[index] != "-") {
                            AssociateExistingData.app = `${AssociateExistingData.app}${fieldData_parameter_textData[index]}`
                        } else {
                            DataType = 2;
                        }
                    }
                    if (DataType == 2) {
                        if (fieldData_parameter_textData[index] != "/" && fieldData_parameter_textData[index] != "-") {
                            AssociateExistingData.field = `${AssociateExistingData.field}${fieldData_parameter_textData[index]}`
                        }
                    }

                }
                fieldData_parameter["AssociateExistingData"] = AssociateExistingData;


            } else {
                fieldData_parameter.type = "非注册参数";
            }
        }
    }
    return fieldData_parameter;
}


//=================================添加字段算法=================================
var fieldloopIndex = 0;
//@添加字段AddField
async function AddField(FieldAnalysisData) {
    switch (FieldAnalysisData[fieldloopIndex].type) {
        case "【单行文本】": {
            await Add_field_click(field_Textfield);//添加单行文本字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
            //设置字段参数
            for (let Parameter_index = 0; Parameter_index < FieldAnalysisData[fieldloopIndex].parameter.length; Parameter_index++) {
                if (FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].type == "关联已有数据") {
                    await ToggleDefault();//切换默认内容选择
                    await Choice_AssociateExistingData();//选择元素2-关联已有数据
                    await Choice_AssociateExistingData_App();//触发关联已有数据的应用
                    await Choice_AssociateExistingData_AppInput(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.app);//关联已有数据的应用名称输入
                    await Choice_AssociateExistingData_AppChoice(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.app);//关联已有数据的应用选择
                    await Choice_AssociateExistingData_Field();//触发关联已有数据的字段
                    await Choice_AssociateExistingData_FieldInput(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.field);//关联已有数据的字段名称输入
                    await Choice_AssociateExistingData_FieldChoice(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.field);//关联已有数据的字段选择
                } else {
                    await Textfield_Parameter(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index])
                }
            }
        }
            break;
        case "【多行文本】": {
            await Add_field_click(field_Textarea);//添加多行文本字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
            for (let Parameter_index = 0; Parameter_index < FieldAnalysisData[fieldloopIndex].parameter.length; Parameter_index++) {
                if (FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].type == "关联已有数据") {
                    await ToggleDefault();//切换默认内容选择
                    await Choice_AssociateExistingData();//选择元素2-关联已有数据
                    await Choice_AssociateExistingData_App();//触发关联已有数据的应用
                    await Choice_AssociateExistingData_AppInput(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.app);//关联已有数据的应用名称输入
                    await Choice_AssociateExistingData_AppChoice(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.app);//关联已有数据的应用选择
                    await Choice_AssociateExistingData_Field();//触发关联已有数据的字段
                    await Choice_AssociateExistingData_FieldInput(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.field);//关联已有数据的字段名称输入
                    await Choice_AssociateExistingData_FieldChoice(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index].AssociateExistingData.field);//关联已有数据的字段选择
                } else {
                    await Textarea_Parameter(FieldAnalysisData[fieldloopIndex].parameter[Parameter_index])
                }
            }
        }
            break;
        case "【数字】": {
            await Add_field_click(field_Number);//添加数字字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【链接】": {
            await Add_field_click(field_Link);//添加链接字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【日期】": {
            await Add_field_click(field_Date);//添加日期字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【起止时间】": {
            await Add_field_click(field_StartStopTime);//添加起止时间字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【电话】": {
            await Add_field_click(field_Phone);//添加电话字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【邮箱】": {
            await Add_field_click(field_Mailbox);//添加邮箱字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【单项选择】": {
            await Add_field_click(field_AloneChoice);//添加单项选择字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【下拉选择】": {
            await Add_field_click(field_DropDownChoice);//添加下拉选择字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【多项选择】": {
            await Add_field_click(field_MultipleChoice);//添加多项选择字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【图片选择】": {
            await Add_field_click(field_ImagesChoice);//添加图片选择字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break;
        case "【附件上传】": {
            await Add_field_click(field_FileUpload);//添加附件上传字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break
        case "【地址】": {
            await Add_field_click(field_Address);//添加地址字段
            await InputData(field_Title, FieldAnalysisData[fieldloopIndex].title);//设置字段标题
        }
            break
        default: {
            console.log("未注册字段", FieldAnalysisData[fieldloopIndex].type)
        }

    }

    fieldloopIndex = fieldloopIndex + 1;
    if (fieldloopIndex < FieldAnalysisData.length) {
        AddField(FieldAnalysisData)
    } else {
        fieldloopIndex = 0;
        //字段添加任务完完成进行消息推送
        if (MessagePushState == true) {
            MessagePush(QW_QrobotHook, "字段添加任务", "当前字段任务已经完成，请注意检查查看！")
        }
        setTimeout(() => {
            alert("【QingFlow Dragon King Super Tools】\n轻流QingFlow应用自动超级字段插件🐲\n字段批量添加任务已经完成😀")
        }, 1000)

    }
}
//===========================================================================================
//====================================方法事件【添加字段】===================================

//@添加字段方法 Add_field_click(field)
function Add_field_click(field) {
    return new Promise(resolve => {
        setTimeout(() => {
            $x(field)[0].click();
            resolve()//成功态
        }, 500)
    })
}
//===========================================================================================
//=================================方法事件【输入&输入结束】=================================
//@输入内容 InputData
function InputData(element, data) {
    return new Promise(resolve => {
        setTimeout(() => {
            $x(element)[0].value = data;
            InputEnd(element);
            resolve()//成功态
        }, 500)
    })
}

//@输入结束 InputEvent
function InputEnd(data) {
    return new Promise(resolve => {
        $x(data)[0].dispatchEvent(new InputEvent("input"));
        resolve()//成功态
    })
}
//===========================================================================================
//====================================字段参数===============================================
//=================================字段参数【单行文本参数】==================================
//@添加单行文本参数Textfield_Parameter
async function Textfield_Parameter(parameter) {
    return new Promise(resolve => {
        setTimeout(() => {
            switch (parameter.type) {
                case "必填": {
                    if ($x(fieldParameter_Required).length == 1) {
                        $x(fieldParameter_Required)[0].click()
                    }
                }
                    break;
                case "二维码": {
                    if ($x(fieldParameter_QRCode).length == 1) {
                        $x(fieldParameter_QRCode)[0].click()
                    }
                }
                    break;
                case "条形码": {
                    if ($x(fieldParameter_QRCode).length == 1) {
                        $x(fieldParameter_QRCode)[0].click()
                        setTimeout(() => {
                            if ($x(fieldParameter_BarCode).length == 1) {
                                $x(fieldParameter_BarCode)[0].click()
                            }
                        }, 200)
                    }
                }
                    break;
                case "不允许重复值": {
                    if ($x(fieldParameter_NotDuplicateValue).length == 1) {
                        $x(fieldParameter_NotDuplicateValue)[0].click()
                    }
                }
                    break;
                default: {
                    console.log("未注册字段参数")
                }
            }
            resolve()//成功态
        }, 500)
    })
}
//=================================字段参数【多行文本参数】=================================
//@添加多行文本参数Textarea_Parameter
async function Textarea_Parameter(parameter) {
    return new Promise(resolve => {
        setTimeout(() => {
            switch (parameter.type) {
                case "必填": {
                    $x("/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[1]/label")[0].click()
                }
                    break;
                case "不允许重复值": {
                    $x("/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[3]/qf-edit-area/div/qf-function-lock/div[3]/label")[0].click()
                }
                    break;
                default: {
                    console.log("未注册字段参数")
                }
            }
            resolve()//成功态
        }, 500)
    })
}
//=================================特殊参数【关联已有数据】=================================

//@切换默认 ToggleDefault
function ToggleDefault() {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                if ($x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-select/qf-select-top-control/qf-select-item`).length == 1) {
                    $x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-select/qf-select-top-control/qf-select-item`)[0].click();
                    openType = false;
                }
            }
            resolve()//成功态
        }, 200)
    })
}

//@切换关联已有数据 Choice_AssociateExistingData
function Choice_AssociateExistingData() {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                for (let index_1 = 0; index_1 < 99 && openType == true; index_1++) {
                    if ($x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item[2]`).length == 1) {
                        $x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item[2]`)[0].click();
                        openType = false;
                    }
                }
            }
            resolve()//成功态
        }, 200)
    })
}


//@触发关联已有数据的应用 Choice_AssociateExistingData_App
function Choice_AssociateExistingData_App() {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                if ($x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[1]/qf-select-top-control/div[1]/input`).length == 1) {
                    $x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[1]/qf-select-top-control/div[1]/input`)[0].click();
                    openType = false;
                }
            }
            resolve()//成功态
        }, 200)
    })
}

//@关联已有数据的应用名称输入 Choice_AssociateExistingData_AppInput
function Choice_AssociateExistingData_AppInput(appName) {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                if ($x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[1]/qf-select-top-control/div[1]/input`).length == 1) {
                    $x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[1]/qf-select-top-control/div[1]/input`)[0].value = appName;
                    InputEnd(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[1]/qf-select-top-control/div[1]/input`);
                    openType = false;
                }
            }
            resolve()//成功态
        }, 200)
    })
}


//@关联已有数据的应用选择 Choice_AssociateExistingData_AppChoice
function Choice_AssociateExistingData_AppChoice(appName) {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                for (let index_1 = 0; index_1 < 99 && openType == true; index_1++) {
                    if ($x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`).length > 0) {
                        for (let index_2 = 0; index_2 < $x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`).length; index_2++) {
                            let index_3 = index_2 + 1;
                            if ($x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item[${index_3}]/div`)[0].innerText == appName) {
                                $x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`)[`${index_2}`].click();
                                openType = false;
                            }
                        }
                    }
                }
            }
            resolve()//成功态
        }, 200)
    })
}

//@触发关联已有数据的字段 Choice_AssociateExistingData_Field
function Choice_AssociateExistingData_Field() {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                if ($x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[2]/qf-select-top-control/div[1]/input`).length == 1) {
                    $x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[2]/qf-select-top-control/div[1]/input`)[0].click();
                    openType = false;
                }
            }
            resolve()//成功态
        }, 200)
    })
}

//@关联已有数据的字段名称输入 Choice_AssociateExistingData_FieldInput
function Choice_AssociateExistingData_FieldInput(fieldName) {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                if ($x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[2]/qf-select-top-control/div[1]/input`).length == 1) {
                    $x(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[2]/qf-select-top-control/div[1]/input`)[0].value = fieldName;;
                    InputEnd(`/html/body/qf-root/qf-pages/qf-app-item/qf-creation/div/div[${index}]/qf-edit-area/div/qf-function-lock/qf-dft-val-edit/div/qf-function-lock/qf-dft-associate-data/div[1]/qf-select[2]/qf-select-top-control/div[1]/input`);
                    openType = false;
                }
            }
            resolve()//成功态
        }, 200)
    })
}


//@关联已有数据的字段选择Choice_AssociateExistingData_FieldChoice
function Choice_AssociateExistingData_FieldChoice(fieldName) {
    return new Promise(resolve => {
        setTimeout(() => {
            var openType = true
            for (let index = 0; index < 99 && openType == true; index++) {
                for (let index_1 = 0; index_1 < 99 && openType == true; index_1++) {
                    if ($x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`).length > 0) {
                        for (let index_2 = 0; index_2 < $x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`).length; index_2++) {
                            let index_3 = index_2 + 1;
                            if ($x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item[${index_3}]/div`)[0].innerText == fieldName) {
                                $x(`/html/body/div[${index}]/div[${index_1}]/div/qf-option-container/div[2]/cdk-virtual-scroll-viewport/div[1]/div/qf-option-item`)[`${index_2}`].click();
                                openType = false;
                            }
                        }
                    }
                }
            }
            resolve()//成功态
        }, 200)
    })
}
//=========================================================================================
//=======================================Excel字段导入【Excel】============================
$(function () {
    $(document).on("change", "#excel-file", function (e) {
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                }) // 以二进制流方式读取得到整份excel表格对象
                var persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    let FieldAnalysisData = EXCEL_FieldAnalysisData(workbook.Sheets[sheet])
                    console.log("【QingFlow Dragon King Super Tools】-->Excel字段导入解析完成:", FieldAnalysisData)
                    AddField(FieldAnalysisData);
                    break; // 如果只取第一张表，就取消注释这行
                }
            }
            var index = 0;
            for (var i in persons) {
                var prjid = persons[i].prjid;
                var parentid = persons[i].parentid;
                var subject = persons[i].subject;
                var hrmid = persons[i].hrmid;
                var begindate = persons[i].begindate;
                begindate = new Date(begindate).toLocaleDateString().replace(/\//g, '-');

                var enddate = persons[i].enddate;
                enddate = new Date(enddate).toLocaleDateString().replace(/\//g, '-');

                var actualbegindate = persons[i].actualbegindate;
                actualbegindate = new Date(actualbegindate).toLocaleDateString().replace(/\//g, '-');

                var actualenddate = persons[i].actualenddate;
                actualenddate = new Date(actualenddate).toLocaleDateString().replace(/\//g, '-');

                var stageid = persons[i].stageid;
                var finish = persons[i].finish;

            }
            //在控制台打印出来表格中的数据
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        console.log(files);
    });
});
function EXCEL_FieldAnalysisData(sheet) {
    const FieldAnalysisData = [];//解析结果
    /* sheet['!ref']表示所有单元格的范围，例如从A1到F8则记录为 A1:F8*/
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let C,
        R = range.s.r + 0 /* 从第一行开始 */
    /* 按列进行数据遍历 */
    for (C = range.s.c; C <= range.e.c; ++C) {
        /* 查找第一行中的单元格 */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        let title = 'UNKNOWN ' + C // <-- 进行默认值设置
        if (cell && cell.t) title = XLSX.utils.format_cell(cell)

        //格式化数据格式
        var fieldData_type = "【单行文本】";//默认字段类型
        var fieldData_parameter = [];//默认字段参数

        for (let index = 0; index < fieldData_type_testData.length; index++) {
            //let key = RegExp(fieldData_type_testData[index].RegExp)
            if (RegExp(fieldData_type_testData[index].RegExp).test(title)) {
                fieldData_type = fieldData_type_testData[index].fieldData_type;
                fieldData_parameter = fieldData_type_testData[index].fieldData_parameter;
            }
        }
        var fieldData = {//字段数据
            type: fieldData_type,//字段类型
            title: title,//字段标题
            parameter: fieldData_parameter,//字段参数
        }
        FieldAnalysisData.push(fieldData)
    }
    return FieldAnalysisData
};
//===========================================================================
//=======================================消息推送============================
/**
 * 企业微信提醒推送功能
 * 功能已经下线，请勿再次操作
 * @param {*} QW_QrobotHook
 * @param {*} title
 * @param {*} quote_text
 */
function MessagePush(QW_QrobotHook, title, quote_text) {
    // var data = {
    //     QW_QrobotHook: QW_QrobotHook,
    //     title: title,
    //     quote_text: quote_text
    // };
    // GM_xmlhttpRequest({
    //     method: "post",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     url: "",
    //     data: JSON.stringify(data),
    //     onload: function (res) {
    //         // code
    //         console.log("返回", res);
    //     }
    // });
}
//===========================================================================

//===========================================================================


/**
 * 悬浮动画
 */
function floatingAnimation() {
    if (floatingAnimationOpen) {
        switch (floatingAnimationTypeID) {
            case "custom": {
                //小猫咪
                // 创建并插入 sakana-widget 容器
                var sakanaWidgetDiv = document.createElement('div');
                sakanaWidgetDiv.id = 'sakana-widget';
                sakanaWidgetDiv.style.position = 'fixed';
                sakanaWidgetDiv.style.right = '0px';
                sakanaWidgetDiv.style.bottom = '0px';
                document.body.appendChild(sakanaWidgetDiv);

                // 定义 initSakanaWidget 函数
                function initSakanaWidget() {
                    const demo = SakanaWidget.getCharacter('chisato');
                    demo.initialState = {
                        ...demo.initialState,
                        i: 0.001,
                        d: 1,
                        autoFit: true,
                    };
                    demo.image = floatingAnimationCustom;
                    SakanaWidget.registerCharacter('demo', demo);
                    new SakanaWidget({ character: 'demo' }).mount('#sakana-widget');
                }

                // 创建并插入第一个 script 元素
                var script1 = document.createElement('script');
                script1.textContent = '(' + initSakanaWidget.toString() + ')();';
                document.body.appendChild(script1);

                // 创建并插入第二个 script 元素
                var script2 = document.createElement('script');
                script2.async = true;
                script2.onload = initSakanaWidget;
                script2.src = 'https://cdn.jsdelivr.net/npm/sakana-widget@2.3.1/lib/sakana.min.js';
                document.body.appendChild(script2);

                break;
            }
            case "1000": {
                //默认
                // 创建并插入 sakana-widget 容器
                var sakanaWidgetDiv = document.createElement('div');
                sakanaWidgetDiv.id = 'sakana-widget';
                sakanaWidgetDiv.style.position = 'fixed';
                sakanaWidgetDiv.style.right = '0px';
                sakanaWidgetDiv.style.bottom = '0px';
                document.body.appendChild(sakanaWidgetDiv);

                // 定义 initSakanaWidget 函数
                function initSakanaWidget() {
                    new SakanaWidget().mount('#sakana-widget');
                }

                // 创建并插入第一个 script 元素
                var script1 = document.createElement('script');
                script1.textContent = '(' + initSakanaWidget.toString() + ')();';
                document.body.appendChild(script1);

                // 创建并插入第二个 script 元素
                var script2 = document.createElement('script');
                script2.async = true;
                script2.onload = initSakanaWidget;
                script2.src = 'https://cdn.jsdelivr.net/npm/sakana-widget@2.3.1/lib/sakana.min.js';
                document.body.appendChild(script2);


                break;
            }
            case "1001": {
                //小猫咪
                // 创建并插入 sakana-widget 容器
                var sakanaWidgetDiv = document.createElement('div');
                sakanaWidgetDiv.id = 'sakana-widget';
                sakanaWidgetDiv.style.position = 'fixed';
                sakanaWidgetDiv.style.right = '0px';
                sakanaWidgetDiv.style.bottom = '0px';
                document.body.appendChild(sakanaWidgetDiv);

                // 定义 initSakanaWidget 函数
                function initSakanaWidget() {
                    const demo = SakanaWidget.getCharacter('chisato');
                    demo.initialState = {
                        ...demo.initialState,
                        i: 0.001,
                        d: 1,
                        autoFit: true,
                    };
                    demo.image = 'https://wimg.588ku.com/gif620/20/06/11/7178bce8465bb5ecbd78a6a516fef0e7.gif';
                    SakanaWidget.registerCharacter('demo', demo);
                    new SakanaWidget({ character: 'demo' }).mount('#sakana-widget');
                }

                // 创建并插入第一个 script 元素
                var script1 = document.createElement('script');
                script1.textContent = '(' + initSakanaWidget.toString() + ')();';
                document.body.appendChild(script1);

                // 创建并插入第二个 script 元素
                var script2 = document.createElement('script');
                script2.async = true;
                script2.onload = initSakanaWidget;
                script2.src = 'https://cdn.jsdelivr.net/npm/sakana-widget@2.3.1/lib/sakana.min.js';
                document.body.appendChild(script2);

                break;
            }
        }
    }
}

//===========================================================================
//帮助引导
function HelpGuide() {

    document.addEventListener('mousemove', function (event) {
        var target = event.target;
        if (target !== document.body) {
            target.style.border = '2px solid red';
        }
    });

    document.addEventListener('mouseout', function (event) {
        var target = event.target;
        if (target !== document.body) {
            target.style.border = '';
        }
    });

    document.addEventListener('click', function (event) {
        var target = event.target;
        var xpath = getXPath(target);
        console.log(xpath);
    });
    function getXPath(element) {
        var xpath = '';
        while (element !== document.body) {
            var nodeName = element.nodeName.toLowerCase();
            var index = 1;
            var sibling = element.previousSibling;
            while (sibling) {
                if (sibling.nodeName.toLowerCase() == nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            xpath = '/' + nodeName + '[' + index + ']' + xpath;
            element = element.parentNode;
        }
        xpath = '//' + xpath;
        return xpath;
    }
}






