// ==UserScript==
// @name         ClipDrop 汉化脚本
// @namespace    http://yournamespace.com
// @version      1.3
// @description  汉化 ClipDrop ,除了帮助的部分，其余基本都已经汉化。
// @author       Kailous
// @match        https://clipdrop.co/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477318/ClipDrop%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477318/ClipDrop%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const translateText = (text) => {
        // 翻译映射表
        const translationMap = {
            // 全站
            'Create stunning visuals': '创造令人惊艳的视觉效果',
            'in seconds': '在几秒钟内',
            'The ultimate ecosystem of apps, plugins & resources for all creators,': '为所有创作者提供的终极应用程序、插件和资源生态系统，',
            'powered by artificial intelligence.': '由人工智能驱动。',
            'Add magic to your own apps': '为您的应用程序增添魔力',
            'with the ': '通过 ',
            'The Clipdrop API allows you to integrate best-in-class AI to your apps in minutes.': 'Clipdrop API 可让您在几分钟内将最优秀的人工智能集成到您的应用程序中。',
            'Get started with the Clipdrop API': '开始使用 Clipdrop API',
            'Open source Demos': '开源演示',
            'See result': '查看结果',
            'No image processing': '暂时无图像处理',
            'in the queue for now': '进程在排队中',
            'Frequently Asked Questions': '常见问题',
            'Integrate our cleanup API': '集成我们的清理 API',
            'Integrate our image upscaler API': '集成我们的图像放大器 API',
            'Integrate our relight API': '集成我们的重新打光 API',
            'Integrate our background remover API': '集成我们的背景移除 API',
            'Integrate our background replacer API': '集成我们的背景替换 API',
            'Integrate our text to image API': '集成我们的文本转图像 API',
            'Integrate our text remover API': '集成我们的文本移除 API',
            'Get an API key': '获取 API 密钥',
            'Show more': '显示更多',
            'show more': '显示更多',
            'All': '全部',
            'Image edition': '图像编辑',
            'Stable diffusion': '稳定扩散',
            'Real-estate': '房地产',
            'Portrait edition': '人像编辑',
            'Search': '搜索',
            'The most accurate background removal solution available': '最准确的背景移除解决方案',
            'The ': '目前',
            'most accurate': '最准确',
            ' background removal solution available': '的背景移除解决方案',
            'Details': '细节',
            'Complex objects': '复杂对象',
            'Sharpest edges': '最锐利的边缘',
            'Focus only on the main object': '仅关注主要对象',
            'Us': '我们',
            'Competitor': '竞争对手',
            'Clipdrop artificial intelligence remove image background while preserving the details of the foreground like no others.': 'Clipdrop 人工智能可在保留前景细节的同时移除图像背景，独具匠心。',
            'Clipdrop is the best background remover for very complex objects': 'Clipdrop 是最适合非常复杂对象的最佳背景移除工具',
            'Clipdrop remove image backgrounds and keeps the edges of objects extremely sharp!': 'Clipdrop 可移除图像背景，并保持对象边缘极其锐利！',
            'Clipdrop AI powered tool  is perfect for complex edges.': 'Clipdrop 由人工智能驱动，非常适用于复杂边缘。',
            'Download HD': '下载高清图',
            // 其他
            'Preview': '预览',
            'Back': '返回',
            'Edit': '编辑',
            'Download': '下载',
            'Normal map ': '法线贴图 ',
            'Depth estimation ': '深度信息 ',
            'Tools': '工具',
            'All tools': '所有工具',
            'Undo (ctrl+z)': '撤销 (Ctrl+Z)',
            'Redo (ctrl+y)': '重做 (Ctrl+Y)',
            'Open in ...': '打开于...',
            // 清理工具
            'Cleanup': '清理',
            'Remove objects, people, text and defects from your pictures automatically.': '自动从您的照片中移除物体、人物、文字和瑕疵。',
            'Remove object, defect, people, or text from your pictures in seconds': '快速删除图片中物体、缺陷、人物或文本。',
            'Click, paste, or drop a file here to start.': '点击、粘贴或拖放文件到此处以开始。',
            'Select': '选择',
            'Move': '移动',
            'Brush size': '笔刷大小',
            'High quality': '高质量',
            'High Quality mode take a little more time to re-process your image for a better result': '高质量模式需要稍多时间重新处理图像以获得更好的结果',
            'Clean': '清除',
            'Hide changes (h)': '隐藏更改 (h)',
            'Try an example': '范例展示',
            'Photographers': '摄影师',
            'Real Estate': '地产/室内',
            'Creative Agencies': '创意设计',
            'E-commerce': '电商',
            'Photographers use Cleanup to remove time stamp from pictures before printing them for their customers.With Cleanup, you can clean photographs, removing any unwanted thing.': '摄影师在为客户打印照片之前，删除照片中的时间戳。您可以清理照片，删除任何不需要的东西。',
            'Real Estate agent use Cleanup to remove unwanted objects from pictures.': '房地产经纪人使用清理功能从图片中删除不需要的对象。',
            'Creatives use Cleanup to create perfect visuals in seconds.You can easily remix any existing photo to replace parts with your own. With Cleanup, you can clean up your photos, removing any unwanted thing. Stay in the creative flow by using tools that are not on your way.': '创意者可以使用“清理”在几秒钟内创建完美的视觉效果。您可以轻松地重新混搭任何现有照片，用您自己的部分替换其中的部分。通过使用不妨碍创意流程的工具，您可以轻松清理照片，去除任何不需要的元素。保持创意流程的连贯性。',
            'Make your products shine. Impress your audience, remove distractions.': '消除干扰,让您的作品熠熠生辉，给观众留下深刻印象。',
            'Try with this example': '我也试试',
            // 图片放大器
            'Image upscaler': '图片放大器',
            'Upscale your images by 2x or 4x in seconds. It can also remove noise and recover beautiful details.': '在几秒钟内将您的图像放大2倍或4倍。它还可以去噪并恢复精美的细节。',
            'Upscale, denoise and enhance your images in seconds': '在几秒钟内对您的图像进行放大、去噪和增强处理。',
            'Click, paste, or drop up to 10 files here to start': '点击、粘贴或拖放最多10个文件到此处以开始。',
            'Smooth': '平滑',
            'Detailed': '详细',
            'Upscale': '放大',
            'Clear': '清空',
            'Add to batch,': '添加批处理，',
            'Add to batch': '添加批处理',
            'Remove compression': '去除压缩',
            'Denoise': '降噪',
            'Sharpen': '锐化',
            'Represented as a small tool, Clipdrop Image upscaler can improve image quality from compressed images': '作为一个小工具，Clipdrop 图片放大器可以改善压缩图像的质量',
            'Clipdrop denoises images by raising the resolution with minimal loss of sharpness and fidelity.': 'Clipdrop 通过最小化锐度和保真度损失，通过提高分辨率对图像进行降噪。',
            'Clipdrop Image upscaler makes images, especially photos and screenshots, sharper and more crisp and less pixelated. And it\'s super easy to use. Just drop your image and that\'s it!': 'Clipdrop 图片放大器使图像，尤其是照片和截图，更清晰，更鲜明，减少了像素感。而且使用非常简单，只需拖放您的图像，就完成了！',
            // 重新打光工具
            'Relight': '重新打光',
            'Relight your photos & drawings in seconds': '在几秒钟内对您的照片和图纸重新布光',
            'Portrait': '人像',
            'Elevate': '提升',
            'Remix': '混合',
            'Drawing': '绘画',
            'Elevate the quality of your selfies or portraits effortlessly. Transform ordinary photos into stunning, professionally-lit images.': '轻松提升自拍或人像的质量。将普通照片转变为令人惊艳的专业照明图像。',
            'Add a touch of brilliance to your photos during post-production.': '在后期制作中为您的照片增添一抹亮色。',
            ' Whether you\'re creating new masterpieces or revisiting classics, easily experiment with various lighting setups quickly.': '无论您是在创作新的杰作还是回顾经典，都可以轻松快速地尝试不同的灯光设置。',
            'Take your drawings to the next level with customized light setups. Give to your artwork a captivating touch.': '通过定制的灯光设置将您的绘画提升到新水平。为您的艺术作品赋予迷人的触感。',
            'Processing...': '处理中...',
            'Preset': '预设',
            'Ambient': '环境',
            'Light': '灯光',
            'Color': '颜色',
            'Power': '亮度',
            'Distance': '距离',
            'Radius': '半径',
            // 移除背景
            'Remove background': '移除背景',
            'Extract the main subject from a picture with incredible accuracy. It\'s like magic.': '以令人难以置信的精确度从图片中提取主要对象。就像魔法一样。',
            'Remove background online in 1 click': '一键在线移除背景',
            ' Or click on an example below': ' 或者点击下方的示例',
            'Cleanup imperfections': '清除瑕疵',
            'Reimagine': '重新构想',
            'Product photography': '产品摄影',
            'Portraits': '肖像',
            'Cars': '汽车',
            'Clothes': '服装',
            'Clipdrop design tools remove unwanted background  for product photography. With customized background, you can take your product photos to the next level.': 'Clipdrop 设计工具可移除产品摄影中不需要的背景。通过定制背景，您可以将产品照片提升到一个新水平。',
            'Clipdrop background removal is the best algorithm to clean portraits pictures': 'Clipdrop 背景移除是清理肖像照片的最佳算法',
            'Clipdrop online background remover performs extremely well on cars': 'Clipdrop 在线背景移除在汽车上表现非常出色',
            'The new Clipdrop picture background remover tool is more powerful, accurate, and easier to use. The improved algorithm can help you remove background fast, and it\'s optimized for clothing.': '全新的 Clipdrop 图片背景移除工具更加强大、准确且易于使用。改进的算法可以帮助您快速移除背景，而且针对服装进行了优化。',
            'With Clipdrop advanced computer vision algorithms, removing backgrounds of the most complex chair, bench, or any other furniture became easy!': '通过 Clipdrop 先进的计算机视觉算法，移除最复杂的椅子、长凳或其他家具的背景变得简单！',
            // 替换背景
            'Replace background': '替换背景',
            'Teleport anything, anywhere with AI': '利用人工智能将物体传送到任何场景中',
            'Back to edit': '返回编辑',
            'Or try with an example': '或者尝试使用示例',
            'Generate': '生成',
            'Cancel': '取消',
            'Use-cases': '使用案例',
            'Creative Agency': '创意代理公司',
            'Pack Shot ': '商品特写',
            'Selfie': '自拍',
            'Teleport your models anywhere, in one click. You don\'t need Photoshop to make impressive shoots anymore.': '一键将您的物体放置在任何地方。或许你可以丢掉 Photoshop 了。',
            'Create as many concepts as you want for your products or your clients.  Your only limit is your imagination.': '为您的产品或客户创建尽可能多的概念。唯一的限制就是您的想象力。',
            'You want an insane ad for your product ? Take a simple photo and teleport them in an amazing photoshoot studio, in a volcano or in a cosy living room.': '想为您的产品制作疯狂的广告吗？拍一张简单的照片，将其传送到一个令人惊叹的拍摄工作室、火山或舒适的客厅中。',
            'Transport yourself wherever you want for a joke or to impress your friends.': '想开玩笑或给朋友留下深刻印象？随时随地传送到您想要的地方。',
            // 重新构想 xl
            'Reimagine XL': '重新构想 XL',
            'Create multiple variants of an image with Stable Diffusion': '使用稳定扩散创建图像的多个变体',
            'Create multiple variations from a single image with Stable Diffusion.': '使用稳定扩散从单张图像创建多个变化。',
            'Click or drop a file here to start': '点击或拖放文件到这里开始',
            'Use cases': '使用案例',
            'Website Illustration': '网站插图',
            'Concept Art': '概念艺术',
            'Create a large number of variation for your customers.': '为您的客户创建大量变化。',
            'Choose the perfect image to match your website layout.': '选择完美的图像以匹配您的网站布局。',
            'Make Amazing concept alternative in one click.': '一键生成令人惊艳的概念替代方案。',
            'Original': '原始',
            'Sky replacer': '天空替换',
            'Sky Replacer': '天空替换',
            'Replace gray sky with blue sky in a snap': '在瞬间将灰色天空替换为蓝天',
            'Color grade': '颜色分级',
            'Trim': '裁剪',
            'Harmonize the entire atmosphere of your image by seamlessly blending the selected sky with your photo\'s color grading. ': '通过将所选天空与您照片的色彩分级无缝融合，协调整个图像的氛围。',
            'Precise trimming feature enables you to cut out intricate subjects, such as houses or trees, with incredible accuracy. ': '精准的裁剪功能使您能够以令人难以置信的精度剪裁复杂的主体，如房屋或树木。',
            'Transform cloudy days into radiant beauty, empowers you to replace cloudy skies with a clear and brilliant blue expanse.': '将阴天变为光彩照人之美，让您可以将多云的天空替换为清澈明亮的蔚蓝天空。',
            // 文生图 xl
            'Stable Diffusion XL': '文生图 XL',
            'Generate high-resolution realistic images with AI': '使用人工智能生成高分辨率逼真图像',
            ' SDXL 1.0: A Leap Forward in AI Image Generation': 'SDXL 1.0：AI图像生成的一大飞跃',
            'Style': '风格',
            'Aspect ratio': '宽高比',
            'Negative prompt': '负向提示',
            'Version': '版本',
            'No Style': '无风格',
            'Anime': '动漫',
            'Photographic': '摄影',
            'Digital Art': '数码艺术',
            'Comic Book': '漫画书',
            'Fantasy Art': '奇幻艺术',
            'Analog Film': '胶片',
            'Neon Punk': '霓虹庞克',
            'Isometric': '等轴测图',
            'Low Poly': '低面数',
            'Origami': '折纸',
            'Line Art': '线描',
            'Cinematic': '电影风格',
            '3D Model': '三维模型',
            'Pixel Art': '像素艺术',
            'Cinematic (21:9)': '影院级（21:9）',
            'Widescreen (16:9)': '宽屏（16:9）',
            'Landscape (3:2)': '横向（3:2）',
            'Photo (4:3)': '照片（4:3）',
            'Square (1:1)': '正方形（1:1）',
            'Portrait (4:5)': '肖像（4:5）',
            'Vertical (9:16)': '垂直（9:16）',
            // 涂鸦生成
            'Stable Doodle': '涂鸦生成',
            'Transform your doodles into real images in seconds': '在几秒钟内将您的涂鸦转化为真实图像',
            'No style': '没有风格',
            'Enter a prompt': '输入提示',
            'Animal': '动物',
            'Furniture': '家具',
            'Landscape': '风景',
            'Doodle': '涂鸦',
            'Photo': '照片',
            'Pixel art': '像素艺术',
            'Easily bring sketch to life by creating charming and character-filled creatures. Infuses them with personality, detail, and a touch of magic.': '通过创建迷人且充满特色的生物，轻松将素描变为生活。赋予它们个性、细节和一丝神奇。',
            'With just a rough sketch, unleash your creativity, adding elegance and functionality to your ideas and transforming them into tangible concepts.': '只需简略的草图，释放您的创意，为您的想法增添优雅和功能，将其转化为具体的概念。',
            'Transform your doodles into stunning landscape illustrations, regardless of your drawing skills, and witness vibrant scenes come to life with captivating details and colors.': '将您的涂鸦转化为令人惊艳的风景插图，无论您的绘画技能如何，您都可以见证充满迷人细节和色彩的生动场景。',
            'Try with this doodle': '尝试使用这个涂鸦',
            'Select the image you prefer for HD': '选择您喜欢的高清图像',
            'Invalid prompt': '无效提示 prompt',
            'Share results': '分享成果',
            'Back to grid': '返回网格视图',
            'Switch between pen and eraser': '切换画笔或橡皮擦',
            'Clear the canvas': '清空画布',
            'Our system marked the generated image as Not Safe For Work': '我们的系统将生成的图像标记为不适宜展示',
            // 文本移除
            'Text remover': '文本移除',
            'Remove text from any image': '从任何图像中删除文本',
            'Remove text': '删除文本',
            'Mockup': '样机模型',
            'Empty billboards to place the design of your client.': '空白广告牌，可放置客户的设计。',
            'Clean text on an object to create amazing concepts.': '清除物体上的文本，创造令人惊奇的概念。',
            'Remove the brand names of all the products you don\'t sell on your site.': '移除您网站上未销售的所有产品的品牌名称。',
            'Clean walls and signs to make your property more attractive.': '清理墙壁和标识，使您的房产更具吸引力。',
            // 取消裁剪
            'Uncrop': '取消裁剪',
            'Uncrop your photos to any image format': '扩展你的图像边缘',
            'Art': '艺术',
            'Texture': '纹理',
            'Easily generate and extend the body or backgrounds in your cherished photos, allowing you to breathe new life into your portraits.': '轻松生成并扩展您珍贵照片中的人物或背景，让您的肖像焕发新生。',
            'Whether you\'re a professional artist or a hobbyist, this tool will help you expand your artwork and bring your vision to life.': '无论您是专业艺术家还是业余爱好者，这个工具都将帮助您扩展您的艺术品，并将您的创意变为现实。',
            'Whether you\'re working with wood, fabric, metal, or any other texture, our app allows you to rescale and extend it effortlessly.': '无论您是在处理木材、布料、金属或任何其他材质，我们的应用程序都可以轻松地调整比例和扩展它。',
            'Expand the dimensions of your landscape photographs, giving them a panoramic effect and creating a more immersive viewing experience.': '扩展您风景照片的尺寸，赋予其全景效果，创造更具沉浸感的观看体验。',
            // 定价
            'Pricing': '定价',
            'Monthly': '每月',
            'Annual': '每年',
            'Everything you need to start creating great visuals': '您所需的一切，开始创作出色的视觉效果',
            'per month': '每月',
            'Current plan': '当前计划',
            'Skip Queue': '跳过队列',
            'High Resolution': '高分辨率',
            'Background Removal': '背景移除',
            'Image Upscaler x16': '图像放大器 x16',
            'Image Upscaler x2': '图像放大器 x2',
            'Text Remover': '文本移除',
            'Replace Background': '替换背景',
            'Increase conversion, by integrating the best technology in your platform.': '通过在您的平台集成最佳技术来提高转化率。',
            'Usage-based cost': '基于使用量的成本',
            'API pricing': 'API 定价',
            'API Documentation': 'API 文档',
            // 我的
            'My account': '我的账户',
            'Go to the gallery': '转到画廊',
            'Manage my account': '管理我的账户',
            'Logout': '注销',
            'New': '新的',
            'Gallery': '画廊',
            'Batch': '批量',
            'Watermark': '水印',
            'Help': '帮助',
            'No items': '没有项目',
            'Select All': '全选',
            'Import': '导入',
            'Click  here': '点击这里',
            ' or drag image files': '或拖拽图像文件',
            ' up to 10MB': '最大10MB',
            'Crop transparent pixels': '裁剪透明像素',
            'Output': '输出',
            'Set Background': '设置背景',
            'Set Size': '设置大小',
            'Add Text': '添加文字',
            'Add Images / logos': '添加图像/徽标',
            'Remove Objects': '移除物体',
            'Auto Tag': '自动标签',
            'Adjust Lights': '调整光线',
            'Export to Shopify': '导出到Shopify',
            'Export Spreadsheet': '导出表格',
            'We\'re adding more actions & integrations!': '我们正在添加更多操作和集成！',
            'Let us know what you need': '告诉我们您需要什么',
            'Background color': '背景色',
            'Size': '大小',
            'Original Size ': '原始大小 ',
            '(max 2048 x 2048)': '(最大 2048 x 2048)',
            'Custom Size': '自定义大小',
            'Width': '宽度',
            'Height': '高度',
            'Margin': '边距',
            'Depop': 'Depop',
            'Amazon': 'Amazon',
            'Ebay': 'Ebay',
            'Poshmark': 'Poshmark',
            'Etsy Thumbnail': 'Etsy 缩略图',
            'Etsy Item Listing': 'Etsy 商品列表',
            'Shopify Main': 'Shopify 主图',
            'Facebook Shared Image': 'Facebook 分享图片',
            'Twitter Post': 'Twitter 帖子',
            'Linkedin Shared Image': 'Linkedin 分享图片',
            'Instagram Post': 'Instagram 帖子',
            'Instagram Story': 'Instagram 故事',
            'Original: ': '原始：',
            'Output: ': '输出：',
            'Process ': '处理 ',
            ' files': '个文件',
            'Open Gallery': '打开画廊',
            'Start New': '新建',
            'Completed ': '已完成 ',
            ' files.': ' 个文件。',
            'Processing ': '处理中 ',
            'Stop': '停止',
            'Active': '激活',
            'Text': '文字',
            'Simple': '简单',
            'Center': '居中',
            'Cover': '覆盖',
            'Open Help Center': '打开帮助中心',
            'Contact Support': '联系支持',
            'Clipdrop': 'Clipdrop',
            'Home': '主页',
            'Blog': '博客',
            'Career': '职业',
            'Support': '支持',
            'Contact us': '联系我们',
            'Legal': '法律',
            'Privacy': '隐私',
            'Terms of Use': '使用条款',
            'Legal notice': '法律声明',
            'Use': '使用',
            'preferences': '偏好设置',
            'Social': '社交',
            'Join our slack community': '加入我们的slack社区',
        };
        const today = new Date();
        const formattedDateEn = today.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
        const formattedDateCn = today.toLocaleDateString('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'});

        // 数字循环
        for (let i = 0; i <= 255; i++) {
            translationMap[`${i} / 10 Images`] = `${i} / 10 图像`;
            translationMap[`${i} images left`] = `剩余 ${i} 张图像`;
            translationMap[`Light ${i}`] = `灯光 ${i}`;
            translationMap[`${formattedDateEn} (Deleted in ${i} days)`] = `${formattedDateCn} (${i} 天后删除)`;
        }

        return translationMap[text] || text;
    };

    const replaceTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = translateText(node.nodeValue);
        } else {
            for (const childNode of node.childNodes) {
                replaceTextNodes(childNode);
            }
        }
    };

    const applyTranslation = () => {
        const allNodes = document.querySelectorAll('*');
        allNodes.forEach(node => {
            replaceTextNodes(node);
        });
    };

    // 初始页面加载时应用翻译
    applyTranslation();

    // 监听DOM变化，有新的节点加载时再次应用翻译
    const observer = new MutationObserver(() => {
        applyTranslation();
    });

    // 配置观察选项
    const config = {childList: true, subtree: true};

    // 开始观察
    observer.observe(document.body, config);
})();
