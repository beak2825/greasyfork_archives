// ==UserScript==
// @name        simple_tool
// @namespace   simpletools
// @match       https://command-center.aws.a2z.org.cn/case-console?CSGroupId*
// @icon        https://visioguy.github.io/IconSets/aws/icons/aws_cloud.png
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js
// @resource css https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.2
// @author      zhaojiew
// @description short link of tools
// @downloadURL https://update.greasyfork.org/scripts/488652/simple_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/488652/simple_tool.meta.js
// ==/UserScript==

(() => {

    //参考资料 https://swisnl.github.io/jQuery-contextMenu/demo/sub-menus.html
    //增加左侧按钮，自定义菜单，可定制实现功能，资料👆
    //增加快捷键触发，alt+w


    'use strict';
    //添加按钮
    var simpletool = $(`<button id='simpletool' type='submit'>
                          <awsui-icon class='awsui-button-icon awsui-button-icon-left' initialized='true'>
                            <span class='awsui-icon awsui-icon-size-normal awsui-icon-variant-normal'>🍀</span>
                          </awsui-icon>
                        </button>`)
    simpletool.css({
        "position": "fixed",
        "bottom": "50%",
        "left": "0px",
        "width": "40px",
        "height": "80px",
        "z-index": "9999",
        "cursor": "pointer",
        "border": "0px"
    });

    function opentab(url) {
        console.log("open->" + url)
        GM_openInTab(url);
    }
    //添加菜单
    $.contextMenu({
        selector: "#simpletool",
        callback: function (key, options) {
            GM_setValue("account", $("div[data-test=account-id]").text())
            GM_setValue("caseid", $("div[data-test=case-id]").text())
            console.log(key)
            switch (key) {
                case "eks":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/dashboardv2/?accountId=" + GM_getValue("account") + "&toolName=ChronosEKS-TSC&caseId=" + GM_getValue("caseid") + "&displayName=EKS&chronosRoutePath=listClusters&chronosRouteParam=cn-north-1%2C" + GM_getValue("account") + "%2C");
                    break;
                case "ecs":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/dashboardv2/?accountId=" + GM_getValue("account") + "&toolName=ChronosECS-TSC&caseId=" + GM_getValue("caseid") + "&displayName=ECS&chronosRoutePath=listClusters&chronosRouteParam=cn-north-1%2C" + GM_getValue("account") );
                    break;
                case "codebuild":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/dashboardv2/?accountId=" + GM_getValue("account") + "&toolName=ChronosCodeBuild-TSC&caseId=" + GM_getValue("caseid") + "&displayName=CB")
                    break;
                case "codedeploy":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/script-runner/Dante-CodeDeploy-Dashboard_contributionmodelasset_Dante-CodeDeploy-Dashboard/run?_inputParameters=%7B%22accountId%22%3A%22" + GM_getValue("account") + "%22%2C%22region%22%3A%5B%22cn-north-1%22%5D%7D&accountId=" + GM_getValue("account") + "&region=cn-north-1")
                    break;
                case "codepipeline":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting?CSGroupId=7d4d46a5-022d-4dd7-86be-16c663a1c5a7#/script-runner/Dante-CodePipeline-Dashboard_contributionmodelasset_Dante-Codepipeline-Dashboard/run?_inputParameters=%7B%22region%22%3A%5B%22cn-north-1%22%2C%22cn-northwest-1%22%5D%2C%22pipelineName%22%3A%22%22%2C%22accountIds%22%3A%5B%22" + GM_getValue("account") + "%22%5D%7D&region=cn-north-1")
                    break;
                case "cfn":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/dashboardv2/?accountId=" + GM_getValue("account") + "&toolName=ChronosCFNv2-TSC&caseId=" + GM_getValue("caseid") + "&displayName=CFN-Dash&chronosRoutePath=listStacks")
                    break;
                case "trail":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting?CSGroupId=18140fff-24b6-4788-adff-925d72621fd4#/script-runner/K2-cloudtrail_contributionmodelasset_Dante-curated-cloudtrail/run?_inputParameters=%7B%22region%22%3A%5B%22cn-north-1%22%5D%2C%22customerEntity%22%3A%22"+GM_getValue("account")+"%22%2C%22DateAndTimeRange%22%3Anull%2C%22isRegex%22%3Afalse%2C%22searchLength%22%3A%7B%22label%22%3A%2215_seconds%22%2C%22id%22%3A%2215_seconds%22%2C%22value%22%3A%2215_seconds%22%7D%2C%22attributeKey%22%3A%7B%7D%2C%22filterOptions%22%3A%5Bfalse%2Cfalse%2Ctrue%5D%7D&region=cn-north-1")
                    break;
                case "emr":
                    opentab("https://aegir.bjs.aws-border.cn/JobFlowListForAccount?accountId="+ GM_getValue("account"))
                    break;
                case "glue":
                    opentab("https://glue-jesops-prod-cn-north-1.bjs.aws-border.cn/")
                    break;
                case "glue_home":
                    opentab("https://command-center.aws.a2z.org.cn/troubleshooting#/script-runner/Dante-GlueJobAnalyzer_contributionmodelasset_Glue/run?_inputParameters=%7B%22accountId%22%3A%5B%22"+GM_getValue("account")+"%22%5D%2C%22region%22%3A%5B%22cn-north-1%22%5D%2C%22maxPages%22%3A%2210%22%7D&"+GM_getValue("account")+"&region=cn-north-1")
                    break;
            }
        },
        items: {
            "emr": { name: "emr"},
            "glue": {
                name: "glue",
                icon: "fa-solid fa-circle-nodes",
                items: {
                    "glue": { name: "glue" },
                   "glue_home": { name: "glue_home" },
                }
            },
            "sep0": "---------",
            "eks": { name: "eks"},
            "ecs": { name: "ecs"},
            "sep1": "---------",
            "cfn": { name: 'cfn'},
            "sep2": "---------",
            "codebuild": { name: "codebuild" },
            "codedeploy": { name: "codedeploy" },
            "codepipeline": { name: "codepipeline" },
            "sep3": "---------",
            "trail": { name: "trail" },
        }
    });


    //添加快捷键
    hotkeys('alt+w', function () {
      $("#simpletool").contextmenu()
    });
    GM_addStyle(GM_getResourceText("css"));

    setTimeout(() => {
        $(document.body).append(simpletool);
    }, 2000)

})();