// ==UserScript==
// @name        开水摸鱼
// @description 用于开水公司RD节省时间用于摸鱼的小工具
// @namespace   https://github.com/helloworlde/mt-dev-tools
// @version     1.0.30
// @author      helloworlde
// @include     *://*.mws.sankuai.com/*
// @include     *://logcenter.data.sankuai.com/*
// @license     MIT License
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427752/%E5%BC%80%E6%B0%B4%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/427752/%E5%BC%80%E6%B0%B4%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function determineWebsite() {
      var website;
      var location = window.location.href;

      if (location.indexOf("logcenter.data.sankuai.com") > -1) {
        website = "log";
      } else if (location.indexOf("raptor.mws.sankuai.com") > -1 || location.indexOf("raptor-st.mws.sankuai.com") || location.indexOf("raptor-test.mws.sankuai.com")) {
        website = "raptor";
      }

      return website;
    }

    function enhanceLogTraceId() {
      var pres = document.getElementsByTagName("pre");

      if (pres === undefined || pres.length === 0) {
        return undefined;
      }

      for (var i = 0; i < pres.length; i++) {
        var present = pres[i];
        var content = present.innerText;

        if (content !== undefined && content !== "") {
          var traceId = content.trim();

          if (traceRegex.test(traceId)) {
            var href = determineMtraceLink("prod");
            href = href.replaceAll("$TRACE_ID", traceId);
            var link = document.createElement("a");
            link.innerText = content.trim();
            link.href = href;
            link.target = "_blank";
            present.parentNode.replaceChild(link, present);
          }
        }
      }
    }

    function enhanceLogCenter(location) {
      console.log("增强 LogCenter");
      var checkboxs = document.getElementsByName("field");

      if (checkboxs === undefined || checkboxs.length === 0) {
        return undefined;
      }

      checkboxs.forEach(function (checkbox) {
        checkbox.addEventListener("change", function (e) {
          if (checkbox.checked) {
            switch (checkbox.value) {
              case "traceId__":
                enhanceLogTraceId();
                break;
            }
          }
        });
      });
    }

    setTimeout(function () {
      var location = window.location.href;
      var website = determineWebsite();

      switch (website) {
        case "raptor":
          enhanceRaptor(location);
          break;

        case "log":
          enhanceLogCenter();
          break;
      }
    }, 5000);
    var traceRegex = new RegExp("^[-]?\\d{18,20}$");
    var appkeyRegex = new RegExp("^com.sankuai.[a-z]+.[a-z]+$");
    var appkeyRegex2 = new RegExp("^com.sankuai.[a-z]+.[a-z]+.[a-z]+$");
    var ipRegex = new RegExp("^\\d+.\\d+.\\d+.\\d+$");

    function determineContentType(content) {
      if (content === undefined || content.trim() === "") {
        return undefined;
      }

      content = content.trim();

      if (traceRegex.test(content) || content.indexOf("traceId=") > -1) {
        return "trace";
      } else if (appkeyRegex.test(content) || appkeyRegex2.test(content)) {
        return "appkey";
      } else if (ipRegex.test(content)) {
        return "ip";
      }

      return undefined;
    }

    function determineOctoLink(env) {
      var link;

      switch (env) {
        case "prod":
          link = "https://octo.mws.sankuai.com/service-provider-info?appkey=$APPKEY&env=prod&type=thrift";
          break;

        case "staging":
          link = "https://octo.mws.sankuai.com/service-provider-info?appkey=$APPKEY&env=staging&type=thrift";
          break;

        case "test":
          link = "https://octo.mws-test.sankuai.com/service-provider-info?appkey=$APPKEY&env=test&type=thrift";
          break;

        default:
          link = undefined;
          break;
      }

      return link;
    }

    function determineRaptorLink(env) {
      var link;

      switch (env) {
        case "prod":
          link = "https://raptor.mws.sankuai.com/application/problem?startDate=$START_DATE&endDate=$END_DATE&domain=$APPKEY";
          break;

        case "staging":
          link = "https://raptor-st.mws.sankuai.com/application/problem?startDate=$START_DATE&endDate=$END_DATE&domain=$APPKEY";
          break;

        case "test":
          link = "https://raptor-test.mws.sankuai.com/application/problem?startDate=$START_DATE&endDate=$END_DATE&domain=$APPKEY";
          break;

        default:
          link = undefined;
          break;
      }

      return link;
    }

    function determineRaptorTime() {
      var dateElements = document.getElementsByClassName("tree-table-info-date");
      var timeElements = document.getElementsByClassName("tree-table-expand-cell tree-table-expand-cell--0");
      var startDate = new Date();

      if (dateElements !== undefined) {
        var dateText = dateElements[0].innerText;

        if (dateText !== undefined && dateText.trim() !== "") {
          startDate = new Date(dateText.trim());
        }
      }

      var hour = String(startDate.getHours());

      if (timeElements !== undefined) {
        var timeText = timeElements[0].innerText;

        if (timeText !== undefined && timeText.trim() !== "") {
          var contents = timeText.trim().split(":");

          if (contents.length === 3) {
            hour = contents[0];
          }
        }
      }

      return {
        "startDate": startDate.toISOString().substring(0, 10).replaceAll("-", "") + hour + "0000",
        "endDate": startDate.toISOString().substring(0, 10).replaceAll("-", "") + hour + "5900"
      };
    }
    /**
     * 替换 appkey 为链接
     * @param env
     * @param element
     */


    function enhanceAppkey(env, element) {
      var appkey = element.innerText.trim();
      var parent = element.parentNode; // 左括号

      var prefixSpan = document.createElement("span");
      prefixSpan.innerText = "("; // 左括号

      var suffixSpan = document.createElement("span");
      suffixSpan.innerText = ")"; // 分隔符

      var separator = document.createElement("span");
      separator.innerText = "|"; // OCTO 链接

      var octoHrefElement = document.createElement("a");
      octoHrefElement.innerText = "OCTO";
      var octoLink = determineOctoLink(env);

      if (octoLink === undefined || octoLink === "") {
        return;
      }

      octoLink = octoLink.replace("$APPKEY", appkey);
      octoHrefElement.href = octoLink;
      octoHrefElement.target = "_blank"; // Raptor 链接

      var raptorHrefElement = document.createElement("a");
      raptorHrefElement.innerText = "Raptor";
      var raptorAddress = determineRaptorLink(env);
      var raptorTime = determineRaptorTime();

      if (raptorAddress === undefined || raptorAddress === "") {
        return;
      }

      raptorAddress = raptorAddress.replace("$APPKEY", appkey);
      raptorAddress = raptorAddress.replace("$START_DATE", raptorTime.startDate);
      raptorAddress = raptorAddress.replace("$END_DATE", raptorTime.endDate);
      raptorHrefElement.href = raptorAddress;
      raptorHrefElement.target = "_blank";
      parent.appendChild(prefixSpan);
      parent.appendChild(octoHrefElement);
      parent.appendChild(separator);
      parent.appendChild(raptorHrefElement);
      parent.appendChild(suffixSpan);
    }

    function enhanceIp(env, element) {
      console.log("增强 IP");
    }
    /**
     * 替换 MtraceId 为链接
     */


    function enhanceMtraceId(env, element) {
      var content = element.innerText;

      if (content === undefined || content.trim() === "") {
        return;
      }

      var traceId;
      var justTraceId = true;

      if (traceRegex.test(content)) {
        traceId = content;
      } else {
        justTraceId = false;
        traceId = content.split("traceId=")[1].split(",")[0];
      }

      var href = document.createElement("a");
      href.innerText = traceId;
      var link = determineMtraceLink(env);

      if (link === undefined || link === "") {
        return;
      }

      link = link.replace("$TRACE_ID", traceId);
      href.href = link;
      href.target = "_blank";
      var parent = element.parentNode;

      if (justTraceId) {
        parent.replaceChild(href, element);
      } else {
        var contents = content.split(traceId);
        var spanPrefix = document.createElement("span");
        spanPrefix.innerText = contents[0];
        var spanSuffix = document.createElement("span");
        spanSuffix.innerText = contents[1];
        parent.insertBefore(spanSuffix, element);
        parent.insertBefore(href, spanSuffix);
        parent.insertBefore(spanPrefix, href);
        parent.removeChild(element);
      }
    }

    function enhanceRaptorProblem(env) {
      var mainDivs = document.getElementsByClassName("oc-main");

      if (mainDivs === undefined || mainDivs.length === 0) {
        return undefined;
      }

      var mainDiv = mainDivs[0];
      var spans = mainDiv.getElementsByTagName("span");

      if (spans === undefined || spans.length === 0) {
        return undefined;
      }

      spans.forEach(function (span) {
        var content = span.innerText;
        var contentType = determineContentType(content);

        switch (contentType) {
          case "trace":
            enhanceMtraceId(env, span);
            break;

          case "appkey":
            enhanceAppkey(env, span);
            break;

          case "ip":
            enhanceIp();
        }
      });
    }

    function enhanceRaptor(location) {
      console.log("增强 Raptor");
      var env = determineEnv(location);

      if (location !== undefined && location.indexOf("raptor") > -1 && location.indexOf("sankuai.com") > -1) {
        enhanceRaptorProblem(env);
      }
    }

    function determineEnv(location) {
      var env = "prod";

      if (location.indexOf("st.mws.sankuai.com") > -1) {
        env = "staging";
      } else if (location.indexOf("test.mws.sankuai.com") > -1) {
        env = "test";
      }

      return env;
    }

    function determineMtraceLink(env) {
      var href;

      switch (env) {
        case "prod":
        case "staging":
          href = "https://mtrace.sankuai.com/trace/$TRACE_ID";
          break;

        case "test":
          href = "http://mtrace.inf.dev.sankuai.com/trace/$TRACE_ID";
          break;

        default:
          href = undefined;
          break;
      }

      return href;
    }

}());
