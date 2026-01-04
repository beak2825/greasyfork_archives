// ==UserScript==
// @name         贴吧助手
// @namespace    蒋晓楠
// @version      20240307
// @description  能按照用户和关键词屏蔽不想看的贴，屏蔽低于指定等级用户，也可以给用户打标签帮助自己记忆此人的特点，屏蔽置顶直播
// @author       蒋晓楠
// @license MIT
// @match        https://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/f?*kw=*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_notification
// @grant GM_addStyle
// @grant GM_addElement
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/473343/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473343/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//执行间隔(秒)
let Interval = 1;
//过期数据清理延时(秒)
let ClearExpireDataDelay = 30;
//过期数据清理几率百分比,范围0-100
let ClearExpireDataPercent = 2;
//以下不懂的不要修改
//页面类型
const PAGE_TYPE_LIST = 0;//列表
const PAGE_TYPE_POST = 1;//帖子
let PageType = location.pathname === "/f" ? PAGE_TYPE_LIST : PAGE_TYPE_POST;

//获取数据
function GetData() {
    return GM_getValue("List", { User: [], UserTime: {}, Keyword: { Title: {}, Content: {} }, UserTag: {} });
}

//保存数据
function SaveData(Data) {
    GM_setValue("List", Data);
}

//修改配置
function SetConfig(Key, Value) {
    GM_setValue("Config:" + Key, Value);
}

//获取配置
function GetConfig(Key, Default) {
    return GM_getValue("Config:" + Key, Default);
}

//删除配置
function RemoveConfig(Key) {
    GM_deleteValue("Config:" + Key);
}

//提醒
function Tips(Message) {
    GM_notification({ title: "贴吧助手", text: Message, timeout: 3000 });
}

//初始化样式
function InitCSS() {
    GM_addStyle(`.JXNButton{border:1px solid;margin-right:10px}.BlockUser{width:90%}.JXNInput{width:50px;}.JXNTag{border:1px solid black;margin:5px 1px;display:inline-block;min-width:50px;}.JXNTagBox{width:90px;}.JXNHolder{width:250px;position:absolute;left:10px;z-index:1;top:135px}.PostListBlockUser{position:absolute;right:0;margin-right:0;z-index:1}`);
}

//获取有效天数
function GetExpireDay() {
    return GetConfig("ExpireDay", 180);
}

//设置有效天数
function SetExpireDay(Value) {
    SetConfig("ExpireDay", parseInt(Value));
}

//获取当前时间
function GetNowTime() {
    let Now = new Date();
    return parseInt(Now.getFullYear().toString() + (Now.getMonth() + 1).toString().padStart(2, "0") + Now.getDate().toString().padStart(2, "0"));
}

//获取新的过期时间
function GetNewExpiredDay() {
    let Now = new Date();
    Now.setDate(Now.getDate() + GetExpireDay());
    return parseInt(Now.getFullYear().toString() + (Now.getMonth() + 1).toString().padStart(2, "0") + Now.getDate().toString().padStart(2, "0"));
}

//屏蔽用户存在
function BlockUserIsExist(Id) {
    return GetData().User.indexOf(Id) > -1;
}

//添加屏蔽用户
function AddBlockUser(Id) {
    let Data = GetData();
    Data.User.push(Id);
    Data.UserTime[Id] = GetNewExpiredDay();
    SaveData(Data);
}

//移除屏蔽用户
function RemoveBlockUser(Id) {
    let Data = GetData();
    let Index = Data.User.indexOf(Id);
    if (Index > -1) {
        Data.User.splice(Index, 1);
        delete Data.UserTime[Id];
        SaveData(Data);
    }
}

//获取当前关键词类型
function GetNowKeyWordType() {
    return parseInt(document.querySelector(".JXNMatchType").value);
}

//获取当前关键词模式
function GetNowKeyWordMode() {
    return parseInt(document.querySelector(".JXNMatchMode").value);
}

//屏蔽关键词存在
function BlockKeywordIsExist(Type, Value) {
    return GetData().Keyword[Type === 0 ? "Title" : "Content"][Value] !== undefined;
}

//添加屏蔽关键词
function AddBlockKeyword(Type, Mode, Value) {
    let Data = GetData();
    Data.Keyword[Type === 0 ? "Title" : "Content"][Value] = { Mode: Mode, Time: GetNewExpiredDay() };
    SaveData(Data);
}

//移除屏蔽关键词
function RemoveBlockKeyword(Type, Value) {
    let Data = GetData();
    let KeyWord = Data.Keyword;
    let Key = Type === 0 ? "Title" : "Content";
    if (KeyWord[Key][Value] !== undefined) {
        delete Data.Keyword[Key][Value];
        SaveData(Data);
    }
}

//获取用户标签
function GetUserTags(UserId) {
    let Data = GetData();
    if (Data.UserTag[UserId] === undefined) {
        return {};
    } else {
        return Data.UserTag[UserId];
    }
}

//用户添加标签
function UserAddTag(UserId, Tag) {
    let Data = GetData();
    //初始化该用户的标签
    if (Data.UserTag[UserId] === undefined) {
        Data.UserTag[UserId] = {};
    }
    Data.UserTag[UserId][Tag] = GetNewExpiredDay();
    SaveData(Data);
}

//用户移除标签
function UserRemoveTag(UserId, Tag) {
    let Data = GetData();
    let UserTags = Data.UserTag[UserId];
    if (UserTags !== undefined && UserTags[Tag] !== undefined) {
        Object.getOwnPropertyNames(UserTags).length === 1 ? delete Data.UserTag[UserId] : delete UserTags[Tag];
        SaveData(Data);
    }
}

//帖子列表的额外屏蔽
function PostListExtraBlock() {
    //置顶直播
    if (GetConfig("BlockTopLive") === true && document.querySelector("[id^=pagelet_live]") !== null) {
        document.querySelector("[id^=pagelet_live]").remove();
    }
    //关闭会员红贴
    if (GetConfig("BanMemberPost", true) && document.querySelector(".member_thread_title_frs") !== null) {
        document.querySelectorAll(".member_thread_title_frs").forEach((TitleHolder) => {
            TitleHolder.classList.remove("member_thread_title_frs");
        });
    }
}

//内容过滤
function ContentFilter(Content) {
    Content = Content.trim();
    if (Content !== "") {
        //过滤非中文/英文/数字
        Content = Content.replace(/[^\da-zA-Z\u4e00-\u9fa5]/g, "");
    }
    return Content;
}

//检测标题关键词
function CheckKeywordTitle(Title) {
    let TitleKeyWords = GetData().Keyword.Title;
    for (const Keyword in TitleKeyWords) {
        if (TitleKeyWords[Keyword].Mode === 0) {
            if (Title.indexOf(Keyword) > -1) {
                return Keyword;
            }
        } else if (Keyword === Title) {
            return Keyword;
        }
    }
    return false;
}

//检测内容关键词
function CheckKeywordContent(Content) {
    let ContentWords = GetData().Keyword.Content;
    for (const Keyword in ContentWords) {
        if (ContentWords[Keyword].Mode === 0) {
            if (Content.indexOf(Keyword) > -1) {
                return Keyword;
            }
        } else if (Keyword === Content) {
            return Keyword;
        }
    }
    return false;
}

//帖子列表初始化
function InitPostList() {
    let StartTime = (new Date()).getTime();
    let Posts = document.querySelectorAll(".j_thread_list:not(.JXNProcessed)");
    let Number = Posts.length;
    if (Number > 0) {
        let BlockAlphaNumberTitle = GetConfig("BlockAlphaNumberTitle", false),
            EnableContentFilter = GetConfig("ContentFilter", false);
        for (let i = 0; i < Posts.length; i++) {
            let Post = Posts[i];
            let User = Post.querySelector(".tb_icon_author");
            if (User === null) {
                //添加已处理标记
                Post.classList.add("JXNProcessed");
            } else {
                let DisplayName = Post.querySelector(".frs-author-name").textContent;
                let UserId = JSON.parse(Post.querySelector(".tb_icon_author").getAttribute("data-field")).user_id;
                let Title = Post.querySelector(".threadlist_title>a").getAttribute("title");
                //屏蔽纯字母数字标题
                if (BlockAlphaNumberTitle && /^[0-9a-zA-Z]*$/.test(Title)) {
                    console.log(`${DisplayName}(${UserId})的帖子[${Title}]被屏蔽因为标题为纯字母数字`);
                    Post.remove();
                }
                //按用户ID屏蔽
                else if (BlockUserIsExist(UserId)) {
                    console.log(`${DisplayName}(${UserId})的帖子[${Title}]被屏蔽因为在用户屏蔽列表内`);
                    Post.remove();
                } else {
                    //按关键词屏蔽
                    let Result = CheckKeywordTitle(Title);
                    if (Result === false) {
                        let Content = Post.querySelector(".threadlist_abs_onlyline");
                        if (Content !== null) {
                            Content = Content.textContent;
                            if (EnableContentFilter)
                                Content = ContentFilter(Content);
                            if (Content !== "") {
                                Result = CheckKeywordContent(Content);
                                if (Result !== false) {
                                    console.log(`${DisplayName}(${UserId})的帖子[${Title}]被屏蔽因为内容触发关键词[${Result}]`);
                                    Post.remove();
                                    continue;
                                }
                            }
                        }
                        //添加屏蔽按钮
                        let BlockButton = document.createElement("button");
                        BlockButton.classList.add("JXNButton");
                        BlockButton.classList.add("PostListBlockUser");
                        BlockButton.textContent = "屏蔽用户";
                        BlockButton.onclick = () => {
                            if (BlockUserIsExist(UserId)) {
                                Tips("此用户已存在");
                            } else {
                                AddBlockUser(UserId)
                                //添加取消屏蔽按钮
                                let CancelButton = document.createElement("button");
                                CancelButton.classList.add("JXNButton");
                                CancelButton.classList.add("PostListBlockUser");
                                CancelButton.textContent = "取消屏蔽";
                                CancelButton.onclick = () => {
                                    if (BlockUserIsExist(UserId)) {
                                        RemoveBlockUser(UserId);
                                        CancelButton.remove();
                                        Tips("已取消对此用户的屏蔽");
                                    } else {
                                        Tips("此用户不存在");
                                    }
                                }
                                Post.prepend(CancelButton);
                                Tips("添加成功,刷新后将自动屏蔽此用户的发帖与回复");
                                BlockButton.remove();
                            }
                        }
                        Post.prepend(BlockButton);
                        Post.classList.add("JXNProcessed");
                    } else {
                        console.log(`${DisplayName}(${UserId})的帖子[${Title}]被屏蔽因为标题触发关键词[${Result}]`);
                        Post.remove();
                    }
                }
            }
        }
        //额外屏蔽
        PostListExtraBlock();
        console.log("屏蔽用时:" + ((new Date()).getTime() - StartTime) + "毫秒");
    }
}

//初始化用户面板
function InitUserPanel(UserId, UserBlock) {
    setTimeout(() => {
        let BlockButton = GM_addElement(UserBlock, "button", {
            class: "JXNButton BlockUser",
            textContent: "屏蔽"
        });
        BlockButton.onclick = () => {
            if (BlockUserIsExist(UserId)) {
                Tips("此用户已存在");
            } else {
                AddBlockUser(UserId)
                //添加取消屏蔽按钮
                let CancelButton = GM_addElement(UserBlock, "button", {
                    textContent: "取消屏蔽", class: "JXNButton BlockUser"
                });
                CancelButton.onclick = () => {
                    if (BlockUserIsExist(UserId)) {
                        RemoveBlockUser(UserId);
                        Tips("已取消对此用户的屏蔽");
                    } else {
                        Tips("此用户不存在");
                    }
                }
                Tips("添加成功,刷新后将自动屏蔽此用户的发帖与回复");
                BlockButton.remove();
            }
        }
        let Tags = GetUserTags(UserId);
        for (const Tag in Tags) {
            let NowTag = GM_addElement(UserBlock, "button", {
                textContent: Tag,
                class: "JXNTag",
                title: "点击删除此标签"
            });
            NowTag.onclick = () => {
                UserRemoveTag(UserId, Tag);
                Tips("删除完成");
                NowTag.remove();
            }
        }
        //创建添加标签框
        let TagBox = GM_addElement(UserBlock, "input", {
            type: "text",
            class: "JXNInput JXNTagBox"
        });
        let Button = GM_addElement(UserBlock, "button", {
            textContent: "添加",
            class: "JXNButton JXNTagRemove",
            title: "添加标签"
        });
        Button.onclick = () => {
            let Tag = TagBox.value;
            if (Tag !== "") {
                UserAddTag(UserId, Tag);
                Tips("添加完成,刷新后会正确显示");
            }
        }
    }, Interval);
}

//帖子内初始化
function InitPosts() {
    let StartTime = (new Date()).getTime();
    let Posts = document.querySelectorAll(".l_post:not([data-index]):not(.JXNProcessed)");
    let Number = Posts.length;
    if (Number > 0) {
        let BlockLevelUserValue = GetConfig("BlockLevelUser", 2),
            EnableContentFilter = GetConfig("ContentFilter", false);
        let ContentResult;
        for (let i = 0; i < Number; i++) {
            let Post = Posts[i];
            //按等级屏蔽用户
            if (BlockLevelUserValue > 18) {
                Post.remove();
                continue;
            }
            let UserBlock = Post.querySelector(".p_author");
            let DisplayName = UserBlock.querySelector(".p_author_name").textContent;
            let UserId = JSON.parse(Post.querySelector(".d_name").getAttribute("data-field")).user_id;
            if (BlockLevelUserValue > 1 && parseInt(UserBlock.querySelector(".d_badge_lv").textContent) < BlockLevelUserValue) {
                console.log(`${DisplayName}(${UserId})的楼层被屏蔽因为等级低于${BlockLevelUserValue}`);
                Post.remove();
                continue;
            }
            if (BlockUserIsExist(UserId)) {
                console.log(`${DisplayName}(${UserId})的楼层被屏蔽因为在用户屏蔽列表内`);
                Post.remove();
            } else {
                let Content = Post.querySelector(".d_post_content").textContent;
                if (EnableContentFilter)
                    Content = ContentFilter(Content);
                //检测内容关键词
                if (Content.length > 0 && (ContentResult = CheckKeywordContent(Content)) !== false) {
                    console.log(`${DisplayName}(${UserId})的楼层被屏蔽因为内容触发关键词[${ContentResult}]`);
                    Post.remove();
                    continue;
                }
                //初始化用户面板
                InitUserPanel(UserId, UserBlock);
                //添加已处理标记
                Post.classList.add("JXNProcessed");
            }
        }
        console.log("屏蔽用时:" + ((new Date()).getTime() - StartTime) + "毫秒");
    }
}

//通过地址初始化相应功能
function InitFunctionByURL() {
    let Function = PageType === PAGE_TYPE_LIST ? InitPostList : InitPosts;
    //初始执行
    Function();
    //定期执行
    setInterval(() => {
        Function();
    }, Interval * 1000);
}

//初始化操作界面
function InitUI() {
    //脚本菜单
    //屏蔽置顶直播
    GM_registerMenuCommand((GetConfig("BlockTopLive", false) === true ? "✅" : "❎") + "屏蔽置顶直播", () => {
        SetConfig("BlockTopLive", GetConfig("BlockTopLive", false) !== true);
    });
    //屏蔽纯字母数字标题
    GM_registerMenuCommand((GetConfig("BlockAlphaNumberTitle", false) === true ? "✅" : "❎") + "屏蔽纯字母数字标题", () => {
        SetConfig("BlockAlphaNumberTitle", GetConfig("BlockAlphaNumberTitle", false) !== true);
    });
    //关闭会员红贴
    GM_registerMenuCommand((GetConfig("BanMemberPost", true) === true ? "✅" : "❎") + "关闭会员红贴", () => {
        SetConfig("BanMemberPost", GetConfig("BanMemberPost", false) !== true);
    });
    //内容预过滤
    GM_registerMenuCommand((GetConfig("ContentFilter", false) === true ? "✅" : "❎") + "内容预过滤", () => {
        SetConfig("ContentFilter", GetConfig("ContentFilter", false) !== true);
    });
    //导出数据
    GM_registerMenuCommand("导出数据", () => {
        let ExportJson = document.createElement("a");
        ExportJson.download = "贴吧助手.json";
        ExportJson.href = URL.createObjectURL(new Blob([JSON.stringify(GetData())]));
        ExportJson.click();
    });
    //页面菜单
    //油猴脚本不提供在指定元素后面创建的api
    let Holder = document.createElement("div");
    Holder.classList.add("JXNHolder");
    let PositionElement = document.getElementById("head");
    PositionElement.after(Holder);
    //有效天数
    GM_addElement(Holder, "span", { textContent: "有效天数" });
    let Expire = GM_addElement(Holder, "input", {
        type: "number",
        min: 1,
        step: 1,
        value: GetExpireDay(), class: "JXNInput"
    });
    GM_addElement(Holder, "br", {});
    if (PageType === PAGE_TYPE_POST) {
        //按等级屏蔽用户
        GM_addElement(Holder, "span", { textContent: "屏蔽低于此等级用户" });
        let BlockLevelUser = GM_addElement(Holder, "input", {
            type: "number", value: GetConfig("BlockLevelUser", 2), min: 1, max: 19, step: 1
        });
        BlockLevelUser.onchange = () => {
            SetConfig("BlockLevelUser", this.value);
        }
        GM_addElement(Holder, "br", {});
    }
    //关键词
    GM_addElement(Holder, "span", { textContent: "关键词" });
    let Keyword = GM_addElement(Holder, "input", {
        type: "text",
    });
    GM_addElement(Holder, "br", {});
    //匹配类型
    GM_addElement(Holder, "span", { textContent: "匹配类型" });
    let MatchType = GM_addElement(Holder, "select", { class: "JXNMatchType" });
    MatchType.add(new Option("标题", 0));
    MatchType.add(new Option("内容", 1));
    MatchType.value = GetConfig("MatchType", 0);
    //匹配模式
    GM_addElement(Holder, "span", { textContent: "匹配模式" });
    let MatchMode = GM_addElement(Holder, "select", { class: "JXNMatchMode" });
    MatchMode.add(new Option("部分", 0));
    MatchMode.add(new Option("全部", 1));
    MatchMode.value = GetConfig("MatchMode", 0);
    GM_addElement(Holder, "br", {});
    let AddKeyword = GM_addElement(Holder, "button", {
        textContent: "添加", class: "JXNButton"
    });
    let RemoveKeyword = GM_addElement(Holder, "button", {
        textContent: "删除", class: "JXNButton"
    });
    //导入选择块
    let ImportFile = GM_addElement(Holder, "input", {
        type: "file",
        hidden: true,
        accept: "application/json",
        value: false
    });
    //导入数据
    let ImportList = GM_addElement(Holder, "button", {
        textContent: "导入数据", class: "JXNButton"
    });
    //绑定事件
    //有效天数
    Expire.onchange = () => {
        SetExpireDay(Expire.value);
    }
    //匹配类型
    MatchType.onchange = () => {
        SetConfig("MatchType", MatchType.value);
    }
    //匹配模式
    MatchMode.onchange = () => {
        SetConfig("MatchMode", MatchMode.value);
    }
    //添加删除关键词
    AddKeyword.onclick = () => {
        let Value = Keyword.value;
        if (Value !== "") {
            if (BlockKeywordIsExist(GetNowKeyWordType(), Value)) {
                Tips("此关键词已存在");
            } else {
                AddBlockKeyword(GetNowKeyWordType(), GetNowKeyWordMode(), Value);
                Tips("添加成功");
            }
        }
    };
    RemoveKeyword.onclick = () => {
        let Value = Keyword.value;
        if (Value !== "") {
            if (BlockKeywordIsExist(GetNowKeyWordType(), Value)) {
                RemoveBlockKeyword(GetNowKeyWordType(), Value);
                Tips("删除成功");
            } else {
                Tips("此关键词不存在");
            }
        }
    }
    //导入数据
    ImportFile.onchange = () => {
        if (ImportFile.files.length > 0) {
            let JsonList = ImportFile.files[0];
            let Reader = new FileReader();
            Reader.onload = (Result) => {
                try {
                    SaveData(JSON.parse(Result.target.result));
                    Tips("导入完成");
                } catch (e) {
                    alert("读取的文件格式不正确");
                }
            };
            Reader.readAsText(JsonList);
        }
    }
    ImportList.onclick = () => {
        ImportFile.click();
    }
}

//清理过期数据
function ClearExpireData() {
    //浏览帖子达到一定时间才去执行清理
    setTimeout(() => {
        if (1 + Math.round(Math.random() * 99) <= ClearExpireDataPercent) {
            let NowDate = GetNowTime();
            let Data = GetData();
            //清理用户
            for (let i = 0; i < Data.User.length; i++) {
                let Id = Data.User[i];
                if (Data.UserTime[Id] < NowDate) {
                    console.log(`删除过期用户[${Id}]因为它的时间${Data.UserTime[Id]}]小于当前时间`);
                    RemoveBlockUser(Id);
                }
            }
            //清理标签
            let UserTag = Data.UserTag;
            for (const UserId in UserTag) {
                let Tags = UserTag[UserId];
                for (const Tag in Tags) {
                    if (Tags[Tag] < NowDate) {
                        console.log(`删除过期用户[${UserId}]的标签[${Tag}]因为它的时间${Tags[Tag]}小于当前时间`);
                        UserRemoveTag(UserId, Tag);
                    }
                }
            }
            //清理关键词
            let KeyWord = Data.Keyword;
            for (const BaseKey in KeyWord) {
                let Value = KeyWord[BaseKey];
                for (const Key in Value) {
                    let TheKeyWord = Value[Key];
                    if (TheKeyWord.Time < NowDate) {
                        console.log(`删除过期${BaseKey === "Title" ? "标题" : "内容"}关键词[${Key}]因为它的时间[${TheKeyWord.Time}]小于当前时间`);
                        RemoveBlockKeyword(BaseKey === "Title" ? 0 : 1, Key);
                    }
                }
            }
        }
    }, ClearExpireDataDelay * 1000);
}

//显示信息
function DisplayInfo() {
    setTimeout(() => {
        let Data = GetData();
        console.log("完整数据", Data);
        console.log("屏蔽数量:关键词-标题(" + Object.keys(Data.Keyword.Title).length + "),关键词-内容(" + Object.keys(Data.Keyword.Content).length + "),用户(" + Data.User.length + ")");
        console.log("当前时间:" + GetNowTime());
    }, 1000);
}

//运行
function Run() {
    InitCSS();
    InitUI();
    ClearExpireData();
    InitFunctionByURL();
    DisplayInfo();
}

Run();