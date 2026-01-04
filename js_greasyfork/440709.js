// ==UserScript==
// @name         MC方便B端系统发版的快捷小工具
// @version      0.3.15.1
// @description  支持批量打开 blushMark商城和uwp和suwp子系统的jenkins与gitlab, 也支持空格批量打开多个单系统dap scm...的jenkins/gitlab
// @author       mrzou
// @match        https://bl-sc-pms-t-1.digi800.com/#/index
// @icon         https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80
// @include      *://bl-**.digi800.com/*
// @include      **.digi800.com/*
// @include      **.blushmark.com/*
// @include      **.dolmi.com/*
// @include      http://localhost**
// @include      http://**.**.**.**:**/**
// @exclude      *://j.opsfun.com/*
// @exclude      *://jenkins.opsfun.com/*
// @exclude      *://axure.**.**/*
// @exclude      *://jira.**.**/*
// @exclude      *://wiki.**.**/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @grant        none
// @run-at document-end


// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/440709/MC%E6%96%B9%E4%BE%BFB%E7%AB%AF%E7%B3%BB%E7%BB%9F%E5%8F%91%E7%89%88%E7%9A%84%E5%BF%AB%E6%8D%B7%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440709/MC%E6%96%B9%E4%BE%BFB%E7%AB%AF%E7%B3%BB%E7%BB%9F%E5%8F%91%E7%89%88%E7%9A%84%E5%BF%AB%E6%8D%B7%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  setTimeout(function () {
    $(function () {
      function getHtml() {
        var isHide = localStorage.getItem("monkey-plugin-hide")
        var style = `
              <style>
                  .monkey-plugin-warp{
                    width: 250px;height: auto;background: rgba(0,0,0,0.3);
                    font-size: 14px;color: #333;text-align: center;position: fixed;z-index: 9999999999;
                    top: 10%;right: 10%;marin: 0;padding: 0;user-select: none;transition: all 0.3s;
                  }
                  .monkey-plugin-tips{
                    color: green;text-align:left;display:block;
                  }
                  .monkey-plugin-warp.close{
                    top: 0;right: 0;width: 0;height: 0;
                  }
                  .monkey-plugin-warp ul {
                    list-style: none;text-align: left;margin: 0;padding: 0 0 5px 0;
                    display: flex;flex-wrap: wrap;align-items: center;
                  }
                  .monkey-plugin-warp ul button {
                    padding: 2px;margin: 5px 5px 0;cursor: pointer;background: #fff;
                    border: 1px solid #333;border-radius: 0;
                  }
                  .monkey-plugin-warp input{
                    marin: 0;padding: 0;width: 100%;border: 1px solid #333;
                    box-sizing:  border-box;outline: none;text-indent: 12px;
                  }
                  .monkey-plugin-close, .monkey-plugin-entry{
                    position: absolute;top: -5px;right: -5px;width: 16px;height: 16px;
                    text-align: center;line-height: 16px;background: yellow;border-radius: 16px;
                    border: 1px solid red;color: red;cursor: pointer;
                  }
                  .monkey-plugin-entry{
                    top: 0;right: 0;width: 14px;height: 14px;display:flex;align-items:center;justify-content: center;
                    opacity: 0.3;
                  }
                  .monkey-plugin-warp ul span {display:flex;align-items:flex-end;}
                  .monkey-plugin-warp ul span button {margin-right:0;border-right:0;min-width:45px;height:25px;}
                  .monkey-plugin-warp ul span input {width:40px;height:25px;text-indent:0;text-align:center;font-size:12px;}
                  .monkey-plugin-warp ul p {margin: 8px 0 3px;padding:0;width:100%;text-indent:8px;font-size:14px;color:green;}
              </style>
              `
        return (
          style +
          `<div class="monkey-plugin-warp ${isHide ? "close" : ""}">
          <span class="monkey-plugin-close ${
            isHide ? "monkey-plugin-entry" : ""
          }">
          ${isHide ? "o" : "X"}  
          </span>
          <i class="monkey-plugin-tips">
            suwp-a/uwp-a为子系统批量操作<br/>支持空格批量<br/>dap scm pc m rv riven-m...
            <i 
              style="font-size: 20px;font-weight: bold;color:red;"
              title="rv pc m riven-pc riven-m suwp-a uwp-a uwp suwp scm dap plm dms pms dms qms mms splm mps smms"
            >?</i>
          </i>
          <input class="monkey-plugin-input" value="rv" placeholder="suwp-a/uwp-a(默认)/单(多)个系统名" />
          <ul>
          
            <button val="dev">开发jenkins</button>
            <button val="test">测试jenkins</button>
            <button val="pre">预发布jenkins</button>
            <button val="prod">正式jenkins</button>
            <button val="gitlab">gitlab发master</button>

            <p>线上预览地址</p>
            <span><button val="kfpage">开发</button><input value="1" placeholder="env id"/></span>
            <span><button val="cspage">测试</button><input value="1" placeholder="env id"/></span>
            <span><button val="yfbpage">预发布</button><input value="1" placeholder="env id"/></span>
            <span><button val="zspage">正式</button></span>
          </ul>
        </div>
      </div>`
        )
      }

      function handler(type, target) {
        const uwpSystems = [
          "bl-pms-front-end",
          "bl-dap-front-end",
          "bl-plm-front-end",
          "bl-dms-front-end",
          "bl-qms-front-end",
          "bl-mms-front-end",
          "bl-uwp-front-end",
          "bl-fms-front-end",
        ]
        const suwpSystems = [
          "bl-suwp-front-end",
          "bl-mps-front-end",
          "bl-splm-front-end",
          "bl-smms-front-end",
        ]

        const JenkinsBase = "https://jenkins.opsfun.com/job/"
        const gitlabBlBase = "https://git.opsfun.com/bl_supply_chain/"
        const gtilabBlBase02 = "https://git.opsfun.com/bl-backend/"
        const gtilabBlBase03 = "https://git.opsfun.com/blushmark-front/"
        const gitlabBlBaseFms = "https://git.opsfun.com/bl-finance/"

        const buttonIptVal = $(target).attr("val")
        const isGitlab = buttonIptVal.includes("gitlab")
        const isProd = buttonIptVal.includes("prod")
        const isPre = buttonIptVal.includes("pre")
        const isPage = buttonIptVal.includes("page")
        const isTest = buttonIptVal.includes("test")

        // var isNoSupportPreAndPage = isPre || isPage

        function searchSystem(systems, type) {
          var system = systems.filter((item) => item.includes(`-${type}-`))
          if (!system.length) {
            console.log(`%c油猴插件提示：没有此系统${type}`, "color:#fd6327")
          }
          return system || []
        }
        function jenkins(systems, systemType) {
          if (isPre) return alert("暂不支持此系统")

          var prod = buttonIptVal.includes("prod")
          systems = systemType ? searchSystem(systems, systemType) : systems
          systems
            .map((item) => {
              return (
                JenkinsBase +
                item +
                (prod ? "-prod" : isTest ? "-test" : "-dev") +
                "/build?delay=0sec"
              )
            })
            .forEach((u) => window.open(u))
        }

        function getGitlabBase(item) {
          const base = item.includes("fms") ? gitlabBlBaseFms : gitlabBlBase
          return base + item
        }

        function gitLab(systems, systemType) {
          //return gitlabBlBase + item + '/compare/master...feature/qingyun/6666_layout'
          systems = systemType ? searchSystem(systems, systemType) : systems
          systems
            .map((item) => getGitlabBase(item) + "/compare/master...master")
            .forEach((u) => window.open(u))
        }

        // 获取riven商城的jenkins
        function getRivenJkOrWh(clientType = "riven-pc", isD = false) {
          // git仓库合并
          const gitMerge = isD
            ? "https://git.opsfun.com/dolmi-front/dolmi-riven/compare/develop...develop"
            : gtilabBlBase03 + "riven-blush-mark/compare/develop...develop"

          const envNum = $(target).parent().find("input").val() || 1
          const yfbNum = envNum > 1 ? envNum : ""
          // 打印 2、3 环境的登录用户帐号
          console.log("%cname: lebbay\npassword: passw0rd", "color: green")

          // jenkins
          const jenkins = {
            "riven-pc": {
              test: "https://j.opsfun.com/view/BM-FT/job/BL-riven-pc-test.dev/build?delay=0sec",
              pre: "https://j.opsfun.com/view/BL-M/job/BL-PC-P-qa-prod.dev/build?delay=0sec",
              prod: "https://j.opsfun.com/view/BL-PC/job/BL-PC-Switch-qa-prod.dev/build?delay=0sec",
              cspage: `https://ft${envNum}-us.blushmark.com/`,
              yfbpage: `https://p${yfbNum}-us.blushmark.com/`,
              zspage: `https://us.blushmark.com/`,
            },
            "riven-m": {
              test: "https://j.opsfun.com/view/BM-FT/job/BL-riven-m-test.dev/build?delay=0sec",
              pre: "https://j.opsfun.com/view/BL-M/job/BL-M-P-qa-prod.dev/build?delay=0sec",
              prod: "https://j.opsfun.com/view/BL-M/job/BL-M-Switch-qa-prod.dev/build?delay=0sec",
              cspage: `https://mt${envNum}.blushmark.com/us/`,
              yfbpage: `https://mp${yfbNum}.blushmark.com/us/`,
              zspage: `https://m.blushmark.com/us/`,
            },
            "riven-m-d": {
              test: "https://jenkins.opsfun.com/view/DM-FT/job/DM-riven-m-test/build?delay=0sec",
              cspage: `https://mt${envNum}.dolmi.com/us`,
            },
            "riven-pc-d": {
              test: "https://jenkins.opsfun.com/view/DM-FT/job/DM-riven-pc-test/build?delay=0sec",
              cspage: `https://ft${envNum}-us.dolmi.com/`,
            },
          }
          const URL = isGitlab ? gitMerge : jenkins[clientType][buttonIptVal]

          console.log(`%c跳转地址: ${URL}`, "color:#fd6327")
          return URL
        }

        function OpenUwpPageView(type) {
          const Config = {
            fms: {
              kfpage: "https://fms-dev-1.digi800.com/",
              cspage: "https://fms-test-1.digi800.com/",
              yfbpage: "",
              zspage: "https://bl-fms.digi800.com/",
            },
            dap: {
              cspage: "https://bl-sc-dap-t-1.digi800.com/",
              yfbpage: "https://bl-dap-p.digi800.com/",
              zspage: "https://bl-dap.digi800.com/",
            },
            pms: {
              cspage: "http://mp-t-1.opsfun.com/web/pms/#/",
              yfbpage: "http://mp-p.opsfun.com/web/pms/#/",
              zspage: "https://mp.opsfun.com/web/pms/#/",
            },
            plm: {
              kfpage: "https://dev-bl-sc-plm.digi800.com/",
              cspage: "https://bl-sc-plm-t-1.digi800.com/",
              yfbpage: "",
              zspage: "https://bl-plm.digi800.com/",
            },
            dms: {
              kfpage: "https://dev-bl-sc-front.digi800.com/",
              cspage: "https://bl-sc-front-t-1.digi800.com/",
              yfbpage: "https://bl-dms-p.digi800.com/",
              zspage: "https://bl-dms.digi800.com/",
            },
            qms: {
              kfpage: "https://dev-bl-sc-qms.digi800.com/",
              cspage: "https://bl-sc-qms-t-1.digi800.com/",
              yfbpage: "",
              zspage: "https://bl-qms.digi800.com/",
            },
            mms: {
              kfpage: "https://dev-bl-sc-mms.digi800.com/",
              cspage: "https://bl-sc-mms-t-1.digi800.com/",
              yfbpage: "",
              zspage: "https://bl-mms.digi800.com/",
            },
            uwp: {
              kfpage: "https://dev-bl-sc-uwp.digi800.com/",
              cspage: "https://bl-sc-uwp-t-1.digi800.com/",
              yfbpage: "https://bl-uwp-p.digi800.com/",
              zspage: "https://bl-uwp.digi800.com/",
            },
            mps: {
              kfpage: "https://dev-bl-sc-mps.digi800.com/",
              cspage: "https://bl-sc-mps-t-1.digi800.com/",
              yfbpage: "https://bl-bmps-p.digi800.com/",
              zspage: "https://bl-bmps.digi800.com/",
            },
          }
          const vUrl = Config[type] && Config[type][buttonIptVal]
          vUrl ? window.open(vUrl) : alert("暂不支持")
        }

        switch (type) {
          case "uwp-a":
            isGitlab ? gitLab(uwpSystems) : jenkins(uwpSystems)
            break
          case "suwp-a":
            isGitlab ? gitLab(suwpSystems) : jenkins(suwpSystems)
            break
          case "cx":
            const cxjKbaseurl = "https://jenkins.opsfun.com/view/"
            const cxGitlabUrl =
              gtilabBlBase03 + "promotion-dashboard/compare/develop...develop"
            const cxJenkinUrl = isProd
              ? "bl-prod-us/job/promotion-dashboard-us-prod/"
              : isPre
              ? "bl-pre-us/job/promotion-dashboard-us-pre/"
              : "bl-test-us/job/promotion-dashboard-us-test/"

            const cxViewConf = {
              cspage: "http://mp-t-1.opsfun.com/web/promotion/#/",
              yfbpage: "http://mp-p.opsfun.com/web/promotion/#/",
              zspage: "https://mp.opsfun.com/web/promotion/#/",
            }

            if (isPage) {
              const vUrl = cxViewConf[buttonIptVal]
              vUrl ? window.open(vUrl) : alert("暂不支持")
            } else {
              window.open(isGitlab ? cxGitlabUrl : cxjKbaseurl + cxJenkinUrl)
            }
            break
          case "legao":
            const legaojKbaseurl = "https://j.opsfun.com/view/"
            const legaoGitlabUrl =
              gtilabBlBase03 +
              "blush-mark-lego-dashboard/compare/develop...develop"
            const legaoJenkinUrl = isProd
              ? "BM-PROD/job/BL-lego-web-qa-prod.dev/"
              : isPre
              ? "BM-PROD/job/BL-lego-web-qa-pre.dev/"
              : "BM-FT/job/BL-lego-web-test.dev/"

            const legaoViewConf = {
              cspage: "https://lego-t-1.blushmark.com/#/",
              yfbpage: "https://lego-pre.nukaka.com/#/",
              zspage: "https://lego.nukaka.com/#/",
            }

            if (isPage) {
              const vUrl = legaoViewConf[buttonIptVal]
              vUrl ? window.open(vUrl) : alert("暂不支持")
              console.log(
                "%c测试环境账号： yzhang 密码：lb123456",
                "color: green"
              )
            } else {
              window.open(
                isGitlab ? legaoGitlabUrl : legaojKbaseurl + legaoJenkinUrl
              )
            }
            break
          case "pangu":
            const pgjKbaseurl = "https://j.opsfun.com/view/BL-PG/job/"
            const pgGitlabUrl =
              gtilabBlBase02 + "pangu-web/compare/master...master"
            const pgJenkinUrl = isProd
              ? "BL-PG-WEB-qa-prod.dev/"
              : isPre
              ? "BL-PG-WEB-qa-pre.dev/"
              : "BL-PG-WEB-new-test.dev/"

            const pgViewConf = {
              cspage: "http://ft.bl-pangu.opsfun.com/#/dashboard",
              yfbpage: "",
              zspage: "https://pangu.opsfun.com/#/dashboard",
            }

            if (isPage) {
              const vUrl = pgViewConf[buttonIptVal]
              vUrl ? window.open(vUrl) : alert("暂不支持")
            } else {
              window.open(isGitlab ? pgGitlabUrl : pgjKbaseurl + pgJenkinUrl)
            }
            break
          case "scm":
            // scm有差异得专门处理
            const gitlabUrl = gtilabBlBase02 + "scm/compare/master...master"
            const jenkinUrl = isProd
              ? "https://j.opsfun.com/job/BL-SCM-web-qa-prod.dev/build?delay=0sec"
              : "https://j.opsfun.com/view/BL-SCM/job/BL-SCM-web-new-test.dev/build?delay=0sec"

            const scmViewConf = {
              cspage: "https://blscm-test2.digi800.com/#/style",
              yfbpage: "",
              zspage: "https://blscm.digi800.com/#/style",
            }

            if (isPage) {
              const vUrl = scmViewConf[buttonIptVal]
              vUrl ? window.open(vUrl) : alert("暂不支持")
            } else {
              window.open(isGitlab ? gitlabUrl : jenkinUrl)
            }
            break
          case "riven-pc":
          case "riven-m":
          case "m":
          case "pc":
            type == "m" && (type = "riven-m")
            type == "pc" && (type = "riven-pc")
            // blushmark 商城专门处理
            const rvPageurl = getRivenJkOrWh(type)
            !rvPageurl ? alert("暂不支持此项目") : window.open(rvPageurl)
            break
          case "rv":
            // blushmark 简写处理
            const rvpcPageurl = getRivenJkOrWh("riven-pc")
            const rvmPageurl = getRivenJkOrWh("riven-m")
            rvpcPageurl && window.open(rvpcPageurl)
            rvmPageurl && window.open(rvmPageurl)
            !rvpcPageurl && !rvmPageurl && alert("暂不支持此项目")
            break
          case "riven-pc-d":
          case "riven-m-d":
          case "m-d":
          case "pc-d":
            type == "m-d" && (type = "riven-m-d")
            type == "pc-d" && (type = "riven-pc-d")
            // blushmark 商城专门处理
            const rvPageurlD = getRivenJkOrWh(type, true)
            !rvPageurlD ? alert("暂不支持此项目") : window.open(rvPageurlD)
            break
          case "rv-d":
            // blushmark 简写处理
            const rvpcPageurlD = getRivenJkOrWh("riven-pc-d", true)
            const rvmPageurlD = getRivenJkOrWh("riven-m-d", true)
            rvpcPageurlD && window.open(rvpcPageurlD)
            rvmPageurlD && window.open(rvmPageurlD)
            !rvpcPageurlD && !rvmPageurlD && alert("暂不支持此项目")
            break
          default:
            if (isPage) {
              OpenUwpPageView(type)
            } else {
              const Sys = [...uwpSystems, ...suwpSystems]
              isGitlab ? gitLab(Sys, type) : jenkins(Sys, type)
            }
            break
        }
      }
      $("body").append(getHtml())
      $(".monkey-plugin-warp ul button").on("click", function () {
        var inputs = ($(".monkey-plugin-input").val() || "uwp-a")
          .trim()
          .toLocaleLowerCase()
          .split(" ")
          .filter((v) => v)
        inputs.forEach((type) => handler(type, this))
      })
      $(".monkey-plugin-close").on("click", function () {
        var self = $(this)
        if (self.hasClass("monkey-plugin-entry")) {
          $(".monkey-plugin-warp")
            .removeClass("close")
            .on("transitionend", function () {
              localStorage.removeItem("monkey-plugin-hide")
              self.removeClass("monkey-plugin-entry").text("X")
            })
        } else {
          $(".monkey-plugin-warp")
            .addClass("close")
            .on("transitionend", function () {
              localStorage.setItem("monkey-plugin-hide", 1)
              self.addClass("monkey-plugin-entry").text("o")
            })
        }
      })
    })
  }, 1000)
})()
