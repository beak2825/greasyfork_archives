// ==UserScript==
// @name         CurseForge汉化文本修正
// @namespace    https://www.yesterday17.cn/
// @version      1.0.1
// @description  修改CurseForge的汉化文本
// @author       Yesterday17
// @include      *://minecraft.curseforge.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374317/CurseForge%E6%B1%89%E5%8C%96%E6%96%87%E6%9C%AC%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/374317/CurseForge%E6%B1%89%E5%8C%96%E6%96%87%E6%9C%AC%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

"use strict";

(function() {
  const translation = {
    Elerium: {
      ControlPanel: {
        AreYouSureYouWantToDeleteName: "你确定要删除{0}吗？"
      },
      Developer: {
        AreYouSureRemoveRole:
          "Are you sure you would like to delete {0} from the company?"
      },
      Extension: {
        DeveloperWritableChannelSegmentVersion:
          "Developer Writable Channel Segment Version",
        DeveloperWritableChannelSegmentVersionDesc:
          "If present - the extension will be inactive unless the version string in the channel\u0027s developer segment matches this value",
        MobileConfirmDisableHeader:
          "Are you sure you want to disable mobile support?",
        MobileConfirmDisableMessage:
          "When this version is released users will no longer be able access your extension from mobile.",
        RequestIdentityLinkRequired: "Add Tooltip Copy",
        RequestIdentityLinkRequiredWithPurchases:
          "Request Identity Link required with In-Extension Purchases",
        RequiredPerChannelConfigurations: "Required Per Channel Configuration",
        RequiredPerChannelConfigurationsDesc:
          'If present - this must match the per channel configuration string, for activation to proceed. See the \u003ca href="https://dev.twitch.tv/docs/extensions/reference/#set-extension-required-configuration" target="_blank"\u003eSet Extension Required Configuration\u003c/a\u003e Endpoint.'
      },
      Global: { Favorite: "收藏", Unfavorite: "取消收藏" }
    },
    Global: {
      Buttons: {
        Cancel: "取消",
        Create: "创建",
        Delete: "删除",
        Edit: "编辑",
        Push: "Push",
        Update: "更新"
      },
      Calendar: { Month: "本月", Today: "今天", Week: "周" },
      Common: {
        Add: "添加",
        AddCharacter: "添加一个字符",
        AdvancedSearch: "高级搜索",
        Apply: "应用",
        Ascending: "递增",
        ClickHere: "点击这里",
        ColonConnector: "：",
        Comments: "评论",
        Confirm: "确认",
        ConfirmDelete: "您确定要删除{0}吗？",
        Descending: "降序",
        Description: "描述",
        EditMyAccount: "编辑我的帐户",
        EmailErrorMessage: "必须是一个电子邮件地址。",
        EqualErrorMessage: "{0}必须与{1}相等",
        ErrorOccured: "抱歉，处理请求时发生错误。",
        FileContainsVirus: "文件已被病毒感染",
        IntegerValueErrorMessageMaximum: "必须在{0}以下。",
        IntegerValueErrorMessageMinimum: "必须在{0}以上。",
        LengthErrorMessageMaximum:
          "长度最大为{0}。",
        LengthErrorMessageMinimum:
          "长度最小为{0}。",
        Logout: "注销",
        Milliseconds: "{0}毫秒",
        More: "更多",
        MyCharacters: "我的角色",
        Name: "名字",
        New: "New",
        Normal: "正常",
        NumberOfPrivateMessagesAbbr: "{0}条私信",
        PageOf: "第{0}页，共{1}页",
        PageXOfY: "第{0}页，共{1}页",
        PleaseLogIn: "请登录",
        PleaseWaitProcessing: "请稍候，正在处理中…",
        PrivateMessagesAbbr: "PMs",
        QuoteFrom: "引用{0}",
        Remove: "删除",
        RequiredErrorMessage: "此字段是必需的。",
        RestoreContent: "还原内容",
        SelectCharacter: "选择一个字符",
        SimpleSearch: "简单搜索",
        Submit: "提交",
        TestStuff: "这只是一个测试。{0}只鸟。",
        Title: "标题",
        UserAsCharacter: "{0} as",
        UserAvatar: "{0}的头像",
        Username: "用户名",
        WelcomeUser: "欢迎您，{0}！"
      },
      ContentManagement: {
        AddMediaGallery: "添加媒体库",
        ExistingFolders: "现有目录",
        HideAddGallery: "不要添加媒体库",
        Insert: "插入",
        InsertAnImage: "插入图片",
        OnSelectedTemplate: "应用以选择（{0}）",
        PageFormDoNotSetDate: "不设置日期",
        PageFormSetDate: "设置日期",
        PublishOnTemplate: "发布{0}",
        SelectImage: "选择一张图片"
      },
      Contests: {
        ContestPrizeItemAwardSubject: "你得到了奖励：{0}",
        ContestPrizeItemHtmlBody:
          '你得到了奖励：{1}.\r\n\r\n\u003ca href="{2}" target=_blank\u003e{0}\u003c/a\u003e',
        ContestPrizeItemTextBody:
          "你得到了奖励：{0}.\r\n\r\n访问{1}以领取奖励。",
        YouAreDisqualified: "你已被取消资格！"
      },
      ControlPanel: {
        AddNewHeader: "添加新标题",
        AddSubNavigationLink:
          '\u003cdiv class="header"\u003e新增分导航\u003c/div\u003e添加一个分导航链接',
        BulkConfirm: "你确定要{0}这些项目吗？",
        CompLegacySubscription: "Issue Comp",
        "Contactology Campaigns": "Contactology Campaigns",
        EntitySubscriptionTypes: "Entity Subscription Types",
        LegacySubscriptions: "Legacy Subscriptions",
        LegacySubscriptionSearch: "Search Legacy Subscriptions",
        MenuLegacySubscriptions: "Legacy Subscriptions",
        MinimumPostCount: "Minimum Post Count",
        MovePrivateMessagesPrompt:
          '您确定要将这些私信移动到"${0}"目录内？',
        PushNotification: "推送通知",
        RemoveLinkTooltip:
          '\u003cdiv class="header"\u003e删除链接\u003c/div\u003e删除这从你的网站导航链接。',
        SubscriptionID: "Subscription ID",
        SubscriptionTypeEdit: "Subscription Type Edit",
        SubscriptionTypePush: "Push Subscription Type Notification",
        SubscriptionTypes: "Subscription Types",
        SimpleSearch: "Simple Search"
      },
      Dates: {
        AprilAbbr: "4月",
        AugustAbbr: "8月",
        Days: "{0}天",
        DecemberAbbr: "12月",
        FebruaryAbbr: "2月",
        FridayAbbr: "周五",
        FutureFormat: "{0} from now",
        Hours: "{0}小时",
        JanuaryAbbr: "1月",
        JulyAbbr: "7月",
        JuneAbbr: "6月",
        LessThanOneMinute: "不到一分钟",
        MarchAbbr: "3月",
        MayAbbr: "5月",
        Minutes: "{0}分钟",
        MondayAbbr: "周一",
        NovemberAbbr: "11月",
        OctoberAbbr: "10月",
        OneMinute: "1分钟",
        PastFormat: "{0}前",
        SaturdayAbbr: "周六",
        Seconds: "{0}秒",
        SeptemberAbbr: "9月",
        StandardDateFormat: "{2}年{1}{0}日",
        StandardDateTimeFormat: "{1}，{0} {4} {6} {2}:{3}:{5}",
        SundayAbbr: "周日",
        ThursdayAbbr: "周四",
        TuesdayAbbr: "周二",
        WednesdayAbbr: "周三"
      },
      ErrorMessages: {
        NumericPrecisionDecimalDigitCountErrorMessageTemplate:
          "您提供的数值有{0}位小数，而限制为{1}位。",
        TagEmpty: "您不能添加一个空的标签。"
      },
      Files: {
        AddAttachment: "添加此附件",
        ChangeDescription: "更改此附件的说明",
        DeleteAttachment: "删除此附件",
        FileTooLarge: "文件太大，请上传小于{0}的文件。"
      },
      Forums: {
        Add: "添加",
        CreateForum: "创建论坛",
        Delete: "删除",
        EditForum: "编辑论坛",
        GoToFirstUnreadPost: "转到第一个未读的帖子",
        JumpToPage: "跳到页",
        LockThread: "锁定主题",
        Moderator: "主持人",
        Move: "移动",
        OnSelected: "在选择（{0}）",
        RestoreContentDescription:
          "如果上次输入出错，请单击以恢复上次输入的文本",
        SearchForums: "搜索论坛",
        SelectAll: "全选",
        SendMessage: "发送消息",
        Unread: "未读",
        ViewPosts: "查看帖子",
        ViewProfile: "查看用户信息"
      },
      Languages: {
        Arabic: "阿拉伯语",
        "Brazillian Portugese": "巴西葡萄牙语",
        BritishEnglish: "英语（英国）",
        English: "英语",
        French: "法语",
        German: "德语",
        Greek: "希腊语",
        Indonesian: "印度尼西亚语",
        Italian: "意大利语",
        Japanese: "日语",
        Korean: "汉语",
        LatinAmericanSpanish: "拉丁美洲西班牙语",
        Polish: "波兰语",
        Russian: "俄语",
        SimplifiedChinese: "简体中文",
        Spanish: "西班牙语",
        Swedish: "瑞典语",
        TraditionalChinese: "繁体中文",
        Uzbec: "乌兹别克语",
        Vietnamese: "越南语"
      },
      MailTemplates: {
        ReportBody:
          'Hello {0},\r\n\r\n\u003cp\u003e{6} has reported this \u003ca href="{4}"\u003econtent\u003c/a\u003e on \u003ca href="{7}"\u003e{8}\u003c/a\u003e for the reason {2}.\u003c/p\u003e\r\n\u003cp\u003e{9}\u003c/p\u003e\r\n\u003cp\u003eYou can view the report by \u003ca href="{7}"\u003evisiting the report page\u003c/a\u003e.\u003c/p\u003e\r\n\r\n\u003cp\u003eReported content:\r\n\u003cblockquote\u003e\r\nPosted by \u003ca href="{5}"\u003e{10}\u003c/a\u003e\r\n\u003cp\u003e\r\n{3}\r\n\u003c/p\u003e\r\n\u003c/blockquote\u003e\u003c/p\u003e\r\n\r\n__\r\n\u003cp style="font-size:11px"\u003eTo unsubscribe from these email notifications, go to \u003ca href="{1}"\u003eyour notifications page.\u003c/a\u003e\u003c/p\u003e'
      },
      Polls: {
        AddChoice: "添加选择",
        AddPoll: "添加一项民意调查",
        ChoiceNumberTemplate: "选择＃{0}",
        HideResults: "隐藏结果",
        RemoveChoice: "删除选择",
        RemovePoll: "不要添加的民意调查",
        ViewResults: "查看结果"
      },
      Ratings: {
        YouRatedThis:
          "您的打分是{0}星。{2}名用户的平均打分是{1}星。"
      },
      Reporting: { Report: "报告" },
      TinyMCE: { XenonMediaPluginDesc: "从目录中添加文件" },
      Translator: {
        ReportATranslation: "Report a Translation",
        ReportTranslationInstructions:
          "要报告翻译，请单击带有虚线下划线的文本。"
      },
      Upsells: {
        SubscriptionRequiresLogin: "您必须登录才能订阅。"
      },
      UserRegistration: {
        ConfirmPassword: "确认密码",
        Password: "密码",
        RecoverAccountStep2Info2:
          "输入一个新的帐户密码，然后点击\u0027更改密码\u0027按钮。",
        Username: "用户名",
        UsernameIsTaken: "该用户名已被注册。"
      },
      Widgets: {
        LatestPosts: "最新帖子",
        LatestNews: "最新新闻",
        Poll: "调查",
        WhosOnline: "在线用户",
        RandomPicture: "随机图片",
        Calendar: "日历",
        Recruitment: "招聘"
      }
    }
  };

  /**
   * Add localization script
   */
  const script = document.createElement("script");
  script.innerHTML = `Elerium.Localization.populate(7, ${JSON.stringify(
    translation
  )});`;

  /**
   * 匹配规则
   */
  const category = /^\/modpacks|customization|mc-addons|mc-mods|texture-packs|worlds(?:\/[a-zA-Z0-9\-]+)*$/;
  const project = /^\/projects\/[a-zA-Z0-9\-]+$/;
  const files = /^\/projects\/[a-zA-Z0-9\-]+\/files$/;
  const dependencies = /^\/projects\/[a-zA-Z0-9\-]+\/relations\/dependencies$/;
  const dependents = /^\/projects\/[a-zA-Z0-9\-]+\/relations\/dependents$/;

  const dictionary = {
    projects: "项目",
    forum: "论坛",
    "reward-store": "Reward Store",
    dashboard: "Dashboard",
    feedback: "反馈",

    modpack: "整合包",
    customization: "Customization",
    addons: "Addons",
    mods: "模组",
    "texture-packs": "材质包",
    worlds: "世界",

    search: "搜索",
    "new-project": "新建项目",
    popularity: "热度",
    "date-created": "创建时间",
    "last-updated": "最近更新",
    name: "名称",
    "total-downloads": "总下载量",
    relations: "依赖关系"
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    const path = new URL(document.URL).pathname;
    const root = `/${path.split("/")[1]}/${path.split("/")[2]}`;

    // 加载修改过的汉化
    document.head.appendChild(script);

    // 修改全局共通的文本
    document.querySelector("#nav-projects a span").innerText =
      dictionary.projects;
    document.querySelector("#nav-forums a span").innerText = dictionary.forum;
    document.querySelector("#nav-reward-store a span").innerText =
      dictionary["reward-store"];
    document.querySelector("#nav-dashboard a span").innerText =
      dictionary.dashboard;
    document.querySelector("#nav-feedback a span").innerText =
      dictionary.feedback;

    document.querySelectorAll("#nav-projects li a span")[0].innerText =
      dictionary.modpack;
    document.querySelectorAll("#nav-projects li a span")[1].innerText =
      dictionary.customization;
    document.querySelectorAll("#nav-projects li a span")[2].innerText =
      dictionary.addons;
    document.querySelectorAll("#nav-projects li a span")[3].innerText =
      dictionary.mods;
    document.querySelectorAll("#nav-projects li a span")[4].innerText =
      dictionary["texture-packs"];
    document.querySelectorAll("#nav-projects li a span")[5].innerText =
      dictionary.worlds;

    // 搜索框的 placeholder
    document.querySelector(".b-search-input").placeholder =
      dictionary.search + "…";

    if (path == "/") {
    } else if (path == "/projects") {
      // <h2>
      document.querySelectorAll(".category-info h2")[0].innerText =
        dictionary.modpack;
      document.querySelectorAll(".category-info h2")[1].innerText =
        dictionary.customization;
      document.querySelectorAll(".category-info h2")[2].innerText =
        dictionary.addons;
      document.querySelectorAll(".category-info h2")[3].innerText =
        dictionary.mods;
      document.querySelectorAll(".category-info h2")[4].innerText =
        dictionary["texture-packs"];
      document.querySelectorAll(".category-info h2")[5].innerText =
        dictionary.worlds;

      // <p>, description
      const proj_from_reg = /^(\d+) projects by (\d+) authors with more than ([\d,]+) downloads.$/;
      const proj_to = "已有$2位作者创建了$1个项目，总下载次数已超过$3次。";
      for (const node of document.querySelectorAll(".category-info p")) {
        node.innerText = node.innerText.replace(proj_from_reg, proj_to);
      }

      // 按钮：启动项目 -> 新建项目
      for (const node of document.querySelectorAll(
        ".project-category .button span"
      )) {
        node.innerText = dictionary["new-project"];
      }
    } else if (path.match(category)) {
      console.log("category");
      // 新建项目
      document.querySelector(".project-listing-header li a span").innerText =
        dictionary["new-project"];

      // 排序方式
      document.querySelectorAll("#filter-sort option")[0].innerText =
        dictionary["date-created"];
      document.querySelectorAll("#filter-sort option")[1].innerText =
        dictionary["last-updated"];
      document.querySelectorAll("#filter-sort option")[2].innerText =
        dictionary.name;
      document.querySelectorAll("#filter-sort option")[3].innerText =
        dictionary.popularity;
      document.querySelectorAll("#filter-sort option")[4].innerText =
        dictionary["total-downloads"];

      // Prev -> 上一页
      for (let node of document.querySelectorAll('a[rel="prev"]')) {
        if (node.innerText == "Prev") {
          node.innerText = "上一页";
        }
      }

      // Next -> 下一页
      for (let node of document.querySelectorAll('a[rel="next"]')) {
        if (node.innerText == "Next") {
          node.innerText = "下一页";
        }
      }
    } else if (
      path.match(project) ||
      path.match(files) ||
      path.match(dependencies) ||
      path.match(dependents)
    ) {
      // 相同部分同时处理
      document.querySelector(`li a[href="${root}"]`).innerText = "简介";
      document.querySelector(`li a[href="${root}/files"]`).innerText =
        "文件";
      if (document.querySelector(`li a[href="${root}/images"]`)) {
        document.querySelector(`li a[href="${root}/images"]`).innerText =
          "图片";
      }
      document.querySelector(
        `.e-hasSubmenu>a[href="${root}/relations/dependencies"]`
      ).innerText = dictionary.relations;
      // TODO: 对每个页面不同的部分进行细分汉化
      if (path.match(project)) {
        console.log("project");
      } else if (path.match(files)) {
        console.log("files");
      } else if (path.match(dependencies)) {
        console.log("dependencies");
      } else if (path.match(dependents)) {
        console.log("dependents");
      }
    } else {
      console.log("others");
    }
  });
})();
