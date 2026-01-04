// ==UserScript==
// @name        SPXXKLP
// @description Minecraft.net & X.com blog article to BBCode converter, adapted to KLPBBS
// @namespace   npmjs.com/package/@spxxklp/userscript
// @author      Cinder & SPGoding & SPX Fellow
// @connect     *
// @connect     feedback.minecraft.com
// @connect     help.minecraft.net
// @connect     raw.githubusercontent.com
// @homepage    https://github.com/cinder0601/SPXXKLP
// @match       https://www.minecraft.net/en-us/article/*
// @match       https://www.minecraft.net/zh-hans/article/*
// @match       https://x.com/*/status/*
// @match       https://feedback.minecraft.net/hc/en-us/articles/*
// @match       https://help.minecraft.net/hc/en-us/articles/*
// @require     https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @icon        https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon.ico
// @version     3.2.5
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/491477/SPXXKLP.user.js
// @updateURL https://update.greasyfork.org/scripts/491477/SPXXKLP.meta.js
// ==/UserScript==
(function () {
  "use strict";

  var GM_config = new GM_configStruct();
  GM_config.init({
    id: "spxxklp",
    title: "SPXXKLP 用户脚本",
    fields: {
      translator: {
        label: "译者名",
        type: "text",
        default: "<默认译者>",
      },
      bugSource: {
        label: "选择翻译源",
        type: "select",
        options: ["Github", "自定义"],
        default: "Github",
      },
      bugCenterTranslation: {
        label: "漏洞翻译源",
        type: "text",
        default:
          "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json",
      },
      bugCenterTranslator: {
        label: "漏洞译者源",
        type: "text",
        default:
          "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/translator.json",
      },
      bugCenterColor: {
        label: "漏洞颜色源",
        type: "text",
        default:
          "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/color.json",
      },
    },
  });
  GM_registerMenuCommand("编辑配置", () => GM_config.open());
  const src = GM_config.get("bugSource");
  let tr = "";
  let tor = "";
  let c = "";

  if (src == "Github") {
    console.log("[SPXXKLP] 正在使用 Github 漏洞中心");
    tr =
      "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json";
    tor =
      "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/translator.json";
    c =
      "https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/color.json";
  } else if (src == "自定义") {
    console.log("[SPXXKLP] 正在使用自定义漏洞中心");
    tr = GM_config.get("bugCenterTranslation");
    tor = GM_config.get("bugCenterTranslator");
    c = GM_config.get("bugCenterColor");
  }

  const config = {
    translator: GM_config.get("translator"),
    bugCenter: {
      translation: tr,
      translator: tor,
      color: c,
    },
  };

  var version = "3.2.5";

  function getVersionType(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("snapshot")) {
      return VersionType.Snapshot;
    } else if (lowerUrl.includes("pre-release")) {
      return VersionType.PreRelease;
    } else if (lowerUrl.includes("release-candidate")) {
      return VersionType.ReleaseCandidate;
    } else if (
      lowerUrl.includes("minecraft-java-edition") &&
      !lowerUrl.includes("snapshot")
    ) {
      return VersionType.Release;
    } else if (
      lowerUrl.includes("minecraft-preview") ||
      lowerUrl.includes("minecraft-beta-preview") ||
      lowerUrl.includes("minecraft-beta")
    ) {
      return VersionType.BedrockBeta;
    } else if (lowerUrl.includes("bedrock")) {
      return VersionType.BedrockRelease;
    } else {
      return VersionType.Normal;
    }
  }

  const bugsCenter = config.bugCenter.translation;
  const bugsTranslatorsTable = config.bugCenter.translator;
  const translatorColorTable = config.bugCenter.color;
  const spxxklpVersion = version;
  const url1 = window.location.href;

  function getReleaseVersionCode(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("pre-release")) {
      const versionRegex = /(\d+)-(\d+)-(\d*)(.+)-release/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 3) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        if (Version3 == "") {
          const formattedVersion = `${Version1}.${Version2}`;
          return formattedVersion;
        } else {
          const formattedVersion = `${Version1}.${Version2}.${Version3}`;
          return formattedVersion;
        }
      }
    } else if (lowerUrl.includes("release-candidate")) {
      const versionRegex = /(\d+)-(\d+)-(\d*)(.+)-candidate/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 3) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        if (Version3 == "") {
          const formattedVersion = `${Version1}.${Version2}`;
          return formattedVersion;
        } else {
          const formattedVersion = `${Version1}.${Version2}.${Version3}`;
          return formattedVersion;
        }
      }
    }
  }

  function getVersionCode(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("snapshot")) {
      const versionRegex = /-([0-9a-zA-Z]+)$/;
      const match = url.match(versionRegex);
      if (match && match[1]) {
        return match[1];
      }
    } else if (lowerUrl.includes("pre-release")) {
      const versionRegex = /(\d+)-(\d+)-(\d*)(.+)-release-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 4) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        const Version4 = match[5];
        if (Version3 == "") {
          const formattedVersion = `${Version1}.${Version2}-pre${Version4}`;
          return formattedVersion;
        } else {
          const formattedVersion = `${Version1}.${Version2}.${Version3}-pre${Version4}`;
          return formattedVersion;
        }
      }
    } else if (lowerUrl.includes("release-candidate")) {
      const versionRegex = /(\d+)-(\d+)-(\d*)(.+)-candidate-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 4) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        const Version4 = match[5];
        if (Version3 == "") {
          const formattedVersion = `${Version1}.${Version2}-rc${Version4}`;
          return formattedVersion;
        } else {
          const formattedVersion = `${Version1}.${Version2}.${Version3}-rc${Version4}`;
          return formattedVersion;
        }
      }
    } else if (lowerUrl.includes("minecraft-beta-preview")) {
      const versionRegex = /-beta-preview-(\d+)-(\d+)-(\d+)-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 5) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        const Version4 = match[4];
        const formattedVersion = `${Version1}.${Version2}.${Version3}.${Version4}`;
        return formattedVersion;
      }
    } else if (
      lowerUrl.includes("minecraft-preview") &&
      !lowerUrl.includes("beta")
    ) {
      const versionRegex = /-preview-(\d+)-(\d+)-(\d+)-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 5) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        const Version4 = match[4];
        const formattedVersion = `${Version1}.${Version2}.${Version3}.${Version4}`;
        return formattedVersion;
      }
    } else if (
      lowerUrl.includes("minecraft-beta") &&
      !lowerUrl.includes("preview")
    ) {
      const versionRegex = /-beta-(\d+)-(\d+)-(\d+)-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match.length >= 5) {
        const Version1 = match[1];
        const Version2 = match[2];
        const Version3 = match[3];
        const Version4 = match[4];
        const formattedVersion = `${Version1}.${Version2}.${Version3}.${Version4}`;
        return formattedVersion;
      }
    }
  }

  function getVersionCount(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("pre-release")) {
      const versionRegex = /-release-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match[1]) {
        return match[1];
      }
    } else if (lowerUrl.includes("release-candidate")) {
      const versionRegex = /-candidate-(\d+)/;
      const match = lowerUrl.match(versionRegex);
      if (match && match[1]) {
        return match[1];
      }
    }
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://www.minecraft.net/etc.clientlibs/minecraftnet/clientlibs/clientlib-site/resources/fonts/MinecraftTen.woff";
  document.head.appendChild(link);

  let releaseversioncode = getReleaseVersionCode(url1);
  let versioncode = getVersionCode(url1);
  let versioncount = getVersionCount(url1);
  function getHeader(articleType, type) {
    if (articleType.toLowerCase() !== "news") {
      return `[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;
    }

    switch (type) {
      case VersionType.Snapshot:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]每周快照[/b]是 Minecraft Java 版的测试机制，主要用于下一个正式版的特性预览。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]然而，[b]每周快照[/b]主要用于新特性展示，通常存在大量漏洞。因此对于普通玩家建议仅做[color=Red][b]测试尝鲜[/b][/color]用。在快照中打开存档前请务必[color=Red][b]进行备份[/b][/color]。[b]适用于正式版的 Mod 不兼容快照，且大多数 Mod 都不对每周快照提供支持[/b]。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft Java 版 <正式版版本号> 仍未发布，${versioncode} 为其第 <计数> 个快照。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.PreRelease:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]预发布版[/b]是 Minecraft Java 版的测试机制，如果该版本作为正式版发布，那么预发布版的游戏文件将与启动器推送的正式版完全相同。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]然而，预发布版主要用于服主和 Mod 制作者的预先体验，如果发现重大漏洞，该预发布版会被新的预发布版代替。因此建议普通玩家[color=Red]持观望态度[/color]。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft Java 版 ${releaseversioncode} 仍未发布，${versioncode} 为其第 ${versioncount} 个预发布版。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.ReleaseCandidate:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指运行在 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]候选版[/b]是 Minecraft Java 版正式版的候选版本，如果发现重大漏洞，该候选版会被新的候选版代替。如果一切正常，该版本将会作为正式版发布。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]候选版已可供普通玩家进行抢鲜体验，但仍需当心可能存在的漏洞。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft Java 版 ${releaseversioncode} 仍未发布，${versioncode} 为其第 ${versioncount} 个候选版。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.Release:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft Java 版[/b]是指运行在 Windows、Mac OS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。[/size]
[color=#f44336][size=5]|[/size][/color][size=4][b]正式版[/b]是 Minecraft Java 版经过一段时间的预览版测试后得到的稳定版本，也是众多纹理、Mod 与服务器插件会逐渐跟进的版本。官方启动器也会第一时间进行推送。 [/size]
[color=#f44336][size=5]|[/size][/color][size=4]建议玩家与服主关注其相关服务端、Mod 与插件的更新，迎接新的正式版吧！专注于单人原版游戏的玩家可立即更新，多人游戏玩家请关注您所在服务器的通知。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.BedrockRelease:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft 基岩版[/b]是指运行在移动平台（Android、iOS）、Windows 10/11、主机（Xbox One、Switch、PlayStation 4/5）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。[/size]
[color=#f44336][size=5]|[/size][/color][size=4][b]正式版[/b]是 Minecraft 基岩版经过一段时间的测试版测试之后得到的稳定版本，也是众多纹理、附加包和 Realms 会逐渐跟进的版本。与此同时 Google Play、Microsoft Store 等官方软件商店也会推送此次更新。 [/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.BedrockBeta:
        return `[color=#388e3c][size=5]|[/size][/color][size=4][b]Minecraft 基岩版[/b]是指运行在移动平台（Android、iOS）、Windows 10/11、主机（Xbox One、Switch、PlayStation 4/5）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4][b]测试版[/b]是 Minecraft 基岩版的测试机制，主要用于下一个正式版的特性预览。[/size]
[color=#f44336][size=5]|[/size][/color][size=4][b]然而，测试版主要用于新特性展示，通常存在大量漏洞。因此对于普通玩家建议仅做测试尝鲜用。使用测试版打开存档前请务必备份。适用于正式版的领域服务器与测试版不兼容。[/b] [/size]
[color=#f44336][size=5]|[/size][/color][size=4]如果在测试版中遇到旧版存档无法使用的问题，测试版将允许你将存档上传以供开发团队查找问题。[/size]
[color=#f44336][size=5]|[/size][/color][size=4]Minecraft 基岩版 <正式版版本号> 仍未发布，Beta & Preview ${versioncode} 为其第 <计数> 个测试版。[/size]
[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;

      case VersionType.Normal:
      default:
        return `[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n`;
    }
  }
  function getFooter(articleType, type) {
    const time = new Date();

    function padTime(time) {
      return time.toString().padStart(2, "0");
    }

    function toHoursAndMinutes(totalMinutes) {
      const m = Math.abs(totalMinutes);
      const minutes = m % 60;
      const hours = Math.floor(m / 60);
      return `${totalMinutes < 0 ? "+" : "-"}${padTime(hours)}${padTime(
        minutes
      )}`;
    }

    const poweredBy = `\n[align=center][size=1][color=Silver]Powered by SPXXKLP ${spxxklpVersion} with love
Converted at ${time.getFullYear()}-${
      padTime(time.getMonth() + 1) // why +1 javascript
    }-${padTime(time.getDate())} ${padTime(time.getHours())}:${padTime(
      time.getMinutes()
    )} ${toHoursAndMinutes(time.getTimezoneOffset())}[/color][/size][/align]`;

    /*Same contents,change if necessary.**/

    switch (type) {
      case VersionType.Snapshot:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.PreRelease:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.ReleaseCandidate:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.Release:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.BedrockRelease:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.BedrockBeta:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;

      case VersionType.Normal:
        return `\n${poweredBy}\n[hr][color=#388e3c][size=5]|[/size][/color][size=4][b]想了解更多游戏资讯？[/b][/size][list][*][size=3][url=https://klpbbs.com/forum-2-1.html][color=#388e3c][u]苦力怕论坛 - 游戏资讯版块[/u][/color][/url][/size][/list]`;
    }
  }
  let VersionType;

  (function (VersionType) {
    VersionType[(VersionType["Snapshot"] = 1)] = "Snapshot";
    VersionType[(VersionType["PreRelease"] = 2)] = "PreRelease";
    VersionType[(VersionType["ReleaseCandidate"] = 3)] = "ReleaseCandidate";
    VersionType[(VersionType["Release"] = 4)] = "Release";
    VersionType[(VersionType["Normal"] = 5)] = "Normal";
    VersionType[(VersionType["BedrockBeta"] = 6)] = "BedrockBeta";
    VersionType[(VersionType["BedrockRelease"] = 7)] = "BedrockRelease";
  })(VersionType || (VersionType = {}));

  const translators = {
    headings: (input, ctx) => {
      return translator(input, ctx, [
        [/Block of the Week: /gi, "本周方块："],
        [/Taking Inventory: /gi, "背包盘点："],
        [/Around the Block: /gi, "群系漫游："],
        [/A Minecraft Java Snapshot/gi, "Minecraft Java版 快照"],
        [/A Minecraft Java Pre-Release/gi, "Minecraft Java版 预发布版"],
        [/A Minecraft Java Release Candidate/gi, "Minecraft Java版 候选版本"],
        [/Minecraft Beta (?:-|——) (.*?) \((.*?)\)/gi, "Minecraft 基岩版 Beta $1（$2）"],
        [/Minecraft Beta & Preview - (.*?)/g, "Minecraft 基岩版 Beta & Preview $1"],
        [/Minecraft (?:-|——) (.*?) \(Bedrock\)/gi, "Minecraft 基岩版 $1"],
        [/Minecraft (?:-|——) (.*?) \((.*?) Only\)/gi, "Minecraft 基岩版 $1（仅$2）"],
        [/Minecraft (?:-|——) (.*?) \((.*?)\)/gi, "Minecraft 基岩版 $1（仅$2）"],
        [/Marketplace/gi, "市场"],
        [/Data-Driven/gi, "数据驱动"],
        [/Graphical/gi, "图像"],
        [/Vanilla /gi, "原版"],
        [/Player/gi, "玩家"],
        [/Experimental /gi, "实验性"],
        [/Mobs/gi, "生物"],
        [/Features and Bug Fixes/gi, "特性和漏洞修复"],
        [/ADVANCEMENTS/gi, "进度"],
        [/Accessibility/gi, "辅助功能"],
        [/Gameplay/gi, "玩法"],
        [/Items/gi, "物品"],
        [/Blocks/gi, "方块"],
        [/User Interface/gi, "用户界面"],
        [/Commands/gi, "命令"],
        [/Known Issues/gi, "已知问题"],
        [/Character Creator/gi, "角色创建器"],
        [/ Components/gi, "组件"],
        [/General/gi, "通用"],
        [/Technical Experimental Updates/gi, "实验性技术性更新"],
        [/Gametest Framework/gi, "Gametest 框架"],
        [/Gametest Framework (experimental)/gi, "Gametest 框架（实验性）"],
        [/Minecraft Snapshot /gi, "Minecraft 快照 "],
        [/ Pre-Release /gi, "-pre"],
        [/ Release Candidate /gi, "-rc"],
        [/Get the Release Candidate/gi, "获取预发布版本"],
        [/Get the Release/gi, "获取正式版"],
        [/Get the Pre-Release/gi, "获取候选版本"],
        [/Get the Snapshot/gi, "获取快照版本"],
        [/New Features in ([^\r\n]+)/gi, "$1 的新增特性"],
        [/Technical changes in ([^\r\n]+)/gi, "$1 的技术性修改"],
        [/Changes in ([^\r\n]+)/gi, "$1 的修改内容"],
        [/Fixed bugs in ([^\r\n]+)/gi, "$1 修复的漏洞"],
        [/STABILITY AND PERFORMANCE/gi, "性能与稳定性"],
        [/FEATURES AND BUG FIXES/gi, "特性和漏洞修复"],
        [/LOOT/gi, "战利品"],
        [/PARITY/gi, "趋同"],
        [/Components/gi, "组件"],
        [/ADD-ONS AND SCRIPT ENGINE/gi, "附加包和脚本引擎"],
        [/DRESSING ROOM/gi, "更衣室"],
        [/Item/gi, "物品"],
        [/CHANGES/gi, "改动"],
        [/SOUNDS/gi, "音效"],
        [/DATA PACK VERSION/gi, "数据包版本"],
        [/PREDICATES/gi, "谓词"],
        [/ PREDICATE/gi, "谓词"],
        [/EFFECT/gi, "效果"],
        [/COMMAND/gi, "命令"],
        [/ATTRIBUTE/gi, "属性"],
        [/BLOCK/gi, "方块"],
        [/ENTITY/gi, "实体"],
        [/ENCHANTMENTS/gi, "附魔"],
        [/ TAGS/gi, "标签"],
        [/TAGS/gi, "标签"],
        [/TYPE/gi, "类型"],
        [/MUSIC/gi, "音乐"],
        [/GAME TIPS/gi, "游戏提示"],
        [/NEW FEATURES/gi, "新特性"],
        [/NEW /gi, "新的"],
        [/USER INTERFACE/gi, "用户界面"],
        [/EDITOR/gi, "编辑器"],
        [/FIXES/gi, "修复"],
        [/IMPROVEMENTS/gi, "改进"],
        [/RESOURCE PACK VERSION/gi, "资源包版本"],
        [/SHADERS/gi, "着色器"],
        [/PARTICLES/gi, "粒子效果"],
        [/TOUCH CONTROLS/gi, "触控"],
        [/TECHNICAL UPDATES/gi, "技术性更新"],
        [/ TABLES/gi, "表"],
        [/PROJECTILES/gi, "弹射物"],
        [/STRUCTURES/gi, "结构"],
        [/ENTITIES/gi, "实体"],
        [/FUNCTIONS/gi, "函数"],
      ]);
    },
    imgCredits: (input, ctx) => {
      return translator(input, ctx, [
        [/Image credit:/gi, "图片来源："],
        [/CC BY-NC-ND/gi, "知识共享 署名-非商业性使用-禁止演绎"],
        [/CC BY-NC-SA/gi, "知识共享 署名-非商业性使用-相同方式共享"],
        [/CC BY-NC/gi, "知识共享 署名-非商业性使用"],
        [/CC BY-ND/gi, "知识共享 署名-禁止演绎"],
        [/CC BY-SA/gi, "知识共享 署名-相同方式共享"],
        [/CC BY/gi, "知识共享 署名"],
        [/Public Domain/gi, "公有领域"],
      ]);
    },
    punctuation: (input, ctx) => {
      return translator(
        input,
        ctx,
        [
          [/\[i]/gi, "[font=楷体]"],
          [/\[\/i]/g, "[/font]"],
          ...(ctx.disablePunctuationConverter
            ? []
            : [
                [/,( |$)/g, "，"],
                [/!( |$)/g, "！"],
                [/\.\.\.( |$)/g, "…"],
                [/\.( |$)/g, "。"],
                [/\?( |$)/g, "？"],
                [/( |^)-( |$)/g, " —— "],
              ]),
        ],
        (input) => {
          return quoteTreatment(input, [["“", "”", /"/]]);
        }
      );
    },
    code: (input, ctx) => {
      return quoteTreatment(input, [
        [
          '[backcolor=#f1edec][color=Silver][font=SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace][/font][/color][/backcolor]',
          "`",
          /`/,
        ],
      ]);
    },
  };
  function translate(input, ctx, type) {
    if (typeof type === "string") {
      type = [type];
    }

    for (const t of type) {
      input = translators[t](input, ctx);
    }

    return input;
  }

  function quoteTreatment(input, quoteArrays) {
    for (const quoteArray of quoteArrays) {
      const split = input.split(quoteArray[2]);
      input = "";

      for (let i = 0; i < split.length - 1; i++) {
        const element = split[i];
        input += element + quoteArray[i % 2];
      }

      input += split[split.length - 1];
    }

    return input;
  }

  function translator(input, ctx, mappings, treatment = (input) => input) {
    // REPLACE!!!!1
    for (const mapping of mappings) {
      input = input.replace(mapping[0], mapping[1]);
    }

    treatment(input, ctx);
    return input;
  }

  const converters = {
    /**
     * Converts a ChildNode to a BBCode string according to the type of the node.
     */
    convert: async (node, ctx) => {
      if (node.classList?.contains("spxxklp-userscript-ignored")) {
        return "";
      } // Listing all possible elements in the document

      switch (node.nodeName) {
        case "A":
          return converters.a(node, ctx);

        case "B":
        case "STRONG":
          return converters.strong(node, ctx);

        case "BLOCKQUOTE":
          return converters.blockquote(node, ctx);

        case "BR":
          return converters.br();

        case "CITE":
          return converters.cite(node, ctx);

        case "CODE":
          return converters.code(node, ctx);

        case "DIV":
        case "SECTION":
          return converters.div(node, ctx);

        case "DD":
          return converters.dd(node, ctx);

        case "DL":
          return converters.dl(node, ctx);

        case "DT":
          return converters.dt();

        case "EM":
          return converters.em(node, ctx);

        case "H1":
          return converters.h1(node, ctx);

        case "H2":
          return converters.h2(node, ctx);

        case "H3":
          return converters.h3(node, ctx);

        case "H4":
          return converters.h4(node, ctx);

        case "I":
          return converters.i(node, ctx);

        case "IMG":
          return converters.img(node);

        case "LI":
          return converters.li(node, ctx);

        case "OL":
          return converters.ol(node, ctx);

        case "P":
          return converters.p(node, ctx);

        case "PICTURE":
          return converters.picture(node, ctx);

        case "PRE":
          return converters.pre(node, ctx);

        case "SPAN":
          return converters.span(node, ctx);

        case "TABLE":
          return converters.table(node, ctx);

        case "TBODY":
          return converters.tbody(node, ctx);

        case "TH":
        case "TD":
          return converters.td(node, ctx);

        case "TR":
          return converters.tr(node, ctx);

        case "UL":
          return converters.ul(node, ctx);

        case "#text":
          if (node) {
            if (ctx.multiLineCode) {
              return node.textContent ? node.textContent : "";
            } else
              return node.textContent
                .replace(/[\n\r\t]+/g, "")
                .replace(/\s{2,}/g, "");
          } else {
            return "";
          }

        case "H5":
          return converters.h5(node, ctx);

        case "BUTTON":
        case "NAV":
        case "svg":
        case "SCRIPT":
          if (node) {
            return node.textContent ? node.textContent : "";
          } else {
            return "";
          }
        case "FIGURE":
          return converters.figure(node, ctx);

        default:
          console.warn(`Unknown type: '${node.nodeName}'.`);

          if (node) {
            return node.textContent ? node.textContent : "";
          } else {
            return "";
          }
      }
    },

    /**
     * Convert child nodes of an HTMLElement to a BBCode string.
     */
    recurse: async (ele, ctx) => {
      let ans = "";

      if (!ele) {
        return ans;
      }

      for (const child of Array.from(ele.childNodes)) {
        ans += await converters.convert(child, ctx);
      }

      return ans;
    },
    a: async (anchor, ctx) => {
      const url = resolveUrl(anchor.href);
      let ans;

      if (url) {
        ans = `[url=${url}][color=#388d40][u]${await converters.recurse(
          anchor,
          ctx
        )}[/u][/color][/url]`;
      } else {
        ans = await converters.recurse(anchor, ctx);
      }

      return ans;
    },
    blockquote: async (ele, ctx) => {
      const prefix = "";
      const suffix = "";
      const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`;
      return ans;
    },
    br: async () => {
      const ans = "\n";
      return ans;
    },
    cite: async (ele, ctx) => {
      const prefix = "—— ";
      const suffix = "";
      const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`;
      return ans;
    },
    code: async (ele, ctx) => {
      if (!ele || !await converters.recurse(ele, {
        ...ctx,
        disablePunctuationConverter: true,
      })) {
        return '';
      }
      const prefix = ctx.multiLineCode
        ? "[code]"
        : "[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]";
      const suffix = ctx.multiLineCode
        ? "[/code]"
        : "[/font][/color][/backcolor]";
      const ans = `${prefix}${await converters.recurse(ele, {
        ...ctx,
        disablePunctuationConverter: true,
      })}${suffix}`;
      return ans;
    },
    div: async (ele, ctx) => {
      let ans = await converters.recurse(ele, ctx);

      if (ele.classList.contains("text-center")) {
        ans = `[align=center]${ans}[/align]\n`;
      } else if (ele.classList.contains("article-image-carousel")) {
        /*const prefix = `[/indent][/indent][album]\n`;
        const suffix = `\n[/album][indent][indent]\n`;*/

        const slides = [];
        const findSlides = async (ele) => {
          if (ele.classList.contains("slick-cloned")) {
            return;
          }

          if (
            ele.nodeName === "IMG" &&
            ele.classList.contains("article-image-carousel__image")
          ) {
            slides.push([resolveUrl(ele.src), " "]);
          } else if (
            ele.nodeName === "DIV" &&
            ele.classList.contains("article-image-carousel__caption")
          ) {
            if (slides.length > 0) {
              slides[slides.length - 1][1] = `[b]${await converters.recurse(
                ele,
                ctx
              )}[/b]`;
            }
          } else {
            for (const child of Array.from(ele.childNodes)) {
              if (child.nodeName === "DIV" || child.nodeName === "IMG") {
                await findSlides(child);
              }
            }
          }
        };

        await findSlides(ele);

        /*if (shouldUseAlbum(slides)) {
          ans = `${prefix}${slides.map(([url, caption]) => `[aimg=${url}]${caption}[/aimg]`).join('\n')}${suffix}`;
        } else */ if (slides.length > 0) {
          ans = `[align=center]${slides
            .map(([url, caption]) => `[img]${url}[/img]\n${caption}`)
            .join("\n")}[/align]\n`;
        } else {
          ans = "";
        }
      } else if (ele.classList.contains("video")) {
        // Video.
        ans =
          "\n[align=center]<无法获取的视频，如有可用视频源，请在此处插入>\n<对于B站视频，可使用 [bilibili] 代码>[/align]\n";
      } else if (
        ele.classList.contains("quote") ||
        ele.classList.contains("attributed-quote")
      ) {
        ans = `\n[quote]\n${ans}\n[/quote]\n`;
      } else if (ele.classList.contains("article-social")) {
        // End of the content.
        ans = "";
      } else if (ele.classList.contains("modal")) {
        // Unknown useless content
        ans = "";
      }

      return ans;
    },
    dt: async () => {
      // const ans = `${converters.rescure(ele)}：`
      // return ans
      return "";
    },
    dl: async (ele, ctx) => {
      const ans = `\n\n${await converters.recurse(
        ele,
        ctx
      )}\n【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] 用户脚本 v${spxxklpVersion}】\n\n`;
      return ans;
    },
    dd: async (ele, ctx) => {
      let ans = "";

      if (ele.classList.contains("pubDate")) {
        // Published:
        // `pubDate` is like '2019-03-08T10:00:00.876+0000'.
        const date = ele.attributes.getNamedItem("data-value");

        if (date) {
          ans = `[b]【${ctx.translator} 译自[url=${
            ctx.url
          }][color=#388d40][u]官网 ${date.value.slice(
            0,
            4
          )} 年 ${date.value.slice(5, 7)} 月 ${date.value.slice(
            8,
            10
          )} 日发布的 ${ctx.title}[/u][/color][/url]；原作者 ${
            ctx.author
          }】[/b]`;
        } else {
          ans = `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]官网 * 年 * 月 * 日发布的 ${ctx.title}[/u][/color][/url]】[/b]`;
        }
      } else {
        // Written by:
        ctx.author = await converters.recurse(ele, ctx);
      }

      return ans;
    },
    em: async (ele, ctx) => {
      const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`;
      return ans;
    },
    h1: async (ele, ctx) => {
      const prefix = "[size=6][b]";
      const suffix = "[/b][/size]";
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return await converters[node.tagName.toLowerCase()](node, ctx);
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };
      const rawInnerArray = await Promise.all(
        Array.from(ele.childNodes).map(processNode)
      );
      const rawInner = rawInnerArray.join("");
      const inner = makeUppercaseHeader(rawInner);
      const ans = `${prefix}[color=Silver]${usingSilver(inner).replace(
        /[\n\r]+/g,
        " "
      )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
        "headings",
        "punctuation",
      ]).replace(/[\n\r]+/g, " ")}${suffix}\n\n`;
      return ans;
    },
    h2: async (ele, ctx) => {
      if (isBlocklisted(ele.textContent)) return "";
      const prefix = "[size=5][b]";
      const suffix = "[/b][/size]";
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return await converters[node.tagName.toLowerCase()](node, ctx);
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };
      const rawInnerArray = await Promise.all(
        Array.from(ele.childNodes).map(processNode)
      );
      const rawInner = rawInnerArray.join("");
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
        /[\n\r]+/g,
        " "
      )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
        "headings",
        "punctuation",
      ]).replace(/[\n\r]+/g, " ")}${suffix}\n\n`;
      return ans;
    },
    h3: async (ele, ctx) => {
      const prefix = "[size=4][b]";
      const suffix = "[/b][/size]";
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return await converters[node.tagName.toLowerCase()](node, ctx);
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };
      const rawInnerArray = await Promise.all(
        Array.from(ele.childNodes).map(processNode)
      );
      const rawInner = rawInnerArray.join("");
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
        /[\n\r]+/g,
        " "
      )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
        "headings",
        "punctuation",
      ]).replace(/[\n\r]+/g, " ")}${suffix}\n\n`;
      return ans;
    },
    h4: async (ele, ctx) => {
      const prefix = "[size=3][b]";
      const suffix = "[/b][/size]";
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return await converters[node.tagName.toLowerCase()](node, ctx);
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };
      const rawInnerArray = await Promise.all(
        Array.from(ele.childNodes).map(processNode)
      );
      const rawInner = rawInnerArray.join("");
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
        /[\n\r]+/g,
        " "
      )}[/color]${suffix}\n${prefix}${inner}${suffix}\n\n`;
      return ans;
    },
    h5: async (ele, ctx) => {
      const prefix = "[size=2][b]";
      const suffix = "[/b][/size]";
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return await converters[node.tagName.toLowerCase()](node, ctx);
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };
      const rawInnerArray = await Promise.all(
        Array.from(ele.childNodes).map(processNode)
      );
      const rawInner = rawInnerArray.join("");
      const inner = makeUppercaseHeader(rawInner);
      const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
        /[\n\r]+/g,
        " "
      )}[/color]${suffix}\n${prefix}${inner}${suffix}\n\n`;
      return ans;
    },
    i: async (ele, ctx) => {
      const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`;
      return ans;
    },
    img: async (img) => {
      let host = location.host;

      let w;
      let h;

      if (img.classList.contains("attributed-quote__image")) {
        // for in-quote avatar image
        h = 92;
        w = 53;
      } else if (img.classList.contains("mr-3")) {
        // for attributor avatar image
        h = 121;
        w = 82;
      }

      const prefix = w && h ? `[img=${w},${h}]` : "[img]";
      const imgUrl = resolveUrl(img.src);
      if (imgUrl === "") return ""; // in case of empty image

      let ans;
      if (host == "www.minecraft.net") {
        ans = `[align=center]${prefix}${imgUrl}[/img][/align]\n`; //Left aligning is too ugly.
      } else {
        ans = `[align=center]${prefix}${imgUrl}[/img][/align]\n`;
      }

      return ans;
    },
    li: async (ele, ctx) => {
      let ans;
      let nestedList = false;

      for (const child of ele.childNodes) {
        if (child.nodeName === "OL" || child.nodeName === "UL") {
          nestedList = true;
        }
      }

      if (nestedList) {
        // Nested lists.
        let theParagragh = "";
        let theList = "";
        let addingList = false;

        for (let i = 0; i < ele.childNodes.length - 1; i++) {
          let nodeName = ele.childNodes[i].nodeName;

          if (nodeName === "OL" || nodeName === "UL") {
            addingList = true;
          }

          if (!addingList) {
            const paragraghNode = await converters.convert(ele.childNodes[i], {
              ...ctx,
              inList: true,
            });
            theParagragh = `${theParagragh}${paragraghNode}`;
          } else {
            const listNode = await converters.convert(ele.childNodes[i], {
              ...ctx,
              inList: true,
            });
            theList = `${theList}${listNode}`;
          }
        }

        ans = `[*][color=Silver]${usingSilver(
          theParagragh
        )}[/color]\n[*]${translate(
          translateBugs(theParagragh, ctx),
          ctx,
          "code"
        )}\n${theList}`;
      } else if (isBlocklisted(ele.textContent)) {
        return "";
      } else {
        const inner = await converters.recurse(ele, { ...ctx, inList: true });
        ans = `[*][color=Silver]${usingSilver(inner)}[/color]\n[*]${translate(
          translateBugs(inner, ctx),
          ctx,
          "code"
        )}\n`;
      }

      return ans;
    },
    ol: async (ele, ctx) => {
      const inner = await converters.recurse(ele, ctx);
      const ans = `[list=1]\n${inner}[/list]\n`;
      return ans;
    },
    p: async (ele, ctx) => {
      const processNode = async (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const converter = converters[node.tagName.toLowerCase()];
          if (converter) {
            return await converter(node, ctx);
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
      };

      let inner = await converters.recurse(ele, ctx);
      inner = inner ? inner.trim() : "";

      let ans;

      if (inner === "") {
        return "";
      }

      if (ele.style.textAlign === "center") {
        ans = `[align=center][size=2][color=Silver]${usingSilver(
          inner
        )}[/color][/size]\n${translate(inner, ctx, [
          "punctuation",
          "imgCredits",
        ])}[/align]\n`;
      } else if (ele.classList.contains("lead")) {
        ans = `[b][size=2][color=Silver]${inner}[/color][/size][/b]\n[size=4][b]${translate(
          inner,
          ctx,
          "headings"
        )}[/b][/size]\n`;
      } else if (
        ele.querySelector("strong") !== null &&
        ele.querySelector("strong").textContent === "Posted:"
      ) {
        return "";
      } else if (isBlocklisted(inner)) {
        return "";
      } else if (ele.innerHTML.trim() === "&nbsp;") {
        return "";
      } else if (
        /\s{0,}/.test(inner) &&
        ele.querySelectorAll("img").length === 1
      ) {
        return inner;
      } else {
        if (ctx.inList) {
          ans = inner;
        } else {
          ans = `[size=2][color=Silver]${usingSilver(
            inner
          )}[/color][/size]\n${translate(inner, ctx, [
            "punctuation",
            "imgCredits",
          ])}\n\n`;
        }
      }

      return ans;
    },
    picture: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);
      return ans;
    },
    figure: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);
      return ans;
    },
    pre: async (ele, ctx) => {
      const ans = await converters.recurse(ele, {
        ...ctx,
        multiLineCode: true,
      });
      return ans;
    },
    span: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);

      if (ele.classList.contains("MC_Effect_TextHighlightA")) {
        // Special for MC_Effect_TextHighlightA element.
        const textContent = await converters.recurse(ele, ctx);
        const prefix =
          "[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]";
        const suffix = "[/font][/color][/backcolor]";
        return `${prefix}${textContent}${suffix}`;
      } else if (ele.classList.contains("MC_Effect_TextHighlightB")) {
        // Special for MC_Effect_TextHighlightB element.
        const textContent = await converters.recurse(ele, ctx);
        const prefix =
          "[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]";
        const suffix = "[/font][/color][/backcolor]";
        return `${prefix}${textContent}${suffix}`;
      } else if (ele.classList.contains("bedrock-server")) {
        // Inline code.
        const prefix =
          "[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]";
        const suffix = "[/font][/color][/backcolor]";
        return `${prefix}${await converters.recurse(ele, {
          ...ctx,
          disablePunctuationConverter: true,
        })}${suffix}`;
      } else if (ele.classList.contains("strikethrough")) {
        // Strikethrough text.
        const prefix = "[s]";
        const suffix = "[/s]";
        return `${prefix}${ans}${suffix}`;
      } else if (
        ele.childElementCount === 1 &&
        ele.firstElementChild.nodeName === "IMG"
      ) {
        // Image.
        const img = ele.firstElementChild;
        return await converters.img(img);
      }

      return ans;
    },
    strong: async (ele, ctx) => {
      const ans = `[b]${await converters.recurse(ele, ctx)}[/b]`;
      return ans;
    },
    table: async (ele, ctx) => {
      const ans = `\n[table]\n${await converters.recurse(ele, ctx)}[/table]\n`;
      return ans;
    },
    tbody: async (ele, ctx) => {
      const ans = await converters.recurse(ele, ctx);
      return ans;
    },
    td: async (ele, ctx) => {
      const ans = `[td]${await converters.recurse(ele, ctx)}[/td]`;
      return ans;
    },
    tr: async (ele, ctx) => {
      const ans = `[tr]${await converters.recurse(ele, ctx)}[/tr]\n`;
      return ans;
    },
    ul: async (ele, ctx) => {
      const inner = await converters.recurse(ele, ctx);
      const ans = `[list]\n${inner}[/list]\n`;
      return ans;
    },
  };
  /**
   * Resolve relative URLs.
   */

  function resolveUrl(url) {
    if (url[0] === "/") {
      return `https://${location.host}${url}`;
    } else {
      return url;
    }
  }
  function usingSilver(text) {
    return text.replace(/#388d40/g, "Silver").replace(/#7824c5/g, "Silver");
  }
  function makeUppercaseHeader(header) {
    let retStr = "";
    let idx = 0;
    let bracket = 0;

    for (let i = 0; i < header.length; i++) {
      if (header[i] == "[") {
        if (bracket == 0) {
          retStr = retStr.concat(header.substring(idx, i).toUpperCase());
          idx = i;
        }

        bracket++;
      } else if (header[i] == "]") {
        if (bracket <= 1) {
          retStr = retStr.concat(header.substring(idx, i + 1));
          idx = i + 1;
        }

        bracket = Math.max(0, bracket - 1);
      }
    }

    if (bracket > 0) {
      console.error("bracket not closed!");
      retStr = retStr.concat(header.substring(idx, header.length));
    } else {
      retStr = retStr.concat(
        header.substring(idx, header.length).toUpperCase()
      );
    }

    return retStr;
  }
  /**
   * Get bugs from BugCenter.
   * Guangyao and GitHub source are down, so I deleted them.
   */

  async function getBugs() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: bugsCenter,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: (r) => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error("Aborted")),
        onerror: (e) => rj(e),
        ontimeout: () => rj(new Error("Time out")),
      });
    });
  }
  async function getBugsTranslators() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: bugsTranslatorsTable,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: (r) => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error("Aborted")),
        onerror: (e) => rj(e),
        ontimeout: () => rj(new Error("Time out")),
      });
    });
  }
  async function getTranslatorColor() {
    return new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: translatorColorTable,
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: (r) => {
          try {
            rs(JSON.parse(r.responseText));
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error("Aborted")),
        onerror: (e) => rj(e),
        ontimeout: () => rj(new Error("Time out")),
      });
    });
  }

  function markdownToBbcode(value) {
    return value.replace(
      /`([^`]+)`/g,
      "[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]$1[/font][/color][/backcolor]"
    );
  }
  /**
   * Replace untranslated bugs.
   */

  function translateBugs(str, ctx) {
    if (
      str.startsWith("[url=https://bugs.mojang.com/browse/MC-") &&
      ctx.bugs != null // nullish
    ) {
      const id = str.slice(36, str.indexOf("]"));
      const data = ctx.bugs[id];

      if (data) {
        let bugColor = "#388d40";

        if (ctx.bugsTranslators[id]) {
          const bugTranslator = ctx.bugsTranslators[id];

          if (ctx.translatorColor[bugTranslator]) {
            bugColor = ctx.translatorColor[bugTranslator];
          }
        }

        const bbcode = markdownToBbcode(data);
        return `[url=https://bugs.mojang.com/browse/${id}][b][color=${bugColor}]${id}[/color][/b][/url]- ${bbcode}`;
      } else {
        return str;
      }
    } else {
      return str;
    }
  }
  /**
   * KLPBBS does NOT support [album], the shouldUseAlbum function is removed temporarily.
   */

  /*function shouldUseAlbum(slides) {
    return slides.length > 1 && slides.every(([_, caption]) => caption === ' ')
    ;
  }*/

  function isBlocklisted(text) {
    const blocklist = [
      "Information on the Minecraft Preview and Beta:",
      "While the version numbers between Preview and Beta are different, there is no difference in game content",
      "These work-in-progress versions can be unstable and may not be representative of final version quality",
      "Minecraft Preview is available on Xbox, Windows 10/11, and iOS devices. More information can be found at aka.ms/PreviewFAQ",
      "The beta is available on Android (Google Play). To join or leave the beta, see aka.ms/JoinMCBeta for detailed instructions",
    ];
    return blocklist
      .map((i) => {
        return i.replace(/\p{General_Category=Space_Separator}*/, "");
      })
      .some((block) =>
        text
          .trim()
          .trim()
          .replace(/\p{General_Category=Space_Separator}*/, "")
          .includes(block)
      );
  }

  async function minecraftNet() {
    const url = document.location.toString();

    if (url.match(/^https:\/\/www\.minecraft\.net\/(?:[a-z-]+)\/article\//)) {
      const authorContainer = document.querySelector(
        ".MC_articleHeroA_attribution_author"
      );
      const dateElement = authorContainer.querySelector("dd:nth-child(4)"); // 获取发布日期的 dd 元素

      const button = document.createElement("button");
      button.classList.add("spxxklp-userscript-ignored");
      button.innerText = "复制 BBCode （KLPBBS）";
      // 按钮样式设置
      button.style.backgroundColor = "#3C8527";
      button.style.color = "#FFFFFF";
      button.style.border = "none";
      button.style.padding = "10px 20px";
      button.style.borderRadius = "5px";
      button.style.fontSize = "16px";
      button.style.cursor = "pointer";
      button.style.transition = "background-color 0.3s ease";
      button.style.fontFamily = "MinecraftTen, sans-serif";

      button.style.width = "140px";
      button.style.height = "70px";
      button.style.textAlign = "center";
      button.style.marginLeft = "auto";

      button.onmouseover = () => {
        button.style.backgroundColor = "#52A535";
      };
      button.onmouseout = () => {
        button.style.backgroundColor = "#3C8527";
      };
      button.onclick = async () => {
        button.innerText = "处理中...";
        const bbcode = await convertMCArticleToBBCode(document, url);
        GM_setClipboard(bbcode, {
          type: "text",
          mimetype: "text/plain",
        });
        button.innerText = "已复制!";
        setTimeout(() => (button.innerText = "复制 BBCode (KLPBBS)"), 5000);
      };
      const container = document.createElement("div");
      container.id = "spxxklp-buttons";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "flex-end";
      container.style.width = "100%";
      container.style.padding = "10px";
      container.style.boxSizing = "border-box";
      container.append(button);
      // 将按钮插入到日期下方
      dateElement.insertAdjacentElement("afterend", button);
    }
  }

  async function convertMCArticleToBBCode(
    html,
    articleUrl,
    translator = config.translator
  ) {
    const articleType = getArticleType(html);
    const versionType = getVersionType(articleUrl);
    let bugs;

    try {
      bugs = await getBugs();
    } catch (e) {
      bugs = {};
      console.error("[convertMCArticleToBBCode#getBugs]", e);
    }

    let bugsTranslators;

    try {
      bugsTranslators = await getBugsTranslators();
    } catch (e) {
      bugsTranslators = {};
      console.error("[convertMCArticleToBBCode#getBugs]", e);
    }

    let translatorColor;

    try {
      translatorColor = await getTranslatorColor();
    } catch (e) {
      translatorColor = {};
      console.error("[convertMCArticleToBBCode#getBugs]", e);
    }

    const header = getHeader(articleType, versionType);
    const heroImage = getHeroImage(html, articleType);
    const maintitle = await getMainTitle(html);
    const subtitle = await getSubTitle(html);
    let content = await getContent(html, {
      bugs,
      bugsTranslators,
      translatorColor,
      title: html.title.split(" | ").slice(0, -1).join(" | "),
      date: null,
      translator,
      url: articleUrl,
    });
    const footer = getFooter(articleType, versionType);
    const author = await getAuthor(html);
    const ans = `${header}${heroImage}\n[align=center][color=silver][size=6][b]${maintitle}[/b][/size][/color][/align]\n[align=center][size=6][b]${maintitle}[/b][/size][/align]\n[align=center][color=silver][size=2]${subtitle}[/size][/color][/align]\n[align=center][size=2]${subtitle}[/size][/align]\n\n${content}[b]${author}\n\n${footer}`;
    return ans;
  }
  /**
   * Returns the type of the article.
   */

  function getArticleType(html) {
    try {
      const type =
        html.getElementsByClassName("MC_articleHeroA_category")?.[0]
          ?.textContent ?? "";
      return type.toUpperCase();
    } catch (e) {
      console.error("[getArticleType]", e);
    }

    return "INSIDER";
  }

  /**
   * Get the hero image (head image) of an article as the form of a BBCode string.
   * @param html An HTML Document.
   */

  function getHeroImage(html, articleType) {
    const category = articleType
      ? `\n[backcolor=Black][color=White][font="Noto Sans",sans-serif][b]${articleType}[/b][/font][/color][/backcolor][/align]`
      : "";
    const img = html.getElementsByClassName("article-head__image")[0];

    if (!img) {
      return `\n[align=center]${category}[/align]\n`;
    }

    const src = img.src;
    const ans = `[align=center][img=1200,513]${resolveUrl(
      src
    )}[/img]\n${category}[/align]\n`;
    return ans;
  }
  /**
   * Get the content of an article as the form of a BBCode string.
   * @param html An HTML Document.
   */

  async function getSubTitle(html) {
    let con = html.getElementsByClassName(
      "MC_articleHeroA_header_container"
    )[0];
    let subtitle = con.getElementsByClassName(
      "MC_articleHeroA_header_subheadline"
    )[0].innerText;
    return subtitle;
  }
  async function getMainTitle(html) {
    let con = html.getElementsByClassName(
      "MC_articleHeroA_header_container"
    )[0];
    let maintitle = con.getElementsByClassName("MC_Heading_1")[0].innerText;
    return maintitle;
  }

  async function getAuthor(html, translator = config.translator) {
    try {
      let rawauthor = html.getElementsByClassName("MC_articleHeroA_attribution_author")[0];
      if (!rawauthor) {
        console.warn("Author attribution element not found");
        return "Unknown Author";
      }
  
      let authorImgUrl = "";
      let authorImg = rawauthor.getElementsByTagName("img")[0];
      if (authorImg && authorImg.src) {
        authorImgUrl = authorImg.src;
      }
  
      let authorName = "Unknown";
      let authorNameElement = rawauthor.getElementsByTagName("dd")[0];
      if (authorNameElement) {
        authorName = authorNameElement.innerText;
      }
  
      let publishDate = "Unknown Date";
      let publishDateElement = rawauthor.getElementsByTagName("dd")[1];
      if (publishDateElement) {
        publishDate = publishDateElement.innerText;
      }
  
      let [a, b, c] = publishDate.split("/");
      let year, month, day;
      if (a > 12) {
        year = a;
        month = b;
        day = c;
      } else {
        year = "20" + c;
        month = a;
        day = b;
      }
      let url = window.location.href;
      let title = await getMainTitle(html);
  
      let ans = `\n${authorImgUrl ? `[float=left][img]${authorImgUrl}[/img][/float]\n\n\n` : ''}【${translator} 译自[url=${url}][color=#388d40][u]${authorName} ${year} 年 ${month} 月 ${day} 日发布的 ${title}[/u][/color][/url]】[/b]\n【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] 用户脚本 v${spxxklpVersion}】`;
      return ans;
    } catch (error) {
      console.error("Error in getAuthor function:", error);
      return "Error retrieving author information";
    }
  }
  

  async function getContent(html, ctx) {
    let results = [];
    let elements = document.querySelectorAll(
      ".MC_articleGridA_container.MC_articleGridA_grid, .MC_Carousel_track_slide.MC_Theme_Vanilla.MC_Carousel_track_slide__active, .MC_Carousel_track_slide.MC_Theme_Vanilla:not(.MC_Carousel_track_slide__copy)"
    );
    let container = document.createElement("div");

    let seenElements = new Set();

    Array.from(elements).forEach((element) => {
      let identifier = element.outerHTML;
      if (!seenElements.has(identifier)) {
        seenElements.add(identifier);
        container.appendChild(element.cloneNode(true)); // cloneNode(true) 深拷贝元素
      }
    });

    let containerElements = Array.from(container.children);

    for (let i = 0; i < containerElements.length; i++) {
      let rootDiv = containerElements[i];

      let rootDivHTML = rootDiv.outerHTML.replace(
        /<h[1-5]>(?:&nbsp;|\s)*<\/h[1-5]>/g,
        ""
      );
      rootDiv = document.createElement("div");
      rootDiv.innerHTML = rootDivHTML;

      let spanElements = rootDiv.querySelectorAll("span");
      spanElements.forEach((spanElement) => {
        spanElement.innerHTML = spanElement.innerHTML.replace(/\n/g, " ");
      });

      let ans = await converters.recurse(rootDiv, ctx);
      ans = ans
        .replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, "$1 $2")
        .replace(/(\[\/[^\]]+?])([a-zA-Z0-9\-._])/g, "$1 $2");
      results.push(ans);
    }

    return results.join("\n\n");
  }

  function getZendesk(controlDOM, titleSlice, contentClass, versionType) {
    const button = document.createElement("a");
    button.classList.add("spxxklp-userscript-ignored", "navLink");
    button.innerText = "复制 BBCode （KLPBBS）";
    // 按钮样式设置
    button.style.backgroundColor = "#3C8527";
    button.style.color = "#FFFFFF";
    button.style.border = "none";
    button.style.padding = "5px 10px";
    button.style.borderRadius = "5px";
    button.style.fontSize = "15px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";

    button.style.width = "120px";
    button.style.height = "50px";
    button.style.textAlign = "center";
    button.style.marginLeft = "auto";

    button.onmouseover = () => {
      button.style.backgroundColor = "#52A535";
    };
    button.onmouseout = () => {
      button.style.backgroundColor = "#3C8527";
    };
    button.onclick = async () => {
      button.innerText = "处理中...";
      const bbcode = await convertZendeskArticleToBBCode(
        document,
        location.href,
        config.translator,
        titleSlice,
        contentClass,
        versionType
      );
      GM_setClipboard(bbcode, {
        type: "text",
        mimetype: "text/plain",
      });
      button.innerText = "已复制!";
      setTimeout(() => (button.innerText = "复制 BBCode （KLPBBS）"), 5_000);
    };
    const container = document.createElement("div");
    container.id = "spxxklp-buttons";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    container.style.width = "100%";
    container.style.padding = "10px";
    container.style.boxSizing = "border-box";
    container.append(button);

    controlDOM(button);
  }

  async function converthelpElementsToBBCode(elements, ctx) {
    let bbcode = "";
    const seenImages = new Set();

    for (let element of elements) {
      try {
        let converted = await converters.recurse(element, ctx);
        let imgTags = converted.match(/\[img](.*?)\[\/img]/g);
        if (imgTags) {
          for (let imgTag of imgTags) {
            let imgUrl = imgTag.match(/\[img](.*?)\[\/img]/)[1];
            if (seenImages.has(imgUrl)) {
              converted = converted.replace(imgTag, "");
            } else {
              seenImages.add(imgUrl);
            }
          }
        }

        bbcode += converted + "\n";
      } catch (error) {
        console.error("Error converting content to BBCode:", error);
      }
    }
    return bbcode;
  }

  function getHelpContent(controlDOM) {
    const ctx = {
      multiLineCode: false,
      disablePunctuationConverter: false,
      translator: config.translator,
      url: window.location.href,
      inList: false,
    };
    const heading = document.getElementsByClassName("article-page-heading");
    const content = document.getElementsByClassName("article-page-body");

    const button = document.createElement("a");
    button.classList.add("spxxklp-userscript-ignored", "navLink");
    button.innerText = "复制 BBCode （KLPBBS）";
    // 按钮样式设置
    button.style.backgroundColor = "#3C8527";
    button.style.color = "#FFFFFF";
    button.style.border = "none";
    button.style.padding = "5px 10px";
    button.style.borderRadius = "5px";
    button.style.fontSize = "15px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";

    button.style.width = "120px";
    button.style.height = "50px";
    button.style.textAlign = "center";
    button.style.marginLeft = "auto";

    button.onmouseover = () => {
      button.style.backgroundColor = "#52A535";
    };
    button.onmouseout = () => {
      button.style.backgroundColor = "#3C8527";
    };
    button.onclick = async () => {
      button.innerText = "处理中...";
      let bbcode = await converthelpElementsToBBCode(heading, ctx);
      let title = bbcode;
      title = title.replace(/\n/g, "");
      bbcode = `[color=#388e3c][size=5]|[/size][/color][size=4]本文内容按照 [/size][url=https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans][size=4][color=#2e8b57][u]CC BY-NC-SA 4.0[/u][/color][/size][/url][size=4] 协议进行授权，[b]转载本帖时须注明[color=#ff0000]原作者[/color]以及[color=#ff0000]本帖地址[/color][/b]。[/size][hr]\n[size=6][b][color=silver]${bbcode}[/color][/b][/size][size=6][b]${bbcode}[/b][/size]\n`;
      bbcode += await converthelpElementsToBBCode(content, ctx);
      bbcode += `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u] help.minecraft.net 上的 ${title}[/u][/color][/url]】[/b]\n【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] 用户脚本 v${version}】\n`;
      bbcode += getFooter("INSIDER", VersionType.Normal);
      GM_setClipboard(bbcode, {
        type: "text",
        mimetype: "text/plain",
      });
      button.innerText = "已复制!";
      setTimeout(() => (button.innerText = "复制 BBCode （KLPBBS）"), 5000);
    };
    const container = document.createElement("div");
    container.id = "spxxklp-buttons";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    container.style.width = "100%";
    container.style.padding = "10px";
    container.style.boxSizing = "border-box";
    container.append(button);

    controlDOM(button);
  }

  async function convertZendeskArticleToBBCode(
    html,
    articleUrl,
    translator = config.translator,
    titleSlice,
    contentClass,
    versionType
  ) {
    const title = html.title.slice(0, html.title.lastIndexOf(titleSlice));
    const ctx = {
      bugs: {},
      title: title,
      date: null,
      translator,
      url: articleUrl,
    };
    const content = await getZendeskContent(html, ctx, contentClass);
    const posted = await getZendeskDate(location.href);
    const header = versionType ? getHeader("news", versionType) : "";
    const footer = versionType ? getFooter("news", versionType) : "";
    const ans = `${header}[align=center][size=6][b][color=Silver]${title}[/color][/b][/size]
${translate(
  `[size=6][b]${title}[/b][/size]`,
  ctx,
  "headings"
)}[/align]\n\n${content}\n
[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]${
      ctx.url.match(/https:\/\/(.*?)\//)[1]
    } ${posted.year} 年 ${posted.month} 月 ${posted.day} 日发布的 ${
      ctx.title
    }[/u][/color][/url]】[/b]
【本文排版借助了：[url=https://github.com/cinder0601/SPXXKLP][color=#388d40][u]SPXXKLP[/u][/color][/url] 用户脚本 v${spxxklpVersion}】\n\n${footer}`;
    return ans;
  }

  async function getZendeskContent(html, ctx, contentClass) {
    const rootSection = html.getElementsByClassName(contentClass)[0]; // Yep, this is the only difference.

    let ans = await converters.recurse(rootSection, ctx); // Add spaces between texts and '[x'.

    ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, "$1 $2"); // Add spaces between '[/x]' and texts.

    ans = ans.replace(/(\[\/[^\]]+?])([a-zA-Z0-9\-._])/g, "$1 $2");
    return ans;
  }

  async function getZendeskDate(url) {
    const req = new Promise((rs, rj) => {
      GM_xmlhttpRequest({
        method: "GET",
        url:
          "/api/v2/help_center/en-us/articles/" +
          url.match(/\/articles\/(\d+)/)[1],
        fetch: true,
        nocache: true,
        timeout: 7_000,
        onload: (r) => {
          try {
            rs(r.responseText);
          } catch (e) {
            rj(e);
          }
        },
        onabort: () => rj(new Error("Aborted")),
        onerror: (e) => rj(e),
        ontimeout: () => rj(new Error("Time out")),
      });
    });
    let res;
    await req.then((value) => {
      const rsp = JSON.parse(value);
      res = new Date(rsp.article.created_at);
    });
    let year, month, day;
    if (res.getFullYear() > 12) {
      year = res.getFullYear();
      month = res.getMonth() + 1;
      day = res.getDate();
    } else {
      year = "20" + res.getDate();
      month = res.getFullYear();
      day = res.getMonth() + 1;
    }
    return {
      year,
      month,
      day,
    };
  }

  function feedback() {
    let url = window.location.href; // 获取当前页面的URL
    let versionType = getVersionType(url); // 调用getVersionType函数确定versionType

    getZendesk(
      (button) => {
        document.querySelector(".topNavbar nav").append(button);
      },
      " – Minecraft Feedback",
      "article-info",
      versionType
    );
  }

  function help() {
    getHelpContent((button) => {
      document.querySelector(".mc-globalbanner").append(button);
    });
  }
  function twitter() {
    const ProfilePictures = new Map([
      ["Mojang", "https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg"],
      ["MojangSupport", "https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg"],
      ["MojangStatus", "https://s2.loli.net/2024/05/27/tMZKe4BmldgDv2P.jpg"],
      ["Minecraft", "https://s2.loli.net/2024/05/27/6QsES9CwgKMLv7I.jpg"],
      ["henrikkniberg", "https://s2.loli.net/2024/05/27/h2KGZEBks4XMTFq.png"],
      ["_LadyAgnes", "https://s2.loli.net/2024/05/27/ZoJsth1i8randl9.png"],
      ["kingbdogz", "https://s2.loli.net/2024/05/27/IH7aVTepiDXBZb2.png"],
      ["JasperBoerstra", "https://s2.loli.net/2024/05/27/Jh2doD1eG7A56TR.png"],
      ["adrian_ivl", "https://s2.loli.net/2024/05/27/itAL8hsGqk67cxS.png"],
      ["slicedlime", "https://s2.loli.net/2024/05/27/DY6gQscuX8HiA9e.jpg"],
      ["Cojomax99", "https://s2.loli.net/2024/05/27/DxeZ3rINFgTildA.png"],
      ["Mojang_Ined", "https://s2.loli.net/2024/05/27/dzX3pYy8TSa7uJt.png"],
      ["SeargeDP", "https://s2.loli.net/2024/05/27/nf7EKltTYXLgsxN.png"],
      ["Dinnerbone", "https://s2.loli.net/2024/05/27/Q4ebCE29vFwPmxn.png"],
      ["Marc_IRL", "https://s2.loli.net/2024/05/27/bcW5zXfQ84r9IO6.png"],
      ["Mega_Spud", "https://s2.loli.net/2024/05/27/TZwzsJBRhnLyuFx.png"],
      ["CornerHardMC", "https://s2.loli.net/2024/05/28/o4wLCvuRGi9Yxh7.png"],
      ["MinecraftWikiEN", "https://s2.loli.net/2024/06/23/fn1SeWpdmit86lQ.png"],
    ]); //More pictures can be added manually.
    function getTweetMetadata() {
      const tweetMetadata = {
        date: "",
        source: "",
        text: "",
        rawtext: "",
        tweetLink: "",
        urls: "",
        userName: "",
        userTag: "",
        lang: "",
      };
      const url = window.location.href;
      const regex = /https:\/\/x\.com\/([^/]+)\/status\/\d+/;
      const match = url.match(regex);
      tweetMetadata.userTag = match[1];
      let posterNameContent = [];
      const posterNameElements = document
        .querySelector('div[data-testid="User-Name"] a span')
        .querySelectorAll("span, img[alt]");
      for (const element of posterNameElements) {
        if (element.tagName.toLowerCase() === "span") {
          posterNameContent.push(element.textContent);
        } else if (element.tagName.toLowerCase() === "img" && element.alt) {
          posterNameContent.push(element.alt);
        }
      }
      tweetMetadata.userName = posterNameContent.join("");
      let texts = [];
      let rawTexts = [];

      const articleDivs = document
        .querySelector("article div[lang]")
        .querySelectorAll("a, span, img[alt]");

      for (const element of articleDivs) {
        let textContent = "";
        let rawContent = "";

        if (element.tagName.toLowerCase() === "a") {
          const url = element.href;
          let linkText = element.textContent.trim();
          const span = element.querySelector("span");
          if (span) {
            let spanContent = span.textContent.trim();
            linkText = linkText.replace(spanContent, "").trim();
          }
          textContent = `[url=${url}][color=#00bfff][u]${linkText}[/u][/color][/url]`;
          rawContent = linkText;
        } else if (element.tagName.toLowerCase() === "span") {
          if (
            !element.closest("a") &&
            element.querySelectorAll("a").length === 0
          ) {
            textContent = element.innerHTML;
            rawContent = element.textContent;
          }
        } else if (element.tagName.toLowerCase() === "img" && element.alt) {
          textContent = element.alt;
          rawContent = element.alt;
        }
        if (textContent.trim()) {
          texts.push(textContent);
          rawTexts.push(rawContent.replace(/<a.*?>(.*?)<\/a>/g, "$1"));
        }
      }
      tweetMetadata.text = texts.join("");
      tweetMetadata.rawtext = rawTexts.join("");
      //I have tried my best but failed, if it still returns 'http://' or 'https://', please add the link manually.
      tweetMetadata.lang = document
        .querySelector("article div[lang]")
        .getAttribute("lang");
      tweetMetadata.date = document.querySelector("time").innerHTML;
      tweetMetadata.source = document.querySelector(
        'article a[role="link"] span'
      ).innerText;
      tweetMetadata.tweetLink = window.location.href;

      return tweetMetadata;
    }

    function getTweetBbcode(tweet, mode) {
      const attributeColor = "#5B7083";
      const backgroundColor = mode === "dark" ? "#000000" : "#FFFFFF";
      const foregroundColor = mode === "dark" ? "#D9D9D9" : "#0F1419";
      const dateString = `${tweet.date} · ${tweet.source} · SPXXKLP v${spxxklpVersion} · 转载请注明原作者及本帖地址`;
      const content = tweet.text;
      const content1 = tweet.rawtext;

      return `[align=center][table=560,${backgroundColor}]
[tr][td][indent][font=-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif]
  [float=left][img=44,44]${
    ProfilePictures.get(tweet.userTag) || "<不支持的头像，请手动添加图片链接>"
  }[/img][/float][size=15px][b][color=${foregroundColor}]${
        tweet.userName
      }[/color][/b]
[color=${attributeColor}]@${tweet.userTag}[/color][/size]

[color=Silver][size=23px]${content1}[/color][/size]

[size=15px][color=${attributeColor}]由 ${GM_config.get("translator")} 翻译自${
        tweet.lang.startsWith("en") ? "英语" : ` ${tweet.lang}`
      }[/color][/size]

[color=${foregroundColor}][size=23px]${content}[/size]
  [/size][/color][/indent][align=center]<如有配图，请在此处添加>[/align]
  [indent][size=15px][url=${
    tweet.tweetLink
  }][color=${attributeColor}][u]${dateString}[/u][/color][/url][/size][/indent][/td][/tr]
  [/table][/align]`;
    }

    function x() {
      console.info("[SPXXKLP] Activated");

      const buttonLight = document.createElement("button");
      buttonLight.style.backgroundColor = "rgb(255, 255, 255)";
      buttonLight.style.color = "#000000";
      buttonLight.style.border = "none";
      buttonLight.style.padding = "5px 10px";
      buttonLight.style.borderRadius = "5px";
      buttonLight.style.fontSize = "15px";
      buttonLight.style.cursor = "pointer";
      buttonLight.style.transition = "background-color 0.3s ease";
      buttonLight.style.width = "180px";
      buttonLight.style.height = "50px";
      buttonLight.style.textAlign = "center";
      buttonLight.style.marginLeft = "auto";

      buttonLight.onmouseover = () => {
        buttonLight.style.backgroundColor = "rgb(223, 223, 223)";
      };
      buttonLight.onmouseout = () => {
        buttonLight.style.backgroundColor = "rgb(255, 255, 255)";
      };
      buttonLight.innerText = "复制 BBCode （KLPBBS）（浅色）";
      buttonLight.onclick = async () => {
        buttonLight.innerText = "处理中...";
        try {
          const bbcode = getTweetBbcode(getTweetMetadata(), "light");
          GM_setClipboard(bbcode, { type: "text", mimetype: "text/plain" });
          buttonLight.innerText = "已复制!";
        } catch (error) {
          console.error("Error processing BBCode (Light):", error);
          buttonLight.innerText = "错误!";
        }
        setTimeout(() => (buttonLight.innerText = "复制 BBCode （KLPBBS）（浅色）"), 5000);
      };

      const buttonDark = document.createElement("button");
      buttonDark.style.backgroundColor = "rgb(32, 32, 32)";
      buttonDark.style.color = "#FFFFFF";
      buttonDark.style.border = "none";
      buttonDark.style.padding = "5px 10px";
      buttonDark.style.borderRadius = "5px";
      buttonDark.style.fontSize = "15px";
      buttonDark.style.cursor = "pointer";
      buttonDark.style.transition = "background-color 0.3s ease";
      buttonDark.style.width = "180px";
      buttonDark.style.height = "50px";
      buttonDark.style.textAlign = "center";
      buttonDark.style.marginLeft = "auto";

      buttonDark.onmouseover = () => {
        buttonDark.style.backgroundColor = "rgb(42, 42, 42)";
      };
      buttonDark.onmouseout = () => {
        buttonDark.style.backgroundColor = "rgb(32, 32, 32)";
      };
      buttonDark.innerText = "复制 BBCode （KLPBBS）（深色）";
      buttonDark.onclick = async () => {
        buttonDark.innerText = "处理中...";
        try {
          const bbcode = getTweetBbcode(getTweetMetadata(), "dark");
          GM_setClipboard(bbcode, { type: "text", mimetype: "text/plain" });
          buttonDark.innerText = "已复制!";
        } catch (error) {
          console.error("Error processing BBCode (Dark):", error);
          buttonDark.innerText = "错误!";
        }
        setTimeout(() => (buttonDark.innerText = "复制 BBCode （KLPBBS）（深色）"), 5000);
      };

      const checkLoaded = setInterval(() => {
        const targetDiv = document.querySelector("article div[lang]");
        if (targetDiv && !document.querySelector("#spxxklp-buttons")) {
          const container = document.createElement("div");
          container.id = "spxxklp-buttons";
          container.style.display = "flex";
          container.style.flexDirection = "column";
          container.style.alignItems = "flex-end";
          container.style.width = "100%";
          container.style.padding = "10px";
          container.style.boxSizing = "border-box";
          container.append(buttonLight);
          container.append(buttonDark);
          targetDiv.parentElement.append(container);
          clearInterval(checkLoaded);
        }
      }, 300);
    }

    x();
  }
  switch (location.host) {
    case "www.minecraft.net": //Fuck minecraft.net what the heck are you doing.
      minecraftNet();
      break;

    case "x.com":
      twitter();
      break;

    case "feedback.minecraft.net":
      feedback();
      break;

    case "help.minecraft.net":
      help();
      break;
  }
})();
//# sourceMappingURL=bundle.user.js.map
