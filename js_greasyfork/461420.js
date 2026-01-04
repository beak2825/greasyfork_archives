// ==UserScript==
// @name         BADTAG
// @version      1.2.6
// @description  Bilibili AD TAGging - tagging ad videos by analyzing danmaku stats
// @author       jamesliu96
// @license      MIT
// @namespace    https://jamesliu.info/
// @homepage     https://gist.github.com/jamesliu96/aeef912d74bdd184cbb6781f1f3939b1
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @connect      bilibili.com
// @require      https://cdn.jsdelivr.net/npm/protobufjs@7.4.0/dist/protobuf.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/461420/BADTAG.user.js
// @updateURL https://update.greasyfork.org/scripts/461420/BADTAG.meta.js
// ==/UserScript==

const RULES = [
  /[硬软推]广/,
  /(?:ying|ruan|tui)guang/i,
  /广[告子]/,
  /guang(?:gao|zi)/i,
  /[恰收]烂?[饭钱费]/,
  /(?:qia|shou)(?:lan)?(?:fan|qian|fei)/,
  /猝不及防/,
  /cubujifang/i,
  /拼(.)\1+/,
  /pdd/i,
  /黄车/,
  /[百千万亿]+补贴/,
  /带私?货/,
  /合作/,
  /接单/,
  /商业?单/,
  /连环?招/,
  /丝滑/,
  /大额/,
  /优惠/,
  /代金/,
  /帧起手/,
  /没完没了/,
  /定位/,
  /空降/,
  /降落/,
];

const THRES = 0.001;

// https://raw.githubusercontent.com/SocialSisterYi/bilibili-API-collect/076712a93152c69c7f5437392267925d897a6e63/grpc_api/bilibili/community/service/dm/v1/dm.proto
const PROTO = `syntax = "proto3";

package bilibili.community.service.dm.v1;

//弹幕
service DM {
    // 获取分段弹幕
    rpc DmSegMobile (DmSegMobileReq) returns (DmSegMobileReply);
    // 客户端弹幕元数据 字幕、分段、防挡蒙版等
    rpc DmView(DmViewReq) returns (DmViewReply);
    // 修改弹幕配置
    rpc DmPlayerConfig (DmPlayerConfigReq) returns (Response);
    // ott弹幕列表
    rpc DmSegOtt(DmSegOttReq) returns(DmSegOttReply);
    // SDK弹幕列表
    rpc DmSegSDK(DmSegSDKReq) returns(DmSegSDKReply);
    //
    rpc DmExpoReport(DmExpoReportReq) returns (DmExpoReportRes);
}

//
message Avatar {
    //
    string id = 1;
    //
    string url = 2;
    //
    AvatarType avatar_type = 3;
}

//
enum AvatarType {
    AvatarTypeNone = 0; //
    AvatarTypeNFT  = 1; //
}

//
message Bubble {
    //
    string text = 1;
    //
    string url = 2;
}

//
enum BubbleType {
    BubbleTypeNone           = 0; //
    BubbleTypeClickButton    = 1; //
    BubbleTypeDmSettingPanel = 2; //
}

//
message BubbleV2 {
    //
    string text = 1;
    //
    string url = 2;
    //
    BubbleType bubble_type = 3;
    //
    bool exposure_once = 4;
    //
    ExposureType exposure_type = 5;
}

//
message Button {
    //
    string text = 1;
    //
    int32 action = 2;
}

//
message BuzzwordConfig {
    //
    repeated BuzzwordShowConfig keywords = 1;
}

//
message BuzzwordShowConfig {
    //
    string name = 1;
    //
    string schema = 2;
    //
    int32 source = 3;
    //
    int64 id = 4;
    //
    int64 buzzword_id = 5;
    //
    int32 schema_type = 6;
}

//
message CheckBox {
    //
    string text = 1;
    //
    CheckboxType type = 2;
    //
    bool default_value = 3;
    //
    bool show = 4;
}

//
enum CheckboxType {
    CheckboxTypeNone      = 0; //
    CheckboxTypeEncourage = 1; //
    CheckboxTypeColorDM   = 2; //
}

//
message CheckBoxV2 {
    //
    string text = 1;
    //
    int32 type = 2;
    //
    bool default_value = 3;
}

//
message ClickButton {
    //
    repeated string portrait_text = 1;
    //
    repeated string landscape_text = 2;
    //
    repeated string portrait_text_focus = 3;
    //
    repeated string landscape_text_focus = 4;
    //
    RenderType render_type = 5;
    //
    bool show = 6;
    //
    Bubble bubble = 7;
}

//
message ClickButtonV2 {
    //
    repeated string portrait_text = 1;
    //
    repeated string landscape_text = 2;
    //
    repeated string portrait_text_focus = 3;
    //
    repeated string landscape_text_focus = 4;
    //
    int32 render_type = 5;
    //
    bool text_input_post = 6;
    //
    bool exposure_once = 7;
    //
    int32 exposure_type = 8;
}

// 互动弹幕条目信息
message CommandDm {
    // 弹幕id
    int64 id = 1;
    // 对象视频cid
    int64 oid = 2;
    // 发送者mid
    string mid = 3;
    // 互动弹幕指令
    string command = 4;
    // 互动弹幕正文
    string content = 5;
    // 出现时间
    int32 progress = 6;
    // 创建时间
    string ctime = 7;
    // 发布时间
    string mtime = 8;
    // 扩展json数据
    string extra = 9;
    // 弹幕id str类型
    string idStr = 10;
}

// 弹幕ai云屏蔽列表
message DanmakuAIFlag {
    // 弹幕ai云屏蔽条目
    repeated DanmakuFlag dm_flags = 1;
}

// 弹幕条目
message DanmakuElem {
    // 弹幕dmid
    int64 id = 1;
    // 弹幕出现位置(单位ms)
    int32 progress = 2;
    // 弹幕类型 1 2 3:普通弹幕 4:底部弹幕 5:顶部弹幕 6:逆向弹幕 7:高级弹幕 8:代码弹幕 9:BAS弹幕(pool必须为2)
    int32 mode = 3;
    // 弹幕字号
    int32 fontsize = 4;
    // 弹幕颜色
    uint32 color = 5;
    // 发送者mid hash
    string midHash = 6;
    // 弹幕正文
    string content = 7;
    // 发送时间
    int64 ctime = 8;
    // 权重 用于屏蔽等级 区间:[1,10]
    int32 weight = 9;
    // 动作
    string action = 10;
    // 弹幕池 0:普通池 1:字幕池 2:特殊池(代码/BAS弹幕)
    int32 pool = 11;
    // 弹幕dmid str
    string idStr = 12;
    // 弹幕属性位(bin求AND)
    // bit0:保护 bit1:直播 bit2:高赞
    int32 attr = 13;
    //
    string animation = 22;
    // 大会员专属颜色
    DmColorfulType colorful = 24;
}

// 弹幕ai云屏蔽条目
message DanmakuFlag {
    // 弹幕dmid
    int64 dmid = 1;
    // 评分
    uint32 flag = 2;
}

// 云屏蔽配置信息
message DanmakuFlagConfig {
    // 云屏蔽等级
    int32 rec_flag = 1;
    // 云屏蔽文案
    string rec_text = 2;
    // 云屏蔽开关
    int32 rec_switch = 3;
}

// 弹幕默认配置
message DanmuDefaultPlayerConfig {
    bool player_danmaku_use_default_config                       = 1;  // 是否使用推荐弹幕设置
    bool player_danmaku_ai_recommended_switch                    = 4;  // 是否开启智能云屏蔽
    int32 player_danmaku_ai_recommended_level                    = 5;  // 智能云屏蔽等级
    bool player_danmaku_blocktop                                 = 6;  // 是否屏蔽顶端弹幕
    bool player_danmaku_blockscroll                              = 7;  // 是否屏蔽滚动弹幕
    bool player_danmaku_blockbottom                              = 8;  // 是否屏蔽底端弹幕
    bool player_danmaku_blockcolorful                            = 9;  // 是否屏蔽彩色弹幕
    bool player_danmaku_blockrepeat                              = 10; // 是否屏蔽重复弹幕
    bool player_danmaku_blockspecial                             = 11; // 是否屏蔽高级弹幕
    float player_danmaku_opacity                                 = 12; // 弹幕不透明度
    float player_danmaku_scalingfactor                           = 13; // 弹幕缩放比例
    float player_danmaku_domain                                  = 14; // 弹幕显示区域
    int32 player_danmaku_speed                                   = 15; // 弹幕速度
    bool inline_player_danmaku_switch                            = 16; // 是否开启弹幕
    int32 player_danmaku_senior_mode_switch                      = 17; //
    int32 player_danmaku_ai_recommended_level_v2                 = 18; //
    map<int32, int32> player_danmaku_ai_recommended_level_v2_map = 19; //
}

// 弹幕配置
message DanmuPlayerConfig {
    bool player_danmaku_switch                                   = 1;  // 是否开启弹幕
    bool player_danmaku_switch_save                              = 2;  // 是否记录弹幕开关设置
    bool player_danmaku_use_default_config                       = 3;  // 是否使用推荐弹幕设置
    bool player_danmaku_ai_recommended_switch                    = 4;  // 是否开启智能云屏蔽
    int32 player_danmaku_ai_recommended_level                    = 5;  // 智能云屏蔽等级
    bool player_danmaku_blocktop                                 = 6;  // 是否屏蔽顶端弹幕
    bool player_danmaku_blockscroll                              = 7;  // 是否屏蔽滚动弹幕
    bool player_danmaku_blockbottom                              = 8;  // 是否屏蔽底端弹幕
    bool player_danmaku_blockcolorful                            = 9;  // 是否屏蔽彩色弹幕
    bool player_danmaku_blockrepeat                              = 10; // 是否屏蔽重复弹幕
    bool player_danmaku_blockspecial                             = 11; // 是否屏蔽高级弹幕
    float player_danmaku_opacity                                 = 12; // 弹幕不透明度
    float player_danmaku_scalingfactor                           = 13; // 弹幕缩放比例
    float player_danmaku_domain                                  = 14; // 弹幕显示区域
    int32 player_danmaku_speed                                   = 15; // 弹幕速度
    bool player_danmaku_enableblocklist                          = 16; // 是否开启屏蔽列表
    bool inline_player_danmaku_switch                            = 17; // 是否开启弹幕
    int32 inline_player_danmaku_config                           = 18; //
    int32 player_danmaku_ios_switch_save                         = 19; //
    int32 player_danmaku_senior_mode_switch                      = 20; //
    int32 player_danmaku_ai_recommended_level_v2                 = 21; //
    map<int32, int32> player_danmaku_ai_recommended_level_v2_map = 22; //
}

//
message DanmuPlayerConfigPanel {
    //
    string selection_text = 1;
}

// 弹幕显示区域自动配置
message DanmuPlayerDynamicConfig {
    // 时间
    int32 progress = 1;
    // 弹幕显示区域
    float player_danmaku_domain = 14;
}

// 弹幕配置信息
message DanmuPlayerViewConfig {
    // 弹幕默认配置
    DanmuDefaultPlayerConfig danmuku_default_player_config = 1;
    // 弹幕用户配置
    DanmuPlayerConfig danmuku_player_config = 2;
    // 弹幕显示区域自动配置列表
    repeated DanmuPlayerDynamicConfig danmuku_player_dynamic_config = 3;
    //
    DanmuPlayerConfigPanel danmuku_player_config_panel = 4;
}

// web端用户弹幕配置
message DanmuWebPlayerConfig {
    bool dm_switch                    = 1;  // 是否开启弹幕
    bool ai_switch                    = 2;  // 是否开启智能云屏蔽
    int32 ai_level                    = 3;  // 智能云屏蔽等级
    bool blocktop                     = 4;  // 是否屏蔽顶端弹幕
    bool blockscroll                  = 5;  // 是否屏蔽滚动弹幕
    bool blockbottom                  = 6;  // 是否屏蔽底端弹幕
    bool blockcolor                   = 7;  // 是否屏蔽彩色弹幕
    bool blockspecial                 = 8;  // 是否屏蔽重复弹幕
    bool preventshade                 = 9;  // 
    bool dmask                        = 10; // 
    float opacity                     = 11; // 
    int32 dmarea                      = 12; // 
    float speedplus                   = 13; // 
    float fontsize                    = 14; // 弹幕字号
    bool screensync                   = 15; // 
    bool speedsync                    = 16; // 
    string fontfamily                 = 17; // 
    bool bold                         = 18; // 是否使用加粗
    int32 fontborder                  = 19; // 
    string draw_type                  = 20; // 弹幕渲染类型
    int32 senior_mode_switch          = 21; //
    int32 ai_level_v2                 = 22; //
    map<int32, int32> ai_level_v2_map = 23; //
}

// 弹幕属性位值
enum DMAttrBit {
    DMAttrBitProtect  = 0; // 保护弹幕
    DMAttrBitFromLive = 1; // 直播弹幕
    DMAttrHighLike    = 2; // 高赞弹幕
}

message DmColorful {
    DmColorfulType type = 1; // 颜色类型
    string src          = 2; //
}

enum DmColorfulType {
    NoneType        = 0;     // 无
    VipGradualColor = 60001; // 渐变色
}

//
message DmExpoReportReq {
    //
    string session_id = 1;
    //
    int64 oid = 2;
    //
    string spmid = 4;
}

//
message DmExpoReportRes {}

// 修改弹幕配置-请求
message DmPlayerConfigReq {
    int64 ts                                                  = 1;  //
    PlayerDanmakuSwitch switch                                = 2;  // 是否开启弹幕
    PlayerDanmakuSwitchSave switch_save                       = 3;  // 是否记录弹幕开关设置
    PlayerDanmakuUseDefaultConfig use_default_config          = 4;  // 是否使用推荐弹幕设置
    PlayerDanmakuAiRecommendedSwitch ai_recommended_switch    = 5;  // 是否开启智能云屏蔽
    PlayerDanmakuAiRecommendedLevel ai_recommended_level      = 6;  // 智能云屏蔽等级
    PlayerDanmakuBlocktop blocktop                            = 7;  // 是否屏蔽顶端弹幕
    PlayerDanmakuBlockscroll blockscroll                      = 8;  // 是否屏蔽滚动弹幕
    PlayerDanmakuBlockbottom blockbottom                      = 9;  // 是否屏蔽底端弹幕
    PlayerDanmakuBlockcolorful blockcolorful                  = 10; // 是否屏蔽彩色弹幕
    PlayerDanmakuBlockrepeat blockrepeat                      = 11; // 是否屏蔽重复弹幕
    PlayerDanmakuBlockspecial blockspecial                    = 12; // 是否屏蔽高级弹幕
    PlayerDanmakuOpacity opacity                              = 13; // 弹幕不透明度
    PlayerDanmakuScalingfactor scalingfactor                  = 14; // 弹幕缩放比例
    PlayerDanmakuDomain domain                                = 15; // 弹幕显示区域
    PlayerDanmakuSpeed speed                                  = 16; // 弹幕速度
    PlayerDanmakuEnableblocklist enableblocklist              = 17; // 是否开启屏蔽列表
    InlinePlayerDanmakuSwitch inlinePlayerDanmakuSwitch       = 18; // 是否开启弹幕
    PlayerDanmakuSeniorModeSwitch senior_mode_switch          = 19; //
    PlayerDanmakuAiRecommendedLevelV2 ai_recommended_level_v2 = 20; //
}

//
message DmSegConfig {
    //
    int64 page_size = 1;
    //
    int64 total = 2;
}

// 获取弹幕-响应
message DmSegMobileReply {
    // 弹幕列表
    repeated DanmakuElem elems = 1;
    // 是否已关闭弹幕
    // 0:未关闭 1:已关闭
    int32 state = 2;
    // 弹幕云屏蔽ai评分值
    DanmakuAIFlag ai_flag = 3;
    repeated DmColorful colorfulSrc = 5;
}

// 获取弹幕-请求
message DmSegMobileReq {
    // 稿件avid/漫画epid
    int64 pid = 1;
    // 视频cid/漫画cid
    int64 oid = 2;
    // 弹幕类型
    // 1:视频 2:漫画
    int32 type = 3;
    // 分段(6min)
    int64 segment_index = 4;
    // 是否青少年模式
    int32 teenagers_mode = 5;
    //
    int64 ps = 6;
    //
    int64 pe = 7;
    //
    int32 pull_mode = 8;
    //
    int32 from_scene = 9;
}

// ott弹幕列表-响应
message DmSegOttReply {
    // 是否已关闭弹幕
    // 0:未关闭 1:已关闭
    bool closed = 1;
    // 弹幕列表
    repeated DanmakuElem elems = 2;
}

// ott弹幕列表-请求
message DmSegOttReq {
    // 稿件avid/漫画epid
    int64 pid = 1;
    // 视频cid/漫画cid
    int64 oid = 2;
    // 弹幕类型
    // 1:视频 2:漫画
    int32 type = 3;
    // 分段(6min)
    int64 segment_index = 4;
}

// 弹幕SDK-响应
message DmSegSDKReply {
    // 是否已关闭弹幕
    // 0:未关闭 1:已关闭
    bool closed = 1;
    // 弹幕列表
    repeated DanmakuElem elems = 2;
}

// 弹幕SDK-请求
message DmSegSDKReq {
    // 稿件avid/漫画epid
    int64 pid = 1;
    // 视频cid/漫画cid
    int64 oid = 2;
    // 弹幕类型
    // 1:视频 2:漫画
    int32 type = 3;
    // 分段(6min)
    int64 segment_index = 4;
}

// 客户端弹幕元数据-响应
message DmViewReply {
    // 是否已关闭弹幕
    // 0:未关闭 1:已关闭
    bool closed = 1;
    // 智能防挡弹幕蒙版信息
    VideoMask mask = 2;
    // 视频字幕
    VideoSubtitle subtitle = 3;
    // 高级弹幕专包url(bfs)
    repeated string special_dms = 4;
    // 云屏蔽配置信息
    DanmakuFlagConfig ai_flag = 5;
    // 弹幕配置信息
    DanmuPlayerViewConfig player_config = 6;
    // 弹幕发送框样式
    int32 send_box_style = 7;
    // 是否允许
    bool allow = 8;
    // check box 是否展示
    string check_box = 9;
    // check box 展示文本
    string check_box_show_msg = 10;
    // 展示文案
    string text_placeholder = 11;
    // 弹幕输入框文案
    string input_placeholder = 12;
    // 用户举报弹幕 cid维度屏蔽的正则规则
    repeated string report_filter_content = 13;
    //
    ExpoReport expo_report = 14;
    //
    BuzzwordConfig buzzword_config = 15;
    //
    repeated Expressions expressions = 16;
    //
    repeated PostPanel post_panel = 17;
    //
    repeated string activity_meta = 18;
    //
    repeated PostPanelV2 post_panel2 = 19;
}

// 客户端弹幕元数据-请求
message DmViewReq {
    // 稿件avid/漫画epid
    int64 pid = 1;
    // 视频cid/漫画cid
    int64 oid = 2;
    // 弹幕类型
    // 1:视频 2:漫画
    int32 type = 3;
    // 页面spm
    string spmid = 4;
    // 是否冷启
    int32 is_hard_boot = 5;
}

// web端弹幕元数据-响应
// https://api.bilibili.com/x/v2/dm/web/view
message DmWebViewReply {
    // 是否已关闭弹幕
    // 0:未关闭 1:已关闭
    int32 state = 1;
    //
    string text = 2;
    //
    string text_side = 3;
    // 分段弹幕配置
    DmSegConfig dm_sge = 4;
    // 云屏蔽配置信息
    DanmakuFlagConfig flag = 5;
    // 高级弹幕专包url(bfs)
    repeated string special_dms = 6;
    // check box 是否展示
    bool check_box = 7;
    // 弹幕数
    int64 count = 8;
    // 互动弹幕
    repeated CommandDm commandDms = 9;
    // 用户弹幕配置
    DanmuWebPlayerConfig player_config = 10;
    // 用户举报弹幕 cid维度屏蔽
    repeated string report_filter_content = 11;
    //
    repeated Expressions expressions = 12;
    //
    repeated PostPanel post_panel = 13;
    //
    repeated string activity_meta = 14;
}

//
message ExpoReport {
    //
    bool should_report_at_end = 1;
}

//
enum ExposureType {
    ExposureTypeNone   = 0; //
    ExposureTypeDMSend = 1; //
}

//
message Expression {
    //
    repeated string keyword = 1;
    //
    string url = 2;
    //
    repeated Period period = 3;
}

//
message Expressions {
    //
    repeated Expression data = 1;
}

// 是否开启弹幕
message InlinePlayerDanmakuSwitch {
    //
    bool value = 1;
} 

//
message Label {
    //
    string title = 1;
    //
    repeated string content = 2;
}

//
message LabelV2 {
    //
    string title = 1;
    //
    repeated string content = 2;
    //
    bool exposure_once = 3;
    //
    int32 exposure_type = 4;
}

//
message Period {
    //
    int64 start = 1;
    //
    int64 end = 2;
}

message PlayerDanmakuAiRecommendedLevel   {bool  value = 1;} // 智能云屏蔽等级
message PlayerDanmakuAiRecommendedLevelV2 {int32 value = 1;} //
message PlayerDanmakuAiRecommendedSwitch  {bool  value = 1;} // 是否开启智能云屏蔽
message PlayerDanmakuBlockbottom          {bool  value = 1;} // 是否屏蔽底端弹幕
message PlayerDanmakuBlockcolorful        {bool  value = 1;} // 是否屏蔽彩色弹幕
message PlayerDanmakuBlockrepeat          {bool  value = 1;} // 是否屏蔽重复弹幕
message PlayerDanmakuBlockscroll          {bool  value = 1;} // 是否屏蔽滚动弹幕
message PlayerDanmakuBlockspecial         {bool  value = 1;} // 是否屏蔽高级弹幕
message PlayerDanmakuBlocktop             {bool  value = 1;} // 是否屏蔽顶端弹幕
message PlayerDanmakuDomain               {float value = 1;} // 弹幕显示区域
message PlayerDanmakuEnableblocklist      {bool  value = 1;} // 是否开启屏蔽列表
message PlayerDanmakuOpacity              {float value = 1;} // 弹幕不透明度
message PlayerDanmakuScalingfactor        {float value = 1;} // 弹幕缩放比例
message PlayerDanmakuSeniorModeSwitch     {int32 value = 1;} //
message PlayerDanmakuSpeed                {int32 value = 1;} // 弹幕速度
message PlayerDanmakuSwitch               {bool  value = 1; bool can_ignore = 2;} // 是否开启弹幕
message PlayerDanmakuSwitchSave           {bool  value = 1;} // 是否记录弹幕开关设置
message PlayerDanmakuUseDefaultConfig     {bool  value = 1;} // 是否使用推荐弹幕设置

//
message PostPanel {
    //
    int64 start = 1;
    //
    int64 end = 2;
    //
    int64 priority = 3;
    //
    int64 biz_id = 4;
    //
    PostPanelBizType biz_type = 5;
    //
    ClickButton click_button = 6;
    //
    TextInput text_input = 7;
    //
    CheckBox check_box = 8;
    //
    Toast toast = 9;
}

//
enum PostPanelBizType {
    PostPanelBizTypeNone      = 0; //
    PostPanelBizTypeEncourage = 1; //
    PostPanelBizTypeColorDM   = 2; //
    PostPanelBizTypeNFTDM     = 3; //
    PostPanelBizTypeFragClose = 4; //
    PostPanelBizTypeRecommend = 5; //
}

//
message PostPanelV2 {
    //
    int64 start = 1;
    //
    int64 end = 2;
    //
    int32 biz_type = 3;
    //
    ClickButtonV2 click_button = 4;
    //
    TextInputV2 text_input = 5;
    //
    CheckBoxV2 check_box = 6;
    //
    ToastV2 toast = 7;
    //
    BubbleV2 bubble = 8;
    //
    LabelV2 label = 9;
    //
    int32 post_status = 10;
}

//
enum PostStatus {
    PostStatusNormal = 0; //
    PostStatusClosed = 1; //
}

//
enum RenderType {
    RenderTypeNone     = 0; //
    RenderTypeSingle   = 1; //
    RenderTypeRotation = 2; //
}

// 修改弹幕配置-响应
message Response {
    //
    int32 code = 1;
    //
    string message = 2;
}

//
enum SubtitleAiStatus {
    None     = 0; //
    Exposure = 1; //
    Assist   = 2; //
}

//
enum SubtitleAiType {
    Normal    = 0; //
    Translate = 1; //
}

// 单个字幕信息
message SubtitleItem {
    // 字幕id
    int64 id = 1;
    // 字幕id str
    string id_str = 2;
    // 字幕语言代码
    string lan = 3;
    // 字幕语言
    string lan_doc = 4;
    // 字幕文件url
    string subtitle_url = 5;
    // 字幕作者信息
    UserInfo author = 6;
    // 字幕类型
    SubtitleType type = 7;
    //
    string lan_doc_brief = 8;
    //
    SubtitleAiType ai_type = 9;
    //
    SubtitleAiStatus ai_status = 10;
}

enum SubtitleType {
    CC = 0; // CC字幕
    AI = 1; // AI生成字幕
}

//
message TextInput {
    //
    repeated string portrait_placeholder = 1;
    //
    repeated string landscape_placeholder = 2;
    //
    RenderType render_type = 3;
    //
    bool placeholder_post = 4;
    //
    bool show = 5;
    //
    repeated Avatar avatar = 6;
    //
    PostStatus post_status = 7;
    //
    Label label = 8;
}

//
message TextInputV2 {
    //
    repeated string portrait_placeholder = 1;
    //
    repeated string landscape_placeholder = 2;
    //
    RenderType render_type = 3;
    //
    bool placeholder_post = 4;
    //
    repeated Avatar avatar = 5;
    //
    int32 text_input_limit = 6;
}

//
message Toast {
    //
    string text = 1;
    //
    int32 duration = 2;
    //
    bool show = 3;
    //
    Button button = 4;
}

//
message ToastButtonV2 {
    //
    string text = 1;
    //
    int32 action = 2;
}

//
enum ToastFunctionType {
    ToastFunctionTypeNone      = 0; //
    ToastFunctionTypePostPanel = 1; //
}

//
message ToastV2 {
    //
    string text = 1;
    //
    int32 duration = 2;
    //
    ToastButtonV2 toast_button_v2 = 3;
}

// 字幕作者信息
message UserInfo {
    // 用户mid
    int64 mid = 1;
    // 用户昵称
    string name = 2;
    // 用户性别
    string sex = 3;
    // 用户头像url
    string face = 4;
    // 用户签名
    string sign = 5;
    // 用户等级
    int32 rank = 6;
}

// 智能防挡弹幕蒙版信息
message VideoMask {
    // 视频cid
    int64 cid = 1;
    // 平台
    // 0:web端 1:客户端
    int32 plat = 2;
    // 帧率
    int32 fps = 3;
    // 间隔时间
    int64 time = 4;
    // 蒙版url
    string mask_url = 5;
}

// 视频字幕信息
message VideoSubtitle {
    // 视频原语言代码
    string lan = 1;
    // 视频原语言
    string lanDoc = 2;
    // 视频字幕列表
    repeated SubtitleItem subtitles = 3;
}`;

/** @type {{decode:(b:ArrayLike<number>)=>{elems:{content:string;progress:number}[]}}} */
// eslint-disable-next-line no-undef
const DmSegMobileReply = protobuf.parse(PROTO).root.lookup('DmSegMobileReply');

/** @type {Map<string,ReturnType<DmSegMobileReply['decode']>['elems']>} */
const segsCacheMap = new Map();

/** @param {string|undefined} oid */
const getSegs = async (oid) => {
  if (oid) {
    const cached = segsCacheMap.get(oid);
    if (cached) return cached;
    try {
      const segs = [];
      for (let i = 1; ; i++) {
        const { elems } = DmSegMobileReply.decode(
          new Uint8Array(
            await (
              await fetch(
                `https://api.bilibili.com/x/v2/dm/web/seg.so?${new URLSearchParams(
                  {
                    oid,
                    type: 1,
                    segment_index: i,
                  }
                )}`
              )
            ).arrayBuffer()
          )
        );
        if (elems.length) segs.push(...elems);
        else break;
      }
      segsCacheMap.set(oid, segs);
      return segs;
    } catch {}
  }
  return [];
};

const urlBvidRegex = /\/video\/(BV[1-9A-HJ-NP-Za-km-z]{10})/;

/** @type {Map<string,string>} */
const urlCidCacheMap = new Map();

/** @returns {Promise<string|undefined>} */
const getCidFromUrl = async (url = location.href) => {
  const cached = urlCidCacheMap.get(url);
  if (cached) return cached;
  try {
    const sp = new URLSearchParams(new URL(url).search);
    const bvid = url.match(urlBvidRegex)?.[1] ?? sp.get('bvid');
    if (!bvid) return;
    const p = sp.get('p') ?? 1;
    const res = await (
      await fetch(
        `https://api.bilibili.com/x/player/pagelist?${new URLSearchParams({
          bvid,
        })}`
      )
    ).json();
    if (Array.isArray(res?.data) && res.data.length) {
      const cid = (res.data.find((d) => d?.page == p) ?? res.data[0])?.cid;
      if (cid) {
        urlCidCacheMap.set(url, cid);
        return cid;
      }
    }
  } catch {}
};

/** @returns {Promise<string|undefined>} */
const getCurrentCid = async () => {
  try {
    // eslint-disable-next-line no-undef
    if (__INITIAL_STATE__?.videoData?.cid) {
      // eslint-disable-next-line no-undef
      return __INITIAL_STATE__.videoData.cid;
    }
    // eslint-disable-next-line no-undef
    if (__INITIAL_STATE__?.videoInfo?.cid) {
      // eslint-disable-next-line no-undef
      return __INITIAL_STATE__.videoInfo.cid;
    }
    return await getCidFromUrl();
  } catch {}
};

const stMap = {
  '-1': {
    disabled: true,
    cursor: 'not-allowed',
    text: '...',
    color: 'white',
    backgroundColor: '#fc8bab',
  },
  0: {
    disabled: false,
    cursor: 'pointer',
    text: 'BADTAG',
    color: 'white',
    backgroundColor: '#fb7299',
  },
  1: {
    disabled: false,
    cursor: 'pointer',
    text: 'SAFE',
    color: 'forestgreen',
    backgroundColor: 'greenyellow',
  },
  2: {
    disabled: false,
    cursor: 'pointer',
    text: 'UNSAFE',
    color: 'darkred',
    backgroundColor: 'orangered',
  },
};

/** @param {HTMLButtonElement} btn */
const setState = (btn, st = 0) => {
  switch (st) {
    case -1:
    case 1:
    case 2: {
      const { disabled, cursor, text, color, backgroundColor } = stMap[st];
      btn.disabled = disabled;
      btn.style.cursor = cursor;
      btn.textContent = text;
      btn.style.color = color;
      btn.style.backgroundColor = backgroundColor;
      break;
    }
    default: {
      const { disabled, cursor, text, color, backgroundColor } = stMap[0];
      btn.disabled = disabled;
      btn.style.cursor = cursor;
      btn.textContent = text;
      btn.style.color = color;
      btn.style.backgroundColor = backgroundColor;
    }
  }
};

/** @param {number} d */
const ms2d = (d) => {
  const ms = `${Math.floor((d % 1000) / 100)}`.padStart(2, '0');
  const s = `${Math.floor((d / 1000) % 60)}`.padStart(2, '0');
  const m = `${Math.floor((d / (1000 * 60)) % 60)}`.padStart(2, '0');
  const h = `${Math.floor((d / (1000 * 60 * 60)) % 24)}`.padStart(2, '0');
  return `${h}:${m}:${s}.${ms}`;
};

/** @param {number} n */
const n2p = (n) => `${(n * 100).toFixed(2)}%`;

/** @param {string} s */
const log = (s, color = '#fb7299', ...rest) => {
  console.log(`%c[BADTAG] ${s}`, `color:${color}`, ...rest);
};

/** @param {string} s */
const match = (s) =>
  RULES.filter((re) =>
    re.test(
      s
        .split('')
        .map((s) => s.trim())
        .join('')
    )
  );

const THRES_KEY = 'THRES';

/** @returns {number} */
const getThres = () => GM_getValue(THRES_KEY, THRES);

/** @param {number} n */
const setThres = (n) => GM_setValue(THRES_KEY, Math.max(0, Math.min(n, 1)));

const menus = new Set();

const setupMenu = (n = getThres()) => {
  for (const menu of menus) GM_unregisterMenuCommand(menu);
  menus.clear();
  menus.add(
    GM_registerMenuCommand(
      `⏫ [+${n2p(0.001)}]`,
      () => {
        setThres(getThres() + 0.001);
      },
      'p'
    )
  );
  menus.add(
    GM_registerMenuCommand(
      `🔼 [+${n2p(0.0001)}]`,
      () => {
        setThres(getThres() + 0.0001);
      },
      'm'
    )
  );
  menus.add(
    GM_registerMenuCommand(
      `🍩 ${n2p(n)}${n === THRES ? '' : ` [🔄 ${n2p(THRES)}]`}`,
      () => {
        setThres(THRES);
      },
      'r'
    )
  );
  menus.add(
    GM_registerMenuCommand(
      `🔽 [-${n2p(0.0001)}]`,
      () => {
        setThres(getThres() - 0.0001);
      },
      'z'
    )
  );
  menus.add(
    GM_registerMenuCommand(
      `⏬ [-${n2p(0.001)}]`,
      () => {
        setThres(getThres() - 0.001);
      },
      'q'
    )
  );
};

/**
 * @param {Awaited<ReturnType<typeof getSegs>>} segs
 * @param {string} cid
 */
const analyze = (segs, cid) => {
  const ms = [];
  for (const seg of segs) {
    const mr = match(seg.content);
    if (mr.length) {
      log(`*HIT* ${ms2d(seg.progress)} "${seg.content}"`, undefined, mr, cid);
      ms.push({ mr, seg });
    }
  }
  const m = ms.map(({ mr }) => mr).flat().length;
  const s = segs.length;
  const p = s ? m / s : 0;
  const thres = getThres();
  const q = p > thres;
  const ps = `#${m}/${s}=${n2p(p)}${q ? '>=' : '<'}${n2p(thres)}`;
  log(`STATS ${ps}`, undefined, cid);
  if (q) {
    log('*** UNSAFE ***', 'red', cid);
    return { ms, ps, st: 2 };
  }
  log('--- SAFE ---', 'green', cid);
  return { ms, ps, st: 1 };
};

/** @param {Element} elem */
const getCoords = (elem) => {
  const { top, left, width, height } = elem.getBoundingClientRect();
  return {
    top: top + scrollY,
    left: left + scrollX,
    width,
    height,
  };
};

/** @param {HTMLElement} elem */
const isVisible = (elem) =>
  Boolean(
    elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length
  );

/** @type {Set<Element>} */
const tags = new Set();
const clearTags = () => {
  for (const tag of tags) tag.remove();
  tags.clear();
};

/** @type {Set<Element>} */
const beacons = new Set();
const clearBeacons = () => {
  for (const beacon of beacons) beacon.remove();
  beacons.clear();
};

/** @type {Element} */
let x;

/**
 * @param {HTMLButtonElement} btn
 * @param {Element} dbg
 */
const main = async (btn, dbg) => {
  setState(btn, -1);
  dbg.textContent = '';
  clearTags();
  clearBeacons();
  const cid = await getCurrentCid();
  if (cid) {
    const { ms, ps, st } = analyze(await getSegs(cid), cid);
    setState(btn, st);
    const pb = document.querySelector('.bpx-player-progress');
    const spb = document.querySelector('.bpx-player-shadow-progress-area');
    // eslint-disable-next-line no-undef
    const dr = player?.getDuration?.();
    if (dr) {
      /** @param {Element|null} tgt */
      const addBeacon = (tgt) => {
        if (!tgt) return;
        const { top, left, width, height } = getCoords(tgt);
        for (const {
          seg: { progress },
        } of ms) {
          const beacon = document.createElement('div');
          beacon.style.position = 'absolute';
          beacon.style.width = '1px';
          beacon.style.height = `${height}px`;
          beacon.style.pointerEvents = `none`;
          beacon.style.backgroundColor = 'red';
          beacon.style.zIndex = '1';
          beacon.style.top = `${top}px`;
          beacon.style.left = `${left + (progress / 1000 / dr) * width}px`;
          beacons.add(beacon);
          x.appendChild(beacon);
        }
      };
      addBeacon(pb);
      addBeacon(spb);
    }
    const pc = document.createElement('span');
    pc.style.color = 'white';
    pc.style.backgroundColor = '#fb7299';
    pc.textContent = `${cid}\n`;
    const pss = document.createElement('span');
    const { color, backgroundColor } = stMap[st];
    pss.style.color = color;
    pss.style.backgroundColor = backgroundColor;
    pss.textContent = `${ps}\n`;
    dbg.append(
      pc,
      pss,
      ...ms
        .sort((a, b) => a.seg.progress - b.seg.progress)
        .map(({ mr, seg }) => {
          const t = document.createElement('span');
          t.style.color = 'blue';
          t.style.cursor = 'pointer';
          t.textContent = ms2d(seg.progress);
          t.addEventListener('click', () => {
            // eslint-disable-next-line no-undef
            player?.seek?.(seg.progress / 1000);
          });
          t.addEventListener('mouseenter', () => {
            t.style.fontWeight = 'bold';
          });
          t.addEventListener('mouseleave', () => {
            t.style.fontWeight = '';
          });
          return [
            t,
            seg.content,
            ...mr.map((r) => {
              const rr = document.createElement('span');
              rr.style.color = 'brown';
              rr.textContent = `${r}`;
              return rr;
            }),
            '\n',
          ];
        })
        .flat()
    );
  } else setState(btn);
  for (const elem of [...document.querySelectorAll('a')].filter(
    (e) => urlBvidRegex.test(e.href) && isVisible(e)
  )) {
    (async (x) => {
      const cid = await getCidFromUrl(elem.href);
      if (cid) {
        const { ps, st } = analyze(await getSegs(cid), cid);
        const tag = document.createElement('div');
        tag.style.position = 'absolute';
        tag.style.fontSize = '12px';
        tag.style.fontWeight = 'bold';
        tag.style.userSelect = 'none';
        tag.style.zIndex = '2';
        const { top, left } = getCoords(elem);
        tag.style.top = `${top}px`;
        tag.style.left = `${left}px`;
        const { text, color, backgroundColor } = stMap[st];
        tag.style.color = color;
        tag.style.backgroundColor = backgroundColor;
        tag.textContent = text;
        tag.title = `${cid} ${ps}`;
        tag.addEventListener('click', () => {
          tag.style.visibility = 'hidden';
        });
        tag.addEventListener('mouseenter', () => {
          tag.style.opacity = '0.2';
        });
        tag.addEventListener('mouseleave', () => {
          tag.style.opacity = '';
        });
        tag.__TARGET__ = elem;
        tags.add(tag);
        x.appendChild(tag);
      }
    })(x);
  }
};

addEventListener('load', () => {
  x = document.createElement('div');
  const btn = document.createElement('button');
  btn.style.position = 'fixed';
  btn.style.bottom = '0';
  btn.style.right = '0';
  btn.style.width = '90px';
  btn.style.height = '34px';
  btn.style.border = 'none';
  btn.style.borderTopLeftRadius = '6px';
  btn.style.fontSize = '14px';
  btn.style.fontWeight = 'bold';
  btn.style.outline = '0';
  btn.style.zIndex = '10';
  btn.title = `${n2p(getThres())}`;
  const dbg = document.createElement('div');
  dbg.style.position = 'fixed';
  dbg.style.bottom = '34px';
  dbg.style.right = '0';
  dbg.style.maxHeight = 'calc(100% - 98px)';
  dbg.style.overflowY = 'scroll';
  dbg.style.whiteSpace = 'pre';
  dbg.style.fontSize = '12px';
  dbg.style.color = 'black';
  dbg.style.opacity = '0.2';
  dbg.style.backgroundColor = 'transparent';
  dbg.style.visibility = 'hidden';
  dbg.style.zIndex = '10';
  btn.addEventListener('click', () => main(btn, dbg));
  btn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    dbg.style.visibility = dbg.style.visibility === 'hidden' ? '' : 'hidden';
  });
  dbg.addEventListener('mouseenter', () => {
    dbg.style.opacity = '1';
    dbg.style.backgroundColor = 'white';
  });
  dbg.addEventListener('mouseleave', () => {
    dbg.style.opacity = '0.2';
    dbg.style.backgroundColor = 'transparent';
  });
  x.appendChild(btn);
  x.appendChild(dbg);
  document.body.appendChild(x);
  const reset = () => {
    setState(btn);
    dbg.textContent = '';
    clearTags();
    clearBeacons();
  };
  addEventListener('urlchange', reset);
  reset();
  setupMenu();
  GM_addValueChangeListener(THRES_KEY, (key, oldValue, newValue) => {
    log(`set ${key} from ${n2p(oldValue)} to ${n2p(newValue)}`);
    setupMenu(newValue);
    btn.title = `${n2p(newValue)}`;
  });
});
