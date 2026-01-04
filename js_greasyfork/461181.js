// ==UserScript==
// @name         Framer汉化插件
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @author       M-o-x
// @description  将Framer网页版翻译成中文，方便使用。
// @match        https://framer.com/projects/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461181/Framer%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/461181/Framer%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// 创建一个JSON对象data
var data = JSON.parse(
  '{"Accessibility":"可访问性","Account Settings":"帐户设置","Add Breakpoint":"添加断点","Add Collection":"添加收藏","Add Frame":"添加框架","Add Sample":"添加样本","Add Section":"添加区块","Add Stack":"添加堆栈","Advanced":"高级","Advanced Layout":"高级布局","Align":"对齐","Align Bottom":"底部对齐","Align Horizontally":"水平对齐","Align Left":"左对齐","Align Right":"右对齐","Align to Parent":"对齐父级","Align to Selection":"对齐选择","Align Top":"顶部对齐","Align Vertically":"垂直对齐","All":"全部","All Props":"所有道具","Alphabetically":"按字母顺序排列","Analytics":"分析","Animate on Zoom":"缩放动画","Animation":"动画","Any changes made to this list will go live on publish. Reorder the items to define the priority.":"对这个列表所做的任何修改都会在发布时生效。重新排列项目以确定优先级。","API Documentation":"API文档","App Tour":"应用程序之旅","Appear":"出现","Appearance":"版面","Appears next to the title in your browser tab. Recommended size is 32 × 32 px.":"出现在你的浏览器标签中的标题旁边。建议尺寸为32 × 32 px。","Appears when a link to the page is shared on social media. If not set, the social image set on General will be used instead. Recommended size is 1200 × 630 px.":"当页面的链接被分享到社交媒体上时出现。如果不设置，将使用在 常规 上设置的社交图片来代替。建议尺寸为1200 × 630 px。","Appears when a link to the site is shared on social media. All other pages will use this by default, unless overridden. Recommended size is 1200 × 630 px.":"当网站的链接在社交媒体上被分享时出现。所有其他页面将默认使用这个，除非被覆盖。建议大小为1200 × 630 px。","Archive":"存档","Archived":"归档","Assets":"资源","Auto Size":"自适应大小","Auto Switch to Layers":"自动切换到图层","Back To Page":"返回页面","Base Domain":"基础域名","Basics":"基础","Bold":"粗体","Border":"边界","Breakpoint":"断点","Breakpoints":"断点","Bring Forward":"向前","Bring to Front":"置前","By changing this breakpoint width, you’ll update its size whenever it’s added to any of your pages.":"通过改变这个断点的宽度，当它被添加到你的任何页面时，你将更新它的尺寸。","Cancel":"取消","Canonical URL":"规范URL","Change URL":"更改URL","Chat":"对话","Children":"子级","CMS":"内容管理系统","Code":"代码","Code Overrides":"代码重构","Collection Lists":"收藏列表","Collections":"作品集","Color":"颜色","Columns":"列","Comment":"评论","Community":"社区","Component":"组件","Components":"组件","Connect a Custom Domain to enable this setting.":"连接一个自定义域名来启用这个设置。","Connect a domain purchased through a web hosting service":"连接通过虚拟主机服务购买的域名","Connect a domain you own":"连接您拥有的域名","Connect Domain":"连接域名","Console Log":"控制台日志","Content":"文本内容","Content Fields":"内容字段","Convert to CMS Page":"转换为CMS页面","Copy":"复制","Copy CSS":"复制CSS","Copy Effects":"复制效果","Copy Image":"复制图片","Copy Import":"复制导入","Copy Invite Link":"复制邀请链接","Copy Link":"复制链接","Copy Project Link":"复制项目链接","Copy Remix Link":"复制混音链接","Copy Style":"复制Style","Copy SVG":"复制SVG","Copy Text":"复制文本","Copy Version Number":"复制版本号","Create":"创建","Create Code Component":"创建代码组件","Create Code File":"创建代码文件","Create Code Override":"创建代码覆盖","Create Component":"创建组件","Create Component…":"创建组件…","Create From Code…":"从代码创建…","Create Redirect":"创建重定向","Create Team…":"创建团队...","Current":"当前","Custom":"自定义","Custom Code":"自定义代码","Custom code and scripts will be added to every page across the published site.":"自定义代码和脚本将被添加到整个发布网站的每个页面。","Custom code will be added to this page only, below site wide custom code.":"自定义代码将只被添加到这个页面，低于全站的自定义代码。","Custom Domain":"自定义域名","Custom…":"自定义…","Cut":"剪切","Danger Zone":"危险区","Decoration":"文字修饰","Default":"默认值","Delete":"删除","Desktop":"桌面","Desktop App":"桌面App","Detach From Primary":"从主体分离","Device":"设备","Direction":"方向","Directly integrate Google Analytics into your Framer site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR.":"将谷歌分析直接整合到您的Framer网站。请注意，作为网站所有者，您有责任确保您的网站处理数据的方式符合GDPR等隐私法律的规定。","Directly integrate Google Analytics into your Framer site. Please note that as a site owner you are responsible for making sure that your site is handling data in a way that is in line with privacy laws such as the GDPR. Learn More":"直接将谷歌分析整合到您的Framer网站。请注意，作为网站所有者，您有责任确保您的网站处理数据的方式符合GDPR等隐私法律的规定。了解更多","Dismissible":"禁用的","Distribute":"分布","Distribute Horizontally":"水平分布","Distribute Vertically":"垂直分布","Domains":"域名","Done":"完成","Drag":"拖动","Duplicate":"副本","Edit":"编辑","Edit Breakpoint":"编辑断点","Edit Breakpoint…":"编辑断点…","Edit Code":"编辑代码","Edit Component":"编辑组件","Edit Paragraph":"编辑段落","Edit Topbar Link":"编辑顶栏链接","Editing Overlay":"编辑遮罩层","Effects":"效果","Elements":"元素","Embed":"嵌入","End of <body> tag":"<body>标签结束","End of <head> tag":"<head>标签结束","Enter":"输入","example.framer.app":"framer app 示例","Examples":"示例","Exit":"退出","Exit tutorial":"退出教程","Favicon":"ico","Feedback":"反馈信息","File":"文件","Fill":"填充","Fit Content":"适应内容","Flatten":"扁平化","Flip Horizontally":"水平翻转","Flip Vertically":"垂直翻转","Font":"字体","Font Size":"字体大小","Forms":"形式","Frame":"框架","Gap":"间距","General":"常规","Get a free Framer subdomain":"获得一个免费的Framer子域","Get Started":"开始吧","Go to Dashboard":"转到仪表板","Go To Instance":"前往实例","Google Analytics":"谷歌分析","Google Analytics Measurement or Tracking ID":"谷歌分析测量或跟踪ID","Graphic":"图形","Grid":"网格","GridRow":"网格行","GridSpan":"栅距","Group":"分组","Handoff":"自动","Height":"高度","Help":"帮助","Hidden":"隐藏","Hide":"隐藏","Hide Get Started":"隐藏导航页","Hide Interface":"隐藏界面","Home Page":"主页","Home Page Settings":"主页设置","Homepage":"主页","Hover":"悬停","Icons":"图标","Image":"图片","Import from Figma…":"从 Figma 导入…","Import from Sketch…":"从草图导入…","Import From…":"从...导入","Insert":"插入","Inserting…":"插入中","Instantly connect a customized domain for free":"立即免费连接一个自定义域名","Interactions":"交互","Interactive":"交互","Invite":"邀请","Invite Collaborators…":"邀请队友…","Invite Members":"邀请队友","Italic":"斜体","Join Discord Community":"加入Discord社区","Key board Shortcuts":"键盘快捷键","Keyboard Shortcuts":"快捷键","Last edited":"按最近编辑时间排列","Last viewed by me":"按最近浏览时间排列","Layers":"图层","Layers Using This Background":"使用此背景的图层","Layout":"布局","Learn":"了解更多","Learn Framer":"学习Framer","Learn More":"了解更多","Letter":"字间距","Library":"程序库","Line":"行间距","Link":"链接","Link To":"链接到","Links":"链接","Lock":"锁住","Logo Link":"Logo链接","Loop":"循环","Made with Framer":"用Framer制作","Max Height":"最大高度","Max Width":"最大宽度","Media":"媒体","Min Height":"最小高度","Min Max":"宽高限度","Min Width":"最小宽度","More…":"更多…","Move":"移动","My Framer Site":"我的Framer网站","Navigation":"导航","New":"新建","New Canvas Page":"新建画布页面","New component":"新组件","New Flie…":"新建文件...","New Folder…":"新建文件夹...","New from Template…":"从模板新建…","New override":"新覆盖层","New URL":"新URL","New Web Page":"新建网页","Night Mode":"夜间模式","Not available":"不可用","Notify When Content Is Out of View":"内容超出视野时通知","Nudge Amount":"微调量","Old URL":"旧URL","Opacity":"不透明度","Open in New Project":"在新项目中打开","Open in New Tab":"在新标签中打开","Open Link":"打开链接","Open Preview":"打开预览","Open PreyieW":"打开PreyieW","Open Settings":"打开设置","Open Site":"打开网站","Open Video Tutorials":"打开视频教程","OpenTable":"打开表格","Orientation":"方向","Overflow":"溢出部分","Overlays":"遮罩层","Override":"覆盖","Overview":"概述","Padding":"内边距","Page Description":"页面描述","Page Images":"页面图片","Page Settings":"页面设置","Page Social Image":"页面社交形象","PageImages":"页面图片","Pages":"页面","Paragraph":"段落","Parent":"父级","Password":"密码","Password Protection":"密码保护","Paste":"粘贴","Paste Effects":"粘贴效果","Paste Style":"粘贴样式","Patterns":"模本","Performance Mode":"性能模式","Phone":"手机","Placeholder":"占位符","Plans":"方案","Position":"位置","Position & Size":"位置和大小","Preferences":"首选项","Preset":"预设","Press":"按下","Press Publish to":"发布到","Press Publish to add a Custom Domain.":"按下 发布 键添加一个自定义域名。","Press Publish to add a Custom Domain. Learn More":"按下 发布 键添加一个自定义域名。了解更多","Press Publish to publish your website to a base domain":"按下 发布 键，将您的网站发布到基础域名上。","Preview":"预览","Primary":"初级","Prototyping":"原型","Publish":"发布","Publish your project to activate a password for the website.":"发布你的项目以激活网站的密码。","publish your website":"发布您的网站","Quick Actions…":"快速操作…","Radius":"半径","Recent":"最近","Redirect existing URLs to new ones to maintain search engine ranking.":"将现有的URL重定向到新的URL，以保持搜索引擎的排名。","Redirects":"重定向","Redo":"重做","Remove Frame":"移除框架","Remove Stack":"移除堆栈","Remove Wrapper":"移除包裹物","Rename":"重命名","Replace With…":"替换为...","Replay Step":"回放放步骤","Request Feature":"请求功能","Reset Default Frame Fill":"重置默认帧填充","Reset Overrides":"重置覆盖","Resize to Fit Content":"调整大小以适合内容","Reverse Path Direction":"反转路径方向","Reverse Zoom Direction":"反向缩放方向","Rotation":"旋转","Rows":"行","Sample Color":"样本颜色","Save":"保存","Save as Template":"保存为模板","Saveas Template":"另存为模板","Screen":"屏幕","Scroll":"滚动","Scroll Animation":"滚动动画","Scroll Section":"滚动部分","Scroll Speed":"滚动速度","Scroll Transform":"滚动变形","Scroll Variant":"滚动变体","Search":"搜索","Section Title":"章节标题","Sections":"分栏","Select":"选择","Select All":"全选","Select All Children":"选择所有子级","Select All Siblings":"选择所有兄弟级","Select All Text Layers":"选择所有文本图层","Select All Top Parents":"选择全部最外层的父级","Select Parent":"选择父级","Select the URL that search engines should index so they don’t serve duplicate content.":"选择搜索引擎应该索引的URL，这样他们就不会提供重复的内容。","Select Top Parent":"选择最外层的父级","Select Typeface":"选择字体","Select…":"选择...","Send Backward":"向后","Send to Back":"置后","Set as Default Fill":"设置为默认填充","Set as Home Screen":"设置为主屏幕","Set as Thumbnail":"设置为缩略图","Set Home Page":"设置为主页","Shadows":"阴影","Show All Layers":"显示所有图层","Show All Links":"显示所有链接","Show Assets":"显示资产","Show Background Blur":"显示背景模糊","Show Condensed Tooltips":"显示压缩工具提示","Show Get Started":"显示导航页","Show Guides":"锁定参考线","Show Layers":"显示图层","Show page in search engines":"在搜索引擎中显示页面","Show Pages":"显示页面","Show Pixel Grid":"显示像素网格","Show Primary":"显示主体","Show Rulers":"显示标尺","Siblings":"兄弟级","Sign Out":"退出登录","Site Description":"网站描述","Site Images":"网站图片","Site Language":"网站语言","Site Settings":"网站设置","Site Title":"网站标题","Size":"尺寸","Social":"社交","Social Image":"社会形象","Stack":"堆栈","Staging":"暂存","Staging & Versions":"分期和版本","Start App Tour":"开始应用之旅","Start of <body> tag":"<body>标签的开始","Start of <head> tag":"开始<head>标签","Start the interactive app tour by clicking the play button.":"点击播放按钮，开始应用程序之旅。","Status":"状态","Subtitle":"副标题","Support":"支持","System Default":"系统预设","Tablet":"平板电脑","Tag":"标签","Team Settings":"团队设置","Templates":"模板","Text":"文本","Text Layers":"文本层","This is only required if you host your site behind a reverse proxy.":"只有当你在反向代理后面托管你的网站时，这才是必需的。","Title":"标题","to a base domain":"到一个基础域名","Tool":"工具","Top Parent":"最外层父级","Topbar":"顶栏","Topbar Link":"顶栏链接","Transition":"转换","Transition Back":"转换回来","Type":"类型","Underline":"下划线","Undo":"撤消","Ungroup":"不分组","Unpublish your website from all domains.":"从所有域名中取消发布您的网站。","Untitled":"未命名","Update":"更新","Update Primary":"更新主体","Update Primary From Instance":"从实例更新主体","Upgrade Now":"现在升级","Upgrade Plan":"升级计划","UpgradeNow":"现在升级","Upload":"上传","Upload Image…":"上传图片…","Use Direct Selection":"直接选取","Used Props":"已用道具","Utility":"实用","Variant":"变体","Version":"版本","Version History":"历史版本","Versions":"版本","View":"视图","Viewport":"视窗","Visible":"可见","Watch Tutorial":"观看教程","Weight":"字重","Width":"宽度","Wrap":"换行","Your Account":"你的帐户","Zoom":"缩放","Zoom In":"放大","Zoom Out":"缩小","Zoom to 100%":"缩放到 100%","Zoom to Fit":"缩放至最适宜","Zoom to Selection":"缩放选择"}'
);


// 定义一个函数，用于遍历网页中所有文本内容，并替换匹配的key为value
function replaceText() {
  // 获取网页中所有的元素节点
  var elements = document.getElementsByTagName("*");
  // 遍历每个元素节点
  for (var i = 0; i < elements.length; i++) {
    // 获取当前元素节点的所有子节点
    var nodes = elements[i].childNodes;
    // 遍历每个子节点
    for (var j = 0; j < nodes.length; j++) {
      // 如果当前子节点是文本节点
      if (nodes[j].nodeType === Node.TEXT_NODE) {
        // 获取当前子节点的文本内容，并去除首尾空白字符
        var text = nodes[j].nodeValue.trim();
        // 遍历JSON对象的每个属性
        for (var key in data) {
          // 如果当前属性与文本内容完全相同（区分大小写）
          if (text === key) {
            // 为更新子节点生成一个title属性，并将其文本内容添加为更新子节点的title属性值
            nodes[j].parentNode.setAttribute("title", text); 
            // 用属性对应的值替换文本内容中的属性名
            text = data[key];
            // 更新子节点的文本内容为替换后的内容
            nodes[j].nodeValue = text;
          }
        }
      }
    }
  }
}

(function () {
  "use strict";

  // 在这里写你的代码
  // 创建一个MutationObserver对象，用于监听网页中新节点产生或删除的变化
  var observer = new MutationObserver(function (mutations) {
    // 遍历每个变化记录
    for (var mutation of mutations) {
      // 如果变化记录包含了新增或删除了子节点
      if (mutation.type === "childList") {
        // 调用replaceText函数，遍历并替换网页中所有文本内容
        replaceText();
      }
    }
  });

  // 给网页根元素添加一个MutationObserver监听器，监听其所有后代元素的变化（包括新增或删除子节点）
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
