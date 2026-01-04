// ==UserScript==
// @name         playgroundai汉化
// @namespace   Violentmonkey Scripts
// @match       https://*.playgroundai.com/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description 汉化界面的部分菜单及内容
// @author       sec
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/460662/playgroundai%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460662/playgroundai%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==




(function() {
    'use strict';

    const i18n = new Map([

['Filter', '过滤器'],
['Experiment with different styles that can be applied to your image.', '尝试可应用于图像的不同样式。'],
['Prompt', '提示'],
['What do you want to see? You can use a single word or a full sentence.', '你想看什么？您可以使用单个单词或完整句子。'],
['Tiny underwater complete world in large glass bowl, water, omnilight, Sharp, detailed and intricate environment', '大玻璃碗中的微小水下完整世界，水，全光，尖锐，详细和复杂的环境'],
['Remove From Image', '从图像中删除'],
['IMPORT IMAGE', '导入图像辑'],
['TO EDIT', '进行编辑'],
      ['Model', '模型'],
['Different AI models can produce different or better results so feel free to experiment.', '不同的人工智能模型可以产生不同的或更好的结果，所以请自由试验。'],
['Stable Diffusion 1.5', '稳定的扩散1.5'],
['Image Dimensions', '图像尺寸'],
['Width × Height of the finished image.', '完成的图像的宽度×高度。'],
['Buy a Pro plan for any width or height up to 1536px', '购买专业计划可获得任何宽度或高度，最高可达1536px。'],
['Higher values will make your image closer to your prompt.', '更高的数值会使你的图像更接近你的提示。'],
      ['Image to Image', '图像到图像'],
['Upload or draw an image to use as inspiration.', '上传或绘制一张图片作为灵感来源。'],
['Generate', '生成'],
['Quality & Details', '质量和细节'],
['More steps will result in a high quality image but will take longer.', '更多的步骤将产生一个高质量的图像，但需要更长的时间。'],
['Seed', '种子'],
['Different numbers result in new variations of your image.', '不同的数字会产生你的图像的新变化。'],
['Randomize each number to get new variations', '随机化每个数字以获得新的变化'],
['Show Advanced Options', '显示高级选项'],
['Number of Images', '图像的数量'],
['Select the number of images you would like to generate.', '选择你想要生成的图像数量。'],
['Private Session', '私人会话'],
['Images will only be visible to you until you\'re ready to share them. Buy a ', '图片只对你可见，直到你准备好分享它们。购买一个 '],
['Pro plan', '专业计划'],
['to persist this setting across sessions.', '以在不同的时段坚持这一设置。'],
      ['Columns', '专栏'],
['Search', '搜索'],
['Colorpop', '彩宝'],
['Instaport', '淘宝网'],
['Playtoon', '玩偶'],
['Polymode', '多样性'],
['Woolitize', '羊毛衫'],
['App Icons', '应用图标'],
['Retro Anime', '复古动漫'],
['Retro Futurism', '复古未来主义'],
['Origami', '折纸'],
['Analog Diffusion', '模拟扩散'],
['Playdoh', '橡皮泥'],
['Polaroid', '宝丽来'],
['Dream Haven', '梦想天堂'],
['Perfume', '香水'],
['Pixel', '像素'],
['Foodmade', '食物制作'],
['Oil Painting', '油画'],
['Geometrieva style', '几何风格'],
['Delicate detail', '精致的细节'],
['Radiant symmetry', '辐射状的对称性'],
['Lush illumination', '丰富的光照'],
['Saturated Space', '饱和的空间'],
['Neon Mecha', '霓虹灯机甲'],
['Ethereal Low poly', '空灵的低聚物'],
['Warm box', '暖箱'],
['Cinematic', '电影式的'],
['Cinematic (warm)', '电影（温暖）'],
['Wasteland', '荒地'],
['Flat palette', '平坦的调色板'],
['Ominous escape', '不祥的逃亡'],
['Spielberg', '斯皮尔伯格'],
['Royalistic', '皇室主义'],
['Masterpiece', '杰作'],
['Wall Art', '墙面艺术'],
['Haze', '雾霾'],
['Black and white', '黑白'],
['Show Advanced Options', '显示高级选项'],
['Think of a simple instruction to change the image like \"Make the dog a cat\"', '想到一个简单的指令来改变图像，如："让狗变成猫"。'],
['Make it look like a painting', 'Make it look like a painting'],
['Cancel', '取消'],
['Save Changes', '保存更改'],
['Edit Instruction Strength', '编辑指令的强度'],
['Higher values will make your edited image closer to your instruction.', '更高的值会使你编辑的图像更接近你的指令。'],
['Try adding, removing, or thinking of styles you could use to modify the image. Examples: Turn the cat into a dog, Change the flowers to red, Make it more like van gogh', '尝试添加、删除或思考你可以用来修改图像的样式。例如。把猫变成狗，把花改成红色，让它更像凡高。'],

['Images will only be visible to you until you', '图片将只对你可见，直到你'],
['ready to share them. Buy a', '准备分享它们。购买'],
['Higher values will make your edited image ', '更高的数值会使你编辑的图像 '],
['closer to your instruction.', '更接近你的指令。'],
['Learn how to edit', '学习如何编辑'],
['Edit Instruction', '编辑指示'],
['Describe how you want to change the image.', '描述你想如何改变图像。'],
['Describe details you don', '描述你不想要的细节'],
['want in your image like color', '，如颜色'],
['objects, or a scenery.', '物体，或风景。'],
['What do you want to see', '你想看什么'],
['You can use a single word or a full sentence.', '你可以用一个词或一个完整的句子。'],
      ['ready to share them', '准备分享它们'],
['Guidance', '指导意见'],
['Higher values will make your ', '较高的数值会使你的 '],
['image closer to your', '图片更接近于你的提示'],
['your prompt', '你的提示'],
['Buy a', '购买 '],
['for any width or height up to 1536px', '可以不限制宽度或高度，最大为1536px'],
['Feedback', '反馈信息'],
['Profile', '栏目简介'],
['Settings', '设置'],
['Join Discord', '加入讨论区'],
['Notifications', '通知'],
['Pricing', '定价'],
['Request Help', '请求帮助'],
['Twitter', '推特'],
['FAQ', '常见问题'],
['Jobs', '工作机会'],
['Privacy Policy', '隐私政策'],
['Terms of Service', '服务条款'],
['Log out', '登出'],
['Account', '帐户'],
['Preferences', '首选项'],
['Display Name', '显示名称'],
['Delete Account', '删除账户'],
['Delete account and remove all images', '删除账户并删除所有图片'],
['Create like a Pro', '像专家一样创作'],
['Free for everyone', '对所有人免费'],
['Use images commercially', '将图片用于商业用途'],
['Fixed image dimensions', '固定的图像尺寸'],
['Limits on quality and details after 50 images', '50张图片后，质量和细节受到限制'],
['Cannot generate images with DALL-E', '不能用DALL-E生成图像'],
['Create', '创建'],
['No waiting', '无需等待'],
['No limits on image dimensions up to 1M pixels', '对图像尺寸没有限制，最高可达1M像素'],
['Faster image generation', '更快的图像生成'],
['Priority customer support', '优先客户支持'],
['Permanent Private mode', '永久隐私模式'],
['Purchase', '购买'],
['No watermark', '无水印'],
['Includes all the features of free but not Pro', '包括免费的所有功能，但不是专业的'],



         ['Updated', '更新于'],


      ['Forks', '复刻'],

    ])

    replaceText(document.body)
//   |

    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();