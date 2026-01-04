// ==UserScript==
// @name		Booru汉化插件
// @description	用于翻译Booru网站的各个选项
// @version     1.0.7
// @author	GenesisAN
// @namespace 	https://sleazyfork.org/en/scripts/392990-booru%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6
// @include     http*://*.booru.org/
// @include     http*://*.booru.org/index.php*
// @include     http*://*.booru.org/help/*
// @include     http*://*.booru.org/stats/*
// @include     http://rule34.xxx/index.php*
// @include 	https://gelbooru.com/index.php*
// @include     http://safebooru.org/index.php*
// @include		https://moe.dev.myconan.net/*
// @include		http://behoimi.org/*
// @include		https://chan.sankakucomplex.com/*
// @include		http*://*atfbooru.ninja/*
// @include		http://danbooru.donmai.us/*
// @exclude		*.png
// @exclude		*.jp*g
// @exclude		*.gif
// @exclude		*.webm

// you can add any boorus of your choice by following the pattern

// @grant 		none
// @run-at		document-end
// @noframes
// @namespace https://github.com/Seedmanc/Booru-mass-uploader
// @downloadURL https://update.greasyfork.org/scripts/392990/Booru%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392990/Booru%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
	var navbar = document.getElementById('navbar') ||
		document.getElementsByClassName('flat-list2')[0] ||
		document.querySelector('#main-menu > ul') ||
		document.querySelector('nav > menu');
	var li = document.createElement("li");
var a = document.createElement("a");
	a.style.fontWeight = 'bold';
	a.appendChild(document.createTextNode('I社卡片下载工具'));
    a.title="支持快速浏览和下载卡片，并且在能在多个站点间快速切换"
	a.href = 'https://icscn.neocities.org/UpdateLog/';
	if (navbar) {
		li.appendChild(a);
		navbar.appendChild(li);
	} else {
		a.style.display='block';
		a.style.margin='auto';
		a.style.width='105px';
		document.body.insertBefore(a, document.body.firstChild);
	}
var repl =[
    //index主页
    ['#links > a:nth-child(1)','浏览图片'],
    ['#links > a:nth-child(2)','评论'],
    ['#links > a:nth-child(3)','注册账户'],
    ['#links > a:nth-child(4)','收藏夹(喜欢)'],
    //Posts
    ['#navbar > li:nth-child(1) > a','我的账户'],
    ['#navbar > li:nth-child(2) > a','浏览图片'],
    ['#navbar > li:nth-child(3) > a','评论'],
    ['#navbar > li:nth-child(4) > a','Tag别名'],
    ['#navbar > li:nth-child(5) > a','论坛'],
    ['#navbar > li:nth-child(6) > a','随机图片'],
    ['#navbar > li:nth-child(7) > a','帮助'],
    ['#navbar > li:nth-child(8) > a','统计信息'],
    ['#footer > a:nth-child(1)','上传图片'],
    ['#footer > a:nth-child(2)','帮助'],
    ['#post-list > div.sidebar > div:nth-child(1) > h5','搜索框'],
    ['#post-list > div.sidebar > div:nth-child(1) > small','(支持通配符*)'],
    //我的账户
    ['#user-index > h2','你还没有登录'],
    ['body > form > table > tbody > tr:nth-child(4) > td > a','忘记密码？'],
    ['#user-index > h4:nth-child(1) > a','» 登出'],
    ['#user-index > h4:nth-child(2) > a','» 登录'],
    ['#user-index > h4:nth-child(3) > a','» 账户信息'],
    ['#user-index > h4:nth-child(4) > a','» 注册账户'],
    ['#user-index > h4:nth-child(5) > a','» 收藏夹(我喜欢的)'],
    ['#user-index > h4:nth-child(6) > a','» 受欢迎的图片'],
    ['#user-index > h4:nth-child(7) > a','» 受欢迎的图片'],
    ['#user-index > h4:nth-child(8) > a','» 设置'],
    ['#user-index > h4:nth-child(9) > a','» 设置'],
    //帮助
    ['#content > div > ul > li:nth-child(1) > a','» 上传图片'],
    ['#content > div > ul > li:nth-child(2) > a','» 图片分级'],
    ['#content > div > ul > li:nth-child(3) > a','» 论坛'],
    ['#content > div > div > div:nth-child(5) > h4','关于搜索不同分类等级的图片'],
    ['#content > div > ul > li:nth-child(3) > a','» 论坛'],
    ['#content > div > ul > li:nth-child(3) > a','» 论坛'],
    ['#content > div > ul > li:nth-child(3) > a','» 论坛'],
    ['#content > div > div > div:nth-child(3) > p > b','不是'],
    ['#content > div > div > div:nth-child(4) > p','介于安全和硬色情的中间地带，也代表未进行分级，可能包含safe或者explicit等级，这是一个中间区域。']
]
function doReplace(li){
    for(var i=0;i<li.length;i++)
    {
        var elem = document.querySelector(li[i][0])
        if(elem !=null)
        {
            console.log(elem.innerHTML+' -> '+li[i][1]);
            elem.innerHTML=li[i][1];
        }

    }

}

   var ad1 =  document.querySelector("#post-list > div.content > div > center");if(ad1!=null)ad1.style.display="none";
   var ad2 =  document.querySelector("#post-list > div.content > div > div.divTable");if(ad2!=null)ad2.style.display="none";
   var ad3 = document.querySelector("body > center > div:nth-child(1)");if(ad3!=null)ad3.style.display="none";
   var ad4 = document.querySelector("body > center > div:nth-child(2)");if(ad4!=null)ad4.style.display="none";
   var ad5 =  document.querySelector("body > center > div:nth-child(3)");if(ad5!=null)ad5.style.display="none";
window.onload = function () {
    doReplace(repl);
    //搜索按钮
    var upload =document.querySelector("body > form > table > tbody > tr:nth-child(7) > td > input[type=submit]");if(upload!=null)upload.value='上传';
    var scerl2 = document.querySelector('#post-list > div.sidebar > div:nth-child(1) > form > input[type=submit]:nth-child(3)');if(scerl2!=null)scerl2.value='搜索';
    var scerl1 = document.querySelector('#static-index > div:nth-child(3) > form > input[type=submit]:nth-child(3)');if(scerl1!=null)scerl1.value='搜索';
    var login = document.querySelector('body > form > table > tbody > tr:nth-child(3) > td > input[type=submit]');if(login!=null)login.value='登录';
    var register = document.querySelector('body > form > table > tbody > tr:nth-child(5) > td > input[type=submit]');if(register!=null)register.value='注册';
    //Picture
    ///Forum
    document.body.innerHTML = document.body.innerHTML.replace(/Topic:/g, '话题标题：');
    document.body.innerHTML = document.body.innerHTML.replace(/Post:/g, '话题内容：');
    document.body.innerHTML = document.body.innerHTML.replace(/Create topic/g, '创建话题');
    document.body.innerHTML = document.body.innerHTML.replace(/New Topic/g, '创建话题');

    ///
    document.body.innerHTML = document.body.innerHTML.replace(/Recent Favorites/g, '最近喜欢的');
    document.body.innerHTML = document.body.innerHTML.replace(/Recent Uploads/g, '最近上传的');
    ///
    document.body.innerHTML = document.body.innerHTML.replace(/Username:/g, '用户名:');
    document.body.innerHTML = document.body.innerHTML.replace(/		Password:/g, '密码:');
    document.body.innerHTML = document.body.innerHTML.replace(/Choose password:/g, '密码:');
    document.body.innerHTML = document.body.innerHTML.replace(/Confirm password:/g, '重复密码:');
    document.body.innerHTML = document.body.innerHTML.replace(/Email/g, '邮箱');
    document.body.innerHTML = document.body.innerHTML.replace(/not required/g, '可忽略');
    ///
    document.body.innerHTML = document.body.innerHTML.replace(/Tag Blacklist/g, 'Tag 黑名单');
    document.body.innerHTML = document.body.innerHTML.replace(/Any post containing a blacklisted tag will be ignored. Note that you can also blacklist ratings./g, '任何包含黑名单标签的图片都将被隐藏。 请注意，你也可以将评级列入黑名单。');
    document.body.innerHTML = document.body.innerHTML.replace(/User Blacklist/g, '用户黑名单');
    document.body.innerHTML = document.body.innerHTML.replace(/Any post or comment from a blacklisted user will be ignored./g, '被列入黑名单的用户的图片或评论都将被隐藏。');
    document.body.innerHTML = document.body.innerHTML.replace(/Comment Threshold/g, '评论展示限制');
    document.body.innerHTML = document.body.innerHTML.replace(/Any comment with a score below this will be ignored./g, '评分低于此分的评论都将被隐藏。');
    document.body.innerHTML = document.body.innerHTML.replace(/Post Threshold/g, '图片显示限制');
    document.body.innerHTML = document.body.innerHTML.replace(/Any post with a score below this will be ignored./g, '低于此分数的图片都将被隐藏。');
    document.body.innerHTML = document.body.innerHTML.replace(/My Tags/g, '我的Tag');
    document.body.innerHTML = document.body.innerHTML.replace(/These will be accessible when you add or edit a post./g, '当你添加或者编辑一张图片时，这些都是可以直接快速使用的Tag。');
    document.body.innerHTML = document.body.innerHTML.replace(/Save/g, '保存');
    ///help

    document.body.innerHTML = document.body.innerHTML.replace(/A post represents a single file that's been uploaded. Each post can have several tags, comments, and notes. If you have an account, you can also add a post to your favorites./g, 'Post表示上传的单个图片。每个图片可以有多个标签、评论和注释。如果你有一个帐户，你也可以添加一个Post(图片)到你的收藏夹。');
    document.body.innerHTML = document.body.innerHTML.replace(/Searching for posts is straightforward. Simply enter the tags you want to search for, separated by spaces. For example, searching for /g, '搜索功能是很简单的。 只需输入要搜索的Tag，以空格分隔。 例如，搜索：');
    document.body.innerHTML = document.body.innerHTML.replace(/original panties/g, '条纹 胖次');
    document.body.innerHTML = document.body.innerHTML.replace(/Any image where the vagina or penis are exposed and easily visible. This includes depictions of sex, masturbation, or any sort of penetration./g, '任何一张阴道或阴茎暴露在外并且很容易被看到的照片。 这包括描绘性，手淫，或任何形式的插入。');
    document.body.innerHTML = document.body.innerHTML.replace(/ will return every post that has both the original tag /g, '就会返回所有包含条纹');
    document.body.innerHTML = document.body.innerHTML.replace(/ the panties tag/g, '胖次的Tag的图片');
    document.body.innerHTML = document.body.innerHTML.replace(/You can filter search results by querying for/g, '你可以通过搜索来过滤结果:');
    document.body.innerHTML = document.body.innerHTML.replace(/You can also combine them with other tags and they work as expected./g, '（这样搜索结果指只会显示包含safe和questionable等级的图片，或者是explicit等级的图片）您还可以将它们与其他标记组合在一起，并且它们可以正常工作。');
    document.body.innerHTML = document.body.innerHTML.replace(/If you want to remove a rating from your search results, use/g, '如果你不想看到某些等级的图片，你可以在它前面加上-号:');
    document.body.innerHTML = document.body.innerHTML.replace(/Safe posts are images that you would not feel guilty looking at openly in public. Pictures of nudes, exposed nipples or pubic hair, cameltoe, or any sort of sexually suggestive pose are/g, '安全的图片是你在公共场合看到不会感到内疚的图片。裸体、裸露的乳头或阴毛、骆驼蹄子或任何性暗示姿势的照片都');
    document.body.innerHTML = document.body.innerHTML.replace(/ safe and belong in questionable. Swimsuits and lingerie are borderline cases; some are safe, some are questionable./g, 'Safe的或者是属于Questionable的。泳衣和内衣是边缘案例,有些是安全的，有些是可疑的。');
    document.body.innerHTML = document.body.innerHTML.replace(/In both the listing page and the show page you'll notice a list of tag links with characters next to them. Here's an explanation of what they do:/g, '在图片显示页面中，您应该注意到左侧有一个标签链接列表。以下是它们的工作说明:');

    document.body.innerHTML = document.body.innerHTML.replace(/This adds the tag to the current search./g, '将这个Tag添加到当前搜索中,表示搜索结果必须要含这些Tag（如果你加了多个Tag的话，就意味着显示的图片必须携带全部tag,否则不显示）。');
    document.body.innerHTML = document.body.innerHTML.replace(/This adds the negated tag to the current search./g, '这会将否定标记添加到当前的Tag上，搜索结果将不包含这个Tag。');
    document.body.innerHTML = document.body.innerHTML.replace(/The number next to the tag represents how many posts there are. This isn't always the total number of posts for that tag. It may be slightly out of date as cache isn't always refreshed./g, '标签旁边的数字表示有多少个包含这个Tag的图片。 这并不一定代表包含该标签的当前图片总数。 因为缓存的刷新需要时间。');
    document.body.innerHTML = document.body.innerHTML.replace(/When you're not searching for a tag, by default the tag list will show the last few tags added to the database. When you are searching for tags, the tag list will show related tags, alphabetically./g, '当您没使用搜索功能时，默认情况下，Tag列表将显示被添加到数据库的最后几个Tag。 当您使用了搜索时，标记列表将按字母顺序显示相关标记。');

    document.body.innerHTML = document.body.innerHTML.replace(/Report post./g, '举报图片');
    document.body.innerHTML = document.body.innerHTML.replace(/Respond/g, '回复');
    document.body.innerHTML = document.body.innerHTML.replace(/Post comment/g, '发表评论');
    document.body.innerHTML = document.body.innerHTML.replace(/Score/g, '评分');
    document.body.innerHTML = document.body.innerHTML.replace(/Posted on/g, '上传于');
    document.body.innerHTML = document.body.innerHTML.replace(/Remove/g, '删除卡片');
    document.body.innerHTML = document.body.innerHTML.replace(/Edit/g, '编辑');
    document.body.innerHTML = document.body.innerHTML.replace(/Keep/g, '收藏图片(喜欢)');
    document.body.innerHTML = document.body.innerHTML.replace(/	Rating/g, '图片评级');
    document.body.innerHTML = document.body.innerHTML.replace(/Explicit/g, 'Explicit(硬色情)');
    document.body.innerHTML = document.body.innerHTML.replace(/Questionable/g, 'Questionable(软色情)');
    document.body.innerHTML = document.body.innerHTML.replace(/Safe/g, 'Safe(安全)');
    document.body.innerHTML = document.body.innerHTML.replace(/	File:/g, '文件:');
    document.body.innerHTML = document.body.innerHTML.replace(/	Source:/g, '来源:');
    document.body.innerHTML = document.body.innerHTML.replace(/	Title/g, '图片评级');
    document.body.innerHTML = document.body.innerHTML.replace(/	Tags/g, 'Tags(标签)');
    document.body.innerHTML = document.body.innerHTML.replace(/Separate tags with spaces./g, '使用空格分隔不同标签，如果标签内含空格，则用下划线代替.');
   ///
 showHideIgnored('0','pi'); return false;



}