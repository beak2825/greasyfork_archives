// ==UserScript==
// @name         ComfyUI 字符替代汉化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  COMFYUI 不完全汉化
// @author       xxin
// @match        http://127.0.0.1:8188
// @icon         
// @grant        none
// @license MIT
//代码参考：https://greasyfork.org/zh-CN/scripts/456875-%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E6%B1%89%E5%8C%96/code

// @downloadURL https://update.greasyfork.org/scripts/465079/ComfyUI%20%E5%AD%97%E7%AC%A6%E6%9B%BF%E4%BB%A3%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/465079/ComfyUI%20%E5%AD%97%E7%AC%A6%E6%9B%BF%E4%BB%A3%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([
//1.菜单
['Queue Prompt', '添加至队列'],
['Clear Queue', '清除队列'],
['Load Default', '加载默认值'],

['Queue size:', '排队任务数:'],
['Extra options', '额外选项'],
['Batch count', '批次计数'],
['Queue Front', '队列前端'],
['View Queue', '查看队列'],
['View History', '历史记录'],
['See Queue', '查看队列'],

['See History', '看历史记录'],

['Clear History', '清除历史'],

['automatically queue prompt when the queue size hits 0', '当队列数达到0时自动进行队列提示'],

//1.1设置菜单

['Require confirmation when clearing workflow', '清除工作流时需要确认'],
['Prompt for filename when saving workflow', '保存工作流时提示输入文件名'],
['menu position', '菜单位置'],
['Color Palette', '调色板'],

['Invert Menu Scrolling', '反转菜单滚动'],
['number of nodes suggestions', '节点数建议'],
['Grid Size', '网格大小'],


//2节点菜单

['Add Node', '添加节点'],

['Load Checkpoint', 'Checkpoint加载器'],
['Load VAE', 'VAE加载器'],
['Load LoRA', 'LoRA加载器'],
['Load CLIP', 'CLIP加载器'],
['Load ControlNet Model', 'ControlNet加载器'],
['Load ControlNet Model (diff)', '另一种ControlNet加载器'],
['Load Style Model', '风格模型加载器'],
['Load CLIP Vision', 'CLIP视觉加载器'],
['unCLIPCheckpointLoader', '逆CLIPCheckpoint加载器'],
['GLIGENLoader', 'GLIGEN加载器'],
['HypernetworkLoader', 'Hypernetwork超网络加载器'],
['Load Upscale Model', '放大模型加载器'],
['style_model', '风格模型'],
['Apply Style Model', '风格模型应用'],
['gligen', 'GLIGEN基于语言的图像生成'],
['GLIGENTextBoxApply', 'GLIGEN文本框应用'],
['CLIP Text Encode (Prompt)', 'CLIP文本编码器'],
['CLIP Set Last Layer', 'CLIP设置最后一层'],
['Conditioning (Combine)', '条件合并'],
['Conditioning (Set Area)', '条件区域'],
['CLIP Vision Encode', 'CLIP视觉编码'],
['unCLIPConditioning', '逆CLIP条件'],
['Apply ControlNet', 'ControlNet应用'],

['VAE Encode (for Inpainting)', 'VAE内补编码器'],
['Set Latent Noise Mask', '设置Latent噪波遮罩'],

['Rotate Latent', 'Latent旋转'],
['Flip Latent', 'Latent翻转'],
['Crop Latent', 'Latent修剪'],
['VAE Decode', 'VAE解码'],
['VAE Encode', 'VAE编码'],
['Empty Latent Image', '空Latent图像'],
['Upscale Latent', 'Latent放大'],
['LatentFromBatch', '从队列获取Latent'],
['Latent Composite', 'Latent复合'],
['LatentCompositeMasked', 'Latent遮罩复合'],

['Upscale Image', '图像缩放'],
['Upscale Image (using Model)', '图像通过模型放大'],
['postprocessing', '后处理'],
['ImageBlend', '图像混合'],
['ImageBlur', '图像模糊'],
['ImageQuantize', '图像量化'],
['ImageSharpen', '图像锐化'],
['Save Image', '保存图像'],
['Preview Image', '预览图像'],
['Load Image', '加载图像'],
['Invert Image', '反转图像'],
['Pad Image for Outpainting', '外部绘画填充面板'],
['Load Image (as Mask)', '加载图像遮罩'],
['Convert Mask to Image', '遮罩转图像'],
['Convert Image to Mask', '图像转遮罩'],
['SolidMask', '纯块遮罩'],
['InvertMask', '反转遮罩'],
['CropMask', '遮罩裁剪'],
['MaskComposite', '遮罩混合'],
['FeatherMask', '遮罩羽化'],
['VAE Decode (Tiled)', 'VAE平铺化解码'],
['VAE Encode (Tiled)', 'VAE平铺化编码'],
['TomePatchModel', 'Token合并修补模型'],
['Load Checkpoint (With Config)', 'Checkpoint加载器'],
['DiffusersLoader', 'Diffusers(扩散)载入器'],

['Copy (Clipspace)', '复制（剪辑空间）'],
['Convert seed to input', '将seed转换为输入'],
['Convert control_after_generate to input', '将control_after_generate转换为输入'],
['Convert steps to input', '将steps转换为输入'],
['Convert cfg to input', '将cfg转换为输入'],
['Convert sampler_name to input', '将sampler_name转换为输入'],
['Convert scheduler to input', '将scheduler转换为输入'],
['将denoise转换为输入', ''],

['Node name for S&R', 'S&R的节点名称'],

['On Event', '事件运行'],
['Never', '忽略'],
['On Trigger', '触发器运行'],

//1111111
        ['Save', '保存'],
        ['Close', '关闭'],
        ['History', '历史记录'],
        ['Load', '加载'],
        ['Delete', '删除'],
        ['Refresh', '恢复'],
        ['Clear', '清除'],
['Running', '进行中'],
['Pending', '等待中'],
['Cancel', '取消'],
['Dark', '深色'],
['Light', '明亮'],
['Solarized', '过度曝光'],
['Export', '导出'],
['Import', '导入'],
['Template', '模板'],
['precision', '精度'],
        ['Default', '默认'],

['sampling', '采样'],
['KSampler', 'K采样器'],
['Advanced', '高级'],

['conditioning', '条件'],
['latent', '潜空间'],
['image', '图像'],
['mask', '遮罩'],
['_for_testing', '测试'],
['advanced', '高级'],
['utils', '公共'],
        ['inpaint', '内补绘制'],
        ['upscaling', '缩放'],
['transform', '变换'],
        ['Group', '组'],
        ['up', '上'],
['down', '下'],
['Note', '注释'],
['Reroute', '转接节点'],
['Primitive', '原始'],
['MODEL', '模型'],
['model', '模型'],
['loaders', '加载器'],
['Properties', '特性'],
['Inputs', '输入'],
['Outputs', '输出'],
['Title', '名称'],
['Mode', '模式'],
['Resize', '调整大小'],
['Collapse', '折叠'],
['Pin', '钉住'],
['Colors', '颜色'],
['Color', '颜色'],
['Shapes', '倒角形状'],
['default', '默认'],
['box', '方'],
['round', '圆'],
['card', '卡片'],
['Always', '一直'],
['Clone', '复制'],
['Remove', '删除'],
['Font', '字符'],
['Add', '添加'],
['Edit', '编辑'],
['size', '大小'],





            ])

    replaceText(document.body)
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