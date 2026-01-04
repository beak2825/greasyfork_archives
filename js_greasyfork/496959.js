// ==UserScript==
// @name         Carrd.co编辑器汉化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用脚本对网页编辑器的UI英文进行动态汉化
// @author       Zola
// @license      MIT
// @match        https://carrd.co/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496959/Carrdco%E7%BC%96%E8%BE%91%E5%99%A8%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/496959/Carrdco%E7%BC%96%E8%BE%91%E5%99%A8%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 汉化词典 ---
    const translationDict = {
        // ==============================
        //  基础界面和元素
        // ==============================
        'My Sites': '我的网站',
        'Dashboard': '仪表板',
        'Edit': '编辑',
        'Container': '容器',
        'Type': '类型',
        'Columns': '列',
        'Left': '左',
        'Middle': '中间',
        'Width': '宽度',
        'Alignment': '对齐',
        'Right': '右',
        'Options': '选项',
        'Use as spacer': '使用间隔',
        'Add': '添加',
        'Done': '完成',
        'Exit': '退出',
        'List': '列表',
        'Buttons': '按钮',
        'Links': '链接',
        'Icons': '图标',
        'Table': '表格',
        'Divider': '分隔符',
        'Form': '表单',
        'Embed': '嵌入',
        'Control': '控制',
        'Text': '文本',
        'Audio': '音频',
        'Gallery': '图库',
        'Timer': '计时器',
        'Widget': '小部件',
        'Animation': '动画',
        'Element': '元素',
        'Style': '样式',
        'Icon': '图标',
        'Label': '标签',
        'URL': '网址',
        'Page': '页面',
        'Untitled': '无标题',
        'Close': '关闭',
        'Reset': '重置',
        'Properties': '属性',

        // ==============================
        //  布局和外观
        // ==============================
        'Appearance': '外观',
        'Layout': '布局',
        'Position': '位置',
        'Height': '高度',
        'Padding': '内边距',
        'Vertical': '垂直',
        'Horizontal': '水平',
        'Gutters': '间距',
        'Margins': '外边距',
        'Margin': '边距',
        'Top': '上',
        'Bottom': '下',
        'Corner Rounding': '圆角',
        'Corner Radius': '圆角半径',
        'Top left': '左上',
        'Top right': '右上',
        'Bottom left': '左下',
        'Bottom right': '右下',
        'Contents': '内容',
        'Background': '背景',
        'Border': '边框',
        'Drop Shadow': '投影',
        'Spacing': '间距',
        'Spacing': '间距',
        'Stack': '堆叠',
        'Stack (reverse)': '反向堆叠',
        'Stack on top': '堆叠在顶部',
        'Edge to Edge': '边缘对齐',
        'Full Bleed': '全屏出血',

        // ==============================
        //  颜色和背景
        // ==============================
        'Color': '颜色',
        'Background': '背景',
        'None': '无',
        'Color': '颜色',
        'Gradient': '渐变',
        'Image': '图片',
        'Video': '视频',
        'Slideshow': '幻灯片',
        'Off': '关闭',
        'Horizontally': '水平',
        'Vertically': '垂直',
        'Both': '两者',
        'Fill': '填充',
        'Fit': '适应',
        'Stretch': '拉伸',
        'Default': '默认',
        'Custom': '自定义',
        'Tile': '平铺',
        'Size': '大小',
        'Parallax': '视差',
        'Transparency Color': '透明色',
        'Applied to transparent areas within the image (if applicable).': '应用于图像中的透明区域（如果适用）。',
        'Overlay': '覆盖',
        'Linear': '线性',
        'Radial': '径向',
        'Conic': '锥形',
        'Reverse': '反转',
        'Stop #1': '分段 #1',
        'Stop #2': '分段 #2',
        'Stop #3': '分段 #3',
        'Pattern': '图案',
        'Angle': '角度',
        'Distance': '距离',
        'Fade Color': '渐变颜色',

        // ==============================
        //  位置和方向
        // ==============================
        'Auto': '自动',
        'Center': '居中',
        'Top Left': '左上',
        'Top': '顶部',
        'Top Right': '右上',
        'Right': '右侧',
        'Bottom Right': '右下',
        'Bottom': '底部',
        'Bottom Left': '左下',
        'Left': '左侧',
        'Order': '顺序',
        'Orientation': '方向',

        // ==============================
        //  图像和媒体
        // ==============================
        'Images': '图像',
        'Image': '图片',
        'Video': '视频',
        'Video URL': '视频链接地址',
        'Audio': '音频',
        'Gallery': '图库',
        'Slideshow': '幻灯片',
        'Upload': '上传',
        'Thumbnail': '缩略图',
        'Crop': '裁剪',
        'Crop to fill': '裁剪填充',
        'Rotate': '旋转',
        'Flip Horizontally': '水平翻转',
        'Flip Vertically': '垂直翻转',
        'Adjustments': '调整',
        'Effects': '特效',
        'Hue': '色相',
        'Saturation': '饱和度',
        'Brightness': '亮度',
        'Contrast': '对比度',
        'Sepia': '复古/褐色',
        'Black and White': '黑白',
        'Invert': '反色',
        'Alt Text': '替代文本',
        'Link URL': '链接网址',
        'Scale': '缩放',
        'Rectangle': '矩形',
        'Aspect Ratio': '纵横比',
        '1:1 (square)': '1:1 (正方形)',
        '9:16 (portrait)': '9:16 (竖屏)',
        '16:9': '16:9',
        '16:10': '16:10',
        '4:3': '4:3',
        '4:5': '4:5',
        'Letterbox Color': '留白填充色',

        // ==============================
        //  动画和交互
        // ==============================
        'Add Style': '添加样式',
        'On Visible': '可见时',
        'On Hover': '悬停时',
        'On Click': '点击时',
        'On Load': '加载时',
        'On Section Change': '节更改时',
        'On Completion': '完成时',
        'On Success': '成功时',
        'On Failure': '失败时',
        'Fade In': '淡入',
        'Fade Up': '淡出',
        'Fade Down': '淡出',
        'Fade Left': '淡入左侧',
        'Fade Right': '淡入右侧',
        'Fade In Background': '背景淡入',
        'Blur In': '模糊进入',
        'Tilt Left': '左倾斜',
        'Tilt Right': '右倾斜',
        'Flip Forward': '向前翻转',
        'Flip Backward': '向后翻转',
        'Flip Left': '左翻转',
        'Flip Right': '右翻转',
        'Slide Left': '左滑动',
        'Slide Right': '右滑动',
        'Wipe Up': '向上擦除',
        'Wipe Down': '向下擦除',
        'Wipe Left': '向左擦除',
        'Wipe Right': '向右擦除',
        'Wipe Diagonal': '对角擦除',
        'Wipe Reverse Diagonal': '反对角擦除',
        'Zoom In': '放大',
        'Zoom Out': '缩小',
        'Bounce Up': '向上弹跳',
        'Bounce Down': '向下弹跳',
        'Bounce Left': '向左弹跳',
        'Bounce Right': '向右弹跳',
        'Duration': '持续时间',
        'Delay': '延迟',
        'Threshold': '阈值',
        'Normal': '正常',
        'Replayable': '可重放',
        'Automatically replay animation when this element is scrolled back into view.': '当此元素滚动回视图时自动重播动画。',
        'Transition': '过渡',
        'Fade': '淡出',
        'Crossfade': '交叉淡入淡出',
        'Instant': '瞬时',

        // ==============================
        //  按钮和链接
        // ==============================
        'Button': '按钮',
        'Link': '链接',
        'Hover': '悬停',
        'Link Style': '链接样式',
        'Underlined': '带下划线的',
        'Plain': '纯文本',
        'Shape': '形状',
        'Square': '方形',
        'Circle': '圆形',
        'Triangle': '三角形',
        'Pentagon': '五边形',
        'Hexagon': '六边形',
        'Octagon': '八边形',
        'Diamond': '菱形',
        'Star': '星形',
        'Grow': '放大',
        'Shrink': '缩小',
        'Raise': '升高',
        'Intensity': '强度',
        'Lowest': '最低',

        // ==============================
        //  表单和输入
        // ==============================
        'Form': '表单',
        'Inputs': '输入',
        'Fields': '字段',
        'Select': '选择',
        'Text Area': '文本区域',
        'Checkbox': '复选框',
        'Number': '数字',
        'Phone': '电话',
        'File': '文件',
        'Email': '电子邮件',
        'Message': '消息',
        'Subject': '主题',
        'Optional': '可选',
        'Require Consent': '需要同意',
        'Autofocus form': '自动对焦表单',
        'Span multiple lines': '跨多行',
        'Allow longer labels to span multiple lines.': '允许较长的标签跨多行。',

        // ==============================
        //  定时器和日期
        // ==============================
        'Timer': '计时器',
        'Countdown': '倒计时',
        'Countup': '正计时',
        'Zone': '区域',
        'Date': '日期',
        'Time': '时间',
        'Days': '天',
        'Hours': '小时',
        'Minutes': '分钟',
        'Seconds': '秒',
        'Persistent': '持久性',
        'Maintains duration between subsequent visits.': '保持后续访问之间的持续时间。',

        // ==============================
        //  文本和排版
        // ==============================
        'Font': '字体（简体：Zc;Ma）（繁体：Del;Ha,pot,moc）',
        'Weight': '粗细',
        'Line Spacing': '行距',
        'Letter Spacing': '字母间距',
        'Lowercase': '小写',
        'Uppercase': '大写',
        'Small Caps': '小型大写',
        'Headings': '标题',
        'Main Heading': '主标题',
        'Subheading': '副标题',
        'Paragraph': '段落',
        'Caption': '标题',
        'Bold': '加粗',
        'Italic': '斜体',
        'Underline': '下划线',
        'Strike': '删除线',
        'Superscript': '上标',
        'Subscript': '下标',
        'Highlight': '高亮',
        'Code': '代码',
        'Justify': '对齐边缘',
        'Paragraph Spacing': '段落间距',

        // ==============================
        //  表格和列表
        // ==============================
        'Table': '表格',
        'Rows': '行',
        'Row': '行',
        'Column': '列',
        'Items': '项目',
        'Bulleted': '项目符号',
        'Numbered': '编号',
        'Indent': '缩进',
        'Max': '最大',
        'Bullets': '项目符号',

        // ==============================
        //  图标和符号
        // ==============================
        'Icon Size': '图标大小',
        'Cancel': '取消',
        'Cancel (Light)': '取消（浅色）',
        'Check': '检查',
        'Check (Light)': '检查（浅色）',
        'Chevron': '尖头',
        'Chevron (Light)': '尖头（浅色）',
        'Dash': '破折号',
        'Dash (Light)': '破折号（浅色）',
        'Dot': '点',
        'Heart': '心',
        'Plus': '加号',
        'Plus (Light)': '加号（浅色）',
        'Question': '问题',
        'Circles': '圆形',
        'Squares': '方形',
        'Dots': '点',

        // ==============================
        //  分隔符和线条
        // ==============================
        'Divider': '分隔符',
        'Dividers': '分隔符',
        'Line': '线',
        'Single': '单一',
        'Double': '双倍',
        'Dashed': '虚线',
        'Dotted': '点状',
        'Waves': '波浪',
        'Zigzag': '之字形',
        'Diagonal': '对角线',
        'Diagonal (reverse)': '反向对角线',
        'Spirals': '螺旋',
        'Hearts': '心形',
        'Stars': '星形',
        'Thickness': '厚度',

        // ==============================
        //  设置和选项
        // ==============================
        'Settings': '设置',
        'No settings available for this Control type.': '此控制类型无可用设置。',
        'Mode': '模式',
        'Method': '方法',
        'Format': '格式',
        'Action': '操作',
        'Behavior': '行为',
        'Default behavior. Simply scroll to this point.': '默认行为。简单地滚动到此点。',
        'Speed': '速度',
        'Speed at which the browser will scroll to this point.': '浏览器滚动到此点的速度。',
        'Offset': '偏移',
        'Distance to offset the final scroll position.': '偏移最终滚动位置的距离。',

        // ==============================
        //  优化和性能
        // ==============================
        'Optimize': '优化',
        'Improve load time by optimizing the image when necessary (recommended).': '通过在必要时优化图像来改善加载时间（推荐）。',
        'Improve load time by optimizing this gallery\'s images when necessary (recommended).': '通过在必要时优化此图库的图像来改善加载时间（推荐）。',
        'Improve load time by deferring or "lazy" loading when necessary (recommended).': '通过在必要时延迟或"懒惰"加载来改善加载时间（推荐）。',
        'Improve load time by optimizing this image when necessary (recommended).': '通过在必要时优化此图像来改善加载时间（推荐）。',
        'Improve load time by optimizing this slideshow\'s images when necessary (recommended).': '通过在必要时优化此幻灯片的图像来改善加载时间（推荐）。',
        'Defer': '延迟',
        'Defer loading': '延迟加载',
        'Wait': '等待',
        'Until Loaded': '直到加载完成',
        'Loader': '加载器',
        'Bars': '条',
        'Bouncing Dots': '弹跳点',
        'Spinner': '旋转器',
        'Spinner (bars)': '旋转器（条）',
        'Spinner (dots)': '旋转器（点）',
        'Spinner (ring)': '旋转器（环）',

        // ==============================
        //  保护和安全性
        // ==============================
        'Protect': '保护',
        'Mitigate attempts to copy or download this gallery\'s images.': '减轻复制或下载此图库图像的尝试。',
        'Mitigate attempts to copy or download this image.': '减轻复制或下载此图像的尝试。',
        'Mitigate attempts to copy or download this slideshow\'s images.': '减轻复制或下载此幻灯片图像的尝试。',
        'Protect with reCAPTCHA': '使用reCAPTCHA保护',
        'Password Protection': '密码保护',

        // ==============================
        //  视频和音频设置
        // ==============================
        'Starting Time': '开始时间',
        'Start video at this exact time (in MM:SS format).': '在这个确切时间开始视频（格式为MM:SS）。',
        'Start video at this exact time (in HH:MM:SS format).': '在指定时间开始播放（格式HH:MM:SS）。',
        'Automatically play this video on load.': '加载时自动播放此视频。',
        'Automatically replay this video when it ends.': '视频结束时自动重播。',
        'Mute this video\'s audio track by default.': '默认静音此视频的音轨。',
        'Display player controls by default.': '默认显示播放器控件。',
        'Show player controls': '显示播放器控件',
        'Mute audio': '静音',
        'Loop playback': '循环播放',
        'Autoplay': '自动播放',
        'Accepts videos in MP4 format (up to 64MB). Note: only intended for short clips. Switch to Embed to use longer, higher quality videos.': '接受MP4格式的视频（最大64MB）。注意：仅适用于短片。切换到嵌入以使用更长、更高质量的视频。',
        'Accepts URLs in the following formats:': '支持以下格式的链接：',
        'Show the video\'s thumbnail image, requiring a click or tap to activate the video\'s player.': '显示视频缩略图，点击或触摸后激活播放器。',
        'Show a custom thumbnail, requiring a click or tap to activate the video\'s player. Accepts images in JPEG, PNG, and GIF (up to 32MB) format.': '显示自定义缩略图，点击后激活播放器。支持JPEG, PNG, GIF格式（最大32MB）。',
        'Show poster': '显示海报',
        'Display this video\'s poster.': '显示此视频的海报。',
        'Prevent tracking and cookie usage.': '防止追踪和使用Cookie。',
        'Show related videos at the end of playback.': '播放结束后显示相关视频。',
        'Use privacy-enhanced mode': '使用隐私增强模式',
        'Enable YouTube\'s': '启用YouTube的',
        'privacy-enhanced mode': '隐私增强模式',
        'for this video (recommended).': '（推荐）。',

        // ==============================
        //  图库和灯箱
        // ==============================
        'Shows a static grid of images.': '显示静态图像网格。',
        'Shows a grid of thumbnails that enlarge to full size lightbox when clicked.': '显示一个缩略图网格，单击时放大到全尺寸灯箱。',
        'Captions': '字幕',
        'Below': '下方',
        'Fixed': '固定',
        'Lightbox': '灯箱',
        'Color Scheme': '配色方案',
        'Light': '浅色',
        'Dark': '深色',
        'Allow navigation': '允许导航',
        'Allow on mobile': '允许在移动设备上使用',
        'Show controls on mobile': '在移动设备上显示控件',
        'Show captions': '显示字幕',
        'Let users navigate between lightbox images using controls, cursor keys, or swiping.': '让用户使用控件、光标键或滑动在灯箱图像之间导航。',
        'Extend lightbox behavior to mobile screens.': '将灯箱行为扩展到移动屏幕。',
        'Display captions beneath each lightbox image.': '在每个灯箱图像下方显示字幕。',
        'Provide lightbox controls on mobile screens. Disabling this option will still allow swiping.': '在移动屏幕上提供灯箱控件。禁用此选项仍将允许滑动。',

        // ==============================
        //  幻灯片
        // ==============================
        'Preserve aspect ratios': '保持纵横比',
        'Prevent cropping by preserving each slideshow image\'s aspect ratio.': '通过保持每个幻灯片图像的纵横比来防止裁剪。',
        'Ignore': '忽略',
        'Strict': '严格',
        'Ignores this slideshow\'s aspect ratio.': '忽略此幻灯片的纵横比。',
        'Strictly maintains this slideshow\'s aspect ratio.': '严格保持此幻灯片的纵横比。',
        'Navigation': '导航',

        // ==============================
        //  嵌入和代码
        // ==============================
        'Embed': '嵌入',
        'IFRAME': 'IFRAME',
        'Inline': '内联',
        'Hidden': '隐藏',
        'Code': '代码',

        // ==============================
        //  图像效果
        // ==============================
        'Zoom In Image': '放大图像',
        'Zoom Out Image': '缩小图像',
        'Focus Image': '聚焦图像',
        'Brighten': '变亮',
        'Colorize': '着色',
        'Dim': '变暗',
        'Monochrome': '单色',
        'Unblur': '取消模糊',
        'Undim': '取消变暗',
        'Blur': '模糊',
        'Manual': '手动',

        // ==============================
        //  移动端适配
        // ==============================
        'Mobile': '移动端',
        '(Mobile)': '移动端',
        'Manually adjust this element\'s appearance when viewed on mobile screens (advanced).': '在移动屏幕上查看时手动调整此元素的外观（高级设置）。',
        'Automatically optimize this element for viewing on mobile screens (recommended).': '自动优化此元素以便在移动屏幕上查看（推荐）。',
        'Include tablet-sized screens': '包括平板大小的屏幕',
        'Desktop Only': '仅限桌面',
        'Mobile Only': '仅限移动设备',

        // ==============================
        //  部分和章节
        // ==============================
        'Section Break': '分节符',
        'Header Marker': '页眉标记',
        'Footer Marker': '页脚标记',
        'Scroll Point': '滚动点',
        'Show in Section View': '在节视图中显示',
        'Name': '名称',
        'Hide header': '隐藏页眉',
        'If a header marker is present, hide all elements before it when this section is visible.': '如果存在页眉标记，当该节可见时隐藏其前面的所有元素。',
        'Hide footer': '隐藏页脚',
        'If a footer marker is present, hide all elements after it when this section is visible.': '如果存在页脚标记，当该节可见时隐藏其后面的所有元素。',
        'Disable auto-scroll': '禁用自动滚动',
        'Prevent the browser from scrolling to the top of the page when this section opens.': '防止浏览器在该节打开时滚动到页面顶部。',
        'Exclude section': '排除节',
        'Exclude this section (and all elements within it) from publishing.': '从发布中排除此节（及其所有元素）。',
        'Redirect on open': '打开时重定向',
        'Perform a delayed redirect to another section when this section opens.': '在此节打开时执行延迟重定向到另一节。',
        'Invisible': '不可见',
        'Prevent this scroll point\'s name from appearing in the browser address bar when visited.': '防止访问时此滚动点的名称出现在浏览器地址栏中。',
        'section': '独立章节',
        'When placed in a': '当放置在',
        'tags until the section opens (recommended).': '标签直到章节打开（推荐）。',

        // ==============================
        //  表单处理
        // ==============================
        'Recipient Email': '收件人邮箱',
        'Filter messages': '过滤消息',
        'Displays the above message in an alert.': '在警报中显示上述消息。',
        'Collect UTM parameters': '收集UTM参数',
        'Reset on section change': '在节更改时重置',
        'Export variables': '导出变量',
        'Enable debug mode': '启用调试模式',
        'Contact': '联系',
        'Signup ...': '注册...',
        'Email': '电子邮件',
        'Message': '消息',
        'Company Name': '公司名称',
        'Phone Number': '电话号码',
        'Subject': '主题',
        'Company': '公司',
        'Full Name': '全名',

        // ==============================
        //  支付和电商
        // ==============================
        'Stripe Checkout': 'Stripe（钱包）',
        'Gumroad': 'Gumroad（商铺）',
        'Facebook Like': 'Facebook Like（社交）',
        'PayPal': 'PayPal（钱包）',
        'Typeform': 'Typeform（在线填表）',
        'Product': '产品',
        'Pay': '支付',
        'Book': '预订',
        'Donate': '捐赠',
        'Subscribe': '订阅',
        'Price ID': '价格ID',
        'Button Label': '按钮标签',
        'Require billing address': '需要账单地址',
        'Require shipping address': '需要送货地址',
        'Success URL': '成功URL',
        'API Keys': 'API密钥',
        'Publishable Key': '发布密钥',
        'Secret Key': '秘密密钥',

        // ==============================
        //  HTML/CSS属性
        // ==============================
        'ID': 'ID',
        'Classes': '类',
        'Additional classes to apply to this element.': '应用于此元素的其他类。',
        'Attributes': '属性',
        'Visibility': '可见性',
        'Exclude': '排除',
        'This element\'s unique ID. Leave blank to use the auto-generated default (shown above).': '此元素的唯一ID。留空以使用自动生成的默认值（如上所示）。',
        'Add class …': '添加类名…',
        'Add attribute …': '添加属性…',

        // ==============================
        //  发布和站点设置
        // ==============================
        'Publish': '发布',
        'Publish …': '发布…',
        'Publish Changes': '发布更改',
        'View Site': '查看网站',
        'View published site in a new tab': '在新标签页查看已发布网站',
        'Start Over': '重新开始',
        'Background …': '背景…',
        'Page …': '页面…',
        'Instructions': '说明',
        'Shortcuts': '快捷键',
        'Documentation': '文档',
        'Title': '标题',
        'Description': '描述',
        'A brief description of this site (and what\'s usually used in bookmarks, search engine listings, etc).': '对该站点的简要描述（通常用于书签、搜索引擎列表等）。',
        'This site\'s title (and what gets shown at the top of the browser window).': '此站点的标题（显示在浏览器窗口顶部）。',
        'Serve fonts locally': '本地提供字体',
        'Reduce motion if requested': '按需减少动画',
        'Meta Tags': '元标签',
        'Add meta tag …': '添加Meta标签…',
        'Redirects': '重定向',
        'Add redirect …': '添加重定向…',
        'Canonical URL': '规范网址',
        'Browser Color': '浏览器颜色',
        'Update Frequency': '更新频率',
        'Indexing': '索引',
        'Google Analytics ID': '谷歌分析ID',
        'Password Protection': '密码保护',
        'Language': '语言',
        'Media': '媒体',
        'Share Image': '分享图片',
        'Image to display when this site is shared on a social network (like': '当此网站分享到社交网络（如',
        'Defaults to a screenshot if not provided.': '时显示的图片。如未提供，默认为网页截图。',
        'The icon (aka "favicon") to show in the browser address bar for this site.': '显示在浏览器地址栏的图标（favicon）。',
        'Folder': '文件夹',
        'Assigns this site to the above folder (': '将此站点分配到上述文件夹（',
        'learn more': '了解更多',

        // ==============================
        //  模板和草稿
        // ==============================
        'Publish to a': '发布到',
        'Publish to a registered': '发布到已注册的',
        'custom domain': '自定义域名',
        'or subdomain. The following': '或子域名。请在域名提供商处添加以下',
        'DNS records': 'DNS记录',
        'must be added to the domain via your domain provider or registrar (': '（',
        'how do I do this?': '怎么做？',
        'Once added, please allow up to an hour for the domain to initialize and for': '添加后，请等待最多一小时以进行域名初始化和',
        'SSL': 'SSL证书',
        'to take effect.': '生效。',
        'Save as a': '保存为',
        'template': '模板',
        'you can use as a starting point for new sites.': '，可用作新网站的起点。',
        'Save as an offline': '保存为离线',
        'draft': '草稿',
        'Useful if you\'re not quite ready to share it with the world or have elements you have yet to finish.': '如果你还没准备好发布，或者还没完成设计，这很有用。',
        'Lowercase letters, numbers, and hyphens only. Must be at least 3 characters long.': '仅限小写字母、数字和连字符。至少3个字符。',

        // ==============================
        //  文本格式和Markdown
        // ==============================
        'Use a backslash to prevent a character from being parsed as Markdown (eg.': '使用反斜杠防止字符被解析为Markdown（例如：',
        'Non-Breaking\\sSpace': '不间断\\s',
        'Line\\nBreak': '换行\\n',
        '[Color text]{#colorcode}': '[颜色文本]{#颜色代码}',
        '[Color text]{colorname}': '[颜色文本]{英文的颜色名称}',
        '||Spoilers||': '||剧透||',
        '^Superscript^': '^上标^',
        '~Subscript~': '~下标~',
        '==Highlight==': '==高亮==',
        '~~Strike~~': '~~删除线~~',
        '`Code`': '`代码`',
        '[Link text](': '[链接文本](',
        'any valid URL': '任何有效的URL',
        '__Underline__': '__下划线__',
        '***Bold Italic***': '***粗斜体***',
        '_Italic_': '_斜体_',
        'or': '或',
        '*Italic*': '*斜体*',
        '**Bold**': '**粗体**',
        'Supports the following': '支持以下',
        'formatting:': '格式：',

        // ==============================
        //  日期和月份
        // ==============================
        'Jan': '一月',
        'Feb': '二月',
        'Mar': '三月',
        'Apr': '四月',
        'May': '五月',
        'Jun': '六月',
        'Jul': '七月',
        'Aug': '八月',
        'Sep': '九月',
        'Oct': '十月',
        'Nov': '十一月',
        'Dec': '十二月',

        // ==============================
        //  表格相关
        // ==============================
        'Rows': '行',
        'Digits': '数字',
        'Labels': '标签',
        'Outline': '轮廓',
        'Solid': '实心',
        'Delimiters': '分隔符',
        'Colons': '冒号',
        'Lines': '线',
        'Full': '全',
        'Abbreviated': '缩写',
        'Initialed': '首字母',
        'Precision': '精度',
        'Minimal': '最小',
        'Grid': '网格',

        // ==============================
        //  按钮样式
        // ==============================
        'Label Only': '仅标签',
        'Icon + Label': '图标 + 标签',
        'Label + Icon': '标签 + 图标',
        'Icon + Wide Label': '图标 + 宽标签',
        'Wide Label + Icon': '宽标签 + 图标',
        'Label Alignment': '标签对齐',

        // ==============================
        //  颜色和边框
        // ==============================
        'Border Color': '边框颜色',
        'Box': '盒子',
        'Wide Box': '宽盒子',
        'Tall Box': '高盒子',

        // ==============================
        //  其他界面元素
        // ==============================
        'All': '全部',
        'First Line': '第一行',
        'Stagger': '错开',
        'Center on next': '居中下一个',
        'Align to previous': '对齐上一个',
        'Make a copy of this element': '复制此元素',
        'Delete this element': '删除此元素',
        'No styles yet. Click': '暂无样式。点击',
        'to create one from this element\'s appearance and animation settings.': '根据此元素的外观和动画设置创建一个样式。',

        // ==============================
        //  工具提示和帮助文本
        // ==============================
        'Contents: On Visible': '内容：可见时',
        'Performed on the contents of this element when it first becomes visible or scrolls into view.': '在此元素首次变得可见或滚动到视图时执行。',
        'Apply visibility to contents': '应用可见性到内容',
        'Allow the visibility of this element to trigger the "On Visible" animations of its contents.': '允许此元素的可见性触发其内容的"可见时"动画。',
        'Performed when this element first becomes visible or scrolls into view.': '当此元素首次变得可见或滚动到视图时执行。',
        'Performed when an icon is hovered.': '当图标被悬停时执行。',
        'Performed when this element is hovered.': '当悬停在此元素上时执行。',
        'Performed on this element when this site finishes loading.': '当此站点加载完成时在此元素上执行。',
        'Icons: On Hover': '图标：悬停时',
        'Images: On Hover': '图像：悬停时',
        'Buttons: On Hover': '按钮：悬停时',
        'Button: On Hover': '按钮：悬停时',
        'Elements: On Load': '元素：加载时',
        'Links: On Hover': '链接：悬停时',

        // ==============================
        //  权限和访问
        // ==============================
        'Allow': '允许',
        'Camera': '摄像头',
        'Fullscreen': '全屏',
        'Motion': '检测移动',
        'Microphone': '麦克风',
        'Display Capture': '屏幕捕捉',

        // ==============================
        //  电子邮件集成
        // ==============================
        'Return endpoint responses': '返回端点响应',
        'Create Contact': '创建联系人',
        'Add Contact to List': '添加联系人到列表',
        'Add Contact to Automation': '添加联系人到自动化',
        'Your ActiveCampaign': '你的ActiveCampaign',
        'The numeric ID of your Brevo list. Carrd will populate the following': '你的Brevo列表的数字ID。Carrd会填充以下',
        'text attributes': '文本属性',
        'if present:': '如果存在：',
        'with this site\'s URL.': '使用此站点的URL。',
        'with this site\'s title.': '使用此站点的标题。',
        'with this form\'s unique ID.': '使用此表单的唯一ID。',
        'Require double opt-in': '需要双重确认',
        'Send new contacts a confirmation email before adding them to your list (': '在将新联系人添加到你的列表之前发送确认邮件（',
        'Your SendFox account\'s': '你的SendFox帐户的',
        'Subscriber Groups': '订阅者组',
        'to apply to new subscribers (up to 5). If you\'re using MailerLite Classic, only the first group will apply.': '适用于新订阅者（最多5个）。如果你使用MailerLite Classic，只有第一个组适用。',
        'Add group …': '添加组...',
        'The unique ID of your Beehiiv publication. Located under your Beehiiv account\'s Integrations tab (Publication Id → API V2). Carrd will populate the following': '你的Beehiiv出版物的唯一ID。位于你的Beehiiv帐户的集成标签下（出版物ID → API V2）。Carrd会填充以下',
        'Automation IDs': '自动化ID',
        'Send welcome email': '发送欢迎邮件',
        'Completion URL': '完成URL',

        // ==============================
        //  电子邮件模板
        // ==============================
        'Subject Template': '主题模板',
        'Body Template': '正文模板',
        'Prefill Reply-To address': '预填写回复地址',

        // ==============================
        //  标签和元数据
        // ==============================
        'tags': '标签',
        'Defer': '延迟',

        // ==============================
        //  重复项和特殊处理
        // ==============================
        // 注意：以下是一些可能重复的键，根据上下文可能需要特殊处理
        'Center': '居中', // 重复项，但含义一致
        'Border': '边框', // 重复项，但含义一致
        'Size': '大小', // 重复项，但含义一致
        'Image': '图片', // 重复项，但含义一致
        'Video': '视频', // 重复项，但含义一致
        'Background': '背景', // 重复项，但含义一致
        'Alignment': '对齐', // 重复项，但含义一致
        'Right': '右', // 重复项，但含义一致
        'Options': '选项', // 重复项，但含义一致
        'Use as spacer': '使用间隔', // 重复项，但含义一致
        'Top': '上', // 重复项，但含义一致
        'Bottom': '下', // 重复项，但含义一致
        'Color': '颜色', // 重复项，但含义一致
        'Default': '默认', // 重复项，但含义一致
        'Custom': '自定义', // 重复项，但含义一致
        'Spacing': '间距', // 重复项，但含义一致
        'Thickness': '厚度', // 重复项，但含义一致
        'Defer': '延迟', // 重复项，但含义一致
    };


    // --- 2. 核心翻译逻辑 (安全修复版) ---
    function translate(node) {
        if (!node) return;

        // 【安全检查】如果节点位于画布预览区 (#canvas) 或代码/脚本标签内，直接跳过
        // 这防止了脚本错误地翻译用户自己输入的内容
        if (node.parentElement && (
            node.parentElement.closest('#canvas') || // 编辑器画布区（绝对不能动）
            node.parentElement.closest('style') ||   // 样式标签
            node.parentElement.closest('script') ||  // 脚本标签
            node.parentElement.closest('.--content') || // 某些组件的内容区
            node.parentElement.isContentEditable     // 用户正在输入的文本区域
        )) {
            return;
        }

        // 1. 处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text && translationDict[text]) {
                node.textContent = translationDict[text];
            }
            // 处理带变量的文本 (简单正则示例，保留 Stop # 逻辑)
            else if (text.startsWith('Stop #')) {
                node.textContent = text.replace('Stop #', '分段 #');
            }
            return;
        }

        // 2. 处理元素节点
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toUpperCase();

            // 跳过输入框的值（input/textarea），防止修改用户填写的表单值
            // 但仍需翻译 placeholder 和 title
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                const attrs = ['placeholder', 'title', 'aria-label'];
                attrs.forEach(attr => {
                    const val = node.getAttribute(attr);
                    if (val && translationDict[val.trim()]) {
                        node.setAttribute(attr, translationDict[val.trim()]);
                    }
                });
                // 对 submit 按钮的 value 进行翻译
                if (tagName === 'INPUT' && (node.type === 'submit' || node.type === 'button')) {
                    const val = node.value;
                    if (val && translationDict[val.trim()]) {
                        node.value = translationDict[val.trim()];
                    }
                }
                return; // 不再递归 input/textarea 的子节点
            }

            // 处理普通元素的属性 (title, tooltip, label)
            const attrs = ['title', 'aria-label', 'data-tooltip'];
            attrs.forEach(attr => {
                const val = node.getAttribute(attr);
                if (val && translationDict[val.trim()]) {
                    node.setAttribute(attr, translationDict[val.trim()]);
                }
            });

            // 递归处理子节点
            node.childNodes.forEach(translate);
        }
    }

    // --- 3. 初始化与监听 ---
    function initialTranslation() {
        // 直接从 body 开始，配合安全检查
        translate(document.body);
    }

    // 配置 MutationObserver 监听动态变化 (React/SPA 必需)
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            // 处理新增节点
            mutation.addedNodes.forEach(node => {
                translate(node);
            });
            // 处理属性变化
            if (mutation.type === 'attributes') {
                translate(mutation.target);
            }
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label', 'data-tooltip', 'value']
    });

    // 页面加载后延迟执行，确保动态组件挂载完成
    window.addEventListener('load', () => {
        setTimeout(initialTranslation, 500);
        setTimeout(initialTranslation, 1500);
        setTimeout(initialTranslation, 3000);
    });

    // 立即执行一次
    initialTranslation();

})();