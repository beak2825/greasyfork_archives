
// ==UserScript==
// @name         知乎样式：信息密集型
// @version      0.061
// @description  信息流更宽、扁。减少了不必要的空隙，减小图片。
// @author       wanglu
// @include       /https?\:\/\/www\.zhihu\.com/
// @namespace https://greasyfork.org/users/416853
// @downloadURL https://update.greasyfork.org/scripts/393669/%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%EF%BC%9A%E4%BF%A1%E6%81%AF%E5%AF%86%E9%9B%86%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393669/%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%EF%BC%9A%E4%BF%A1%E6%81%AF%E5%AF%86%E9%9B%86%E5%9E%8B.meta.js
// ==/UserScript==

var styles = `
/* 主页密集化 */

/* 紧凑右侧 写回答 等按钮 */
 .GlobalWrite-navItem {
	flex: 0 0 80px;
	height: 60px;
}
/* 整页内容宽度 + 200px */
 .Topstory-container {
	width:1200px;
}
/* 信息流宽度 + 250px */
 .Topstory-mainColumn {
	width: 944px;
}
/* 紧凑问题卡：限制中图、视频高度 70px相当于三行文字 */
 .RichContent-cover {
	height:70px;
}
/* 紧凑问题卡：上下边距减小 */
 .TopstoryItem-isRecommend {
	padding: 10px 20px;
}
/* 紧凑问题卡：操作栏上下边距 */
 .ContentItem-actions {
	padding: 5px 20px;
}
/* 紧凑问题卡：降低投票按钮存在感，让标题成为视觉核心 */
 .VoteButton {
	background-color: white;
}
/* 紧凑问题卡：限制回答图片高度 */
 .RichText figure img {
	max-height:300px;
	width:auto;	
}
/* 紧凑问题卡：限制视频宽度*/
.RichText-video{
	max-width:700px;
	margin:auto;
}


/* 紧凑商品推荐卡 */
/* 推荐卡 高度限制 */
.MCNLinkCard--large .MCNLinkCard-card{
    min-height: 70px; /* 60图片高 + 5上下边距 */
}
/* 推荐卡 边距减小 */
.MCNLinkCard--large .MCNLinkCard-cardContainer{
	padding: 5px;
}
/* 推荐卡 商品图减小 */
.MCNLinkCard--large .MCNLinkCard-imageContainer{
	height: 60px;
	width: 60px;
}
/* 推荐卡 标题减小 */
.MCNLinkCard-titleText{
	font-size: 14px;
}
/* 推荐卡 购物平台名上边距减小 */
.MCNLinkCard-tagList--title{
	margin-top: 0;
}
/* 推荐卡 价格减小 */
.MCNLinkCard-price{
	font-size: 14px;
}

/* 链接卡的紧凑化 */
/* 链接卡 减小外边距、增加宽度、减小高度 */
.LinkCard{
	margin:5px auto;
	width:80%;
	max-height:60px;
}
/* 链接卡 减小图标大小*/
.LinkCard-image{
    width: 40px;
    height: 40px;
}
/* 链接卡 减小内边距 */
.LinkCard-content{
	padding: 6px 12px;
}
/* 链接卡 减小标题大小 */
.LinkCard-title{
	font-size: 14px;
}
/* 链接卡 减小链接域名大小 */
.LinkCard-meta{
	font-size: 12px;
	line-height: 12px;
	color:dimgray;
}

/* 链接卡 隐藏链接图标（回形针） */
.LinkCard-meta .Zi{
	display:none;
}



/* 广告、推广等信息的隐藏 */

/* 屏蔽无法反馈的视频推广 */
 .ZVideoItem{
	display:none;
}

/* 信息流广告 */
 .TopstoryItem--advertCard {
	display:none;
}

/* 右侧栏广告 */
 .Pc-card {
	display:none;
} 

/* 知乎故事大赛广告 */
 .StoryCompetitionBanner {
	display:none;
}

/* 回答页面 相关推荐 */
.RelatedCommodities-list{
	display:none;
}
.RelatedCommodities-title{
	display:none;
}

/* 问题页信息密集化*/

/* 问题 外边距减小 */
.QuestionHeader{
	padding: 5px 0;
}
/* 问题 宽度增加*/
.QuestionHeader-main{
    width: auto;
    max-width: 1000px;
    flex-shrink: 1;
}
/* 问题 标签存在感减弱 */
.QuestionTopic{
	color:dodgerblue;
	background:none;
}
/* 问题 问题上边距减小 */
.QuestionHeader-title{
	margin-top:0;
}


/* 答案栏 占全部宽度 */
.Question-main{
	width: auto;
	max-width: 1000px;
}
.Question-mainColumn{
	width: auto;
	max-width: 1000px;
}
/* 右侧栏 隐藏 */
.Question-sideColumn{
	display:none;
}
/* 
方案 直接隐藏右侧栏
缺点是：牺牲了右侧的相关问题
等下一版再想办法解决
*/
`


var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)