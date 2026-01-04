// ==UserScript==
// @name         Book for Symfony 6 翻译 23-imagine.html
// @namespace    fireloong
// @version      0.1.0
// @description  调整图像大小 23-imagine.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/23-imagine.html
// @match        https://symfony.com/doc/current/the-fast-track/en/23-imagine.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502503/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2023-imaginehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502503/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2023-imaginehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Resizing Images\n        \n            ': '调整图像大小',
        'On the conference page design, photos are constrained to a maximum size of 200 by 150 pixels. What about optimizing the images and reducing their size if the uploaded original is larger than the limits?': '在会议页面设计上，照片的大小被限制在最大 200x150 像素。如果上传的原始图片大于这个限制，应该如何优化图片并减小其大小？',
        'That is a perfect job that can be added to the comment workflow, probably just after the comment is validated and just before it is published.': '这是一个完美的工作，可以添加到评论工作流中，可能就在验证评论之后，发布之前。',
        'Let\'s add a new ready state and an optimize transition:': '让我们添加一个新的 <code translate="no" class="notranslate">ready</code> 状态和一个 <code translate="no" class="notranslate">optimize</code> 转换：',
        'Generate a visual representation of the new workflow configuration to validate that it describes what we want:': '生成新工作流配置的视觉表示，以验证它是否描述了我们的需求：',
        'Optimizing Images with Imagine': '使用 Imagine 优化图像',
        'Image optimizations will be done thanks to GD (check that your local PHP installation has the GD extension enabled) and Imagine:': '图像优化将通过 <a href="https://libgd.github.io/" class="reference external" rel="external noopener noreferrer" target="_blank">GD</a>（请检查您的本地 PHP 安装是否启用了 GD 扩展）和 <a href="https://github.com/avalanche123/Imagine" class="reference external" rel="external noopener noreferrer" target="_blank">Imagine</a> 来完成：',
        'Resizing an image can be done via the following service class:': '可以通过以下服务类调整图像大小：',
        'After optimizing the photo, we store the new file in place of the original one. You might want to keep the original image around though.': '优化照片后，我们将新文件存储在原文件的位置。不过，您可能想保留原始图像。',
        'Adding a new Step in the Workflow': '在工作流中添加新步骤',
        'Modify the workflow to handle the new state:': '修改工作流以处理新状态：',
        'Note that $photoDir is automatically injected as we defined a container parameter on this variable name in a previous step:': '请注意，由于我们在前一步骤中为此变量名定义了一个容器参数，因此会自动注入 <code translate="no" class="notranslate">$photoDir</code>：',
        'Storing Uploaded Data in Production': '在生产环境中存储上传的数据',
        'We have already defined a special read-write directory for uploaded files in .platform.app.yaml. But the mount is local. If we want the web container and the message consumer worker to be able to access the same mount, we need to create a file service:': '我们已经在 <code translate="no" class="notranslate">.platform.app.yaml</code> 中为上传的文件定义了一个特殊的读写目录。但是挂载是本地的。如果我们希望 Web 容器和消息消费者工作程序能够访问相同的挂载点，我们需要创建一个文件服务：',
        'Use it for the photos upload directory:': '将其用于照片上传目录：',
        'This should be enough to make the feature work in production.': '这应该足以让该功能在生产环境中工作。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Styling the User Interface with Webpack': '使用 Webpack 样式化用户界面',
        'Running Crons': '运行 Cron 任务（或 Cron 作业）'
    };

    fanyi(translates, 2);
})($);
