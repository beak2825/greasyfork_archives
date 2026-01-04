// ==UserScript==
// @name         Book for Symfony 6 翻译 14-form.html
// @namespace    fireloong
// @version      0.0.9
// @description  使用表单接收反馈 14-form.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/14-form.html
// @match        https://symfony.com/doc/current/the-fast-track/en/14-form.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502280/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2014-formhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502280/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2014-formhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Accepting Feedback with Forms\n        \n            ': '使用表单接收反馈',
        'Time to let our attendees give feedback on conferences. They will contribute their comments through an HTML form.': '是时候让我们的参会者对会议进行反馈了。他们将通过 HTML 表单提出他们的意见。',
        'Generating a Form Type': '生成表单类型',
        'Use the Maker bundle to generate a form class:': '使用 Maker bundle 生成表单类：',
        'The App\\Form\\CommentType class defines a form for the App\\Entity\\Comment entity:': '<code translate="no" class="notranslate">App\\Form\\CommentType</code> 类为 <code translate="no" class="notranslate">App\\Entity\\Comment</code> 实体定义了一个表单：',
        'A form type describes the form fields bound to a model. It does the data conversion between submitted data and the model class properties. By default, Symfony uses metadata from the Comment entity - such as the Doctrine metadata - to guess configuration about each field. For example, the text field renders as a textarea because it uses a larger column in the database.': '<a href="https://symfony.com/doc/6.4/forms.html#form-types" class="reference external">表单类型</a>描述了绑定到模型的表单字段。它在提交的数据和模型类属性之间进行数据转换。默认情况下，Symfony 使用来自 <code translate="no" class="notranslate">Comment</code> 实体的元数据（如 Doctrine 元数据）来推测每个字段的配置。例如，<code translate="no" class="notranslate">text</code> 字段渲染为 <code translate="no" class="notranslate">textarea</code>，因为它在数据库中使用了更大的列。',
        'Displaying a Form': '显示表单',
        'To display the form to the user, create the form in the controller and pass it to the template:': '要向用户显示表单，请在控制器中创建表单并将其传递给模板：',
        'You should never instantiate the form type directly. Instead, use the createForm() method. This method is part of AbstractController and eases the creation of forms.': '您永远不应该直接实例化表单类型。相反，应该使用 <code translate="no" class="notranslate">createForm()</code> 方法。该方法是 <code translate="no" class="notranslate">AbstractController</code> 的一部分，可简化表单的创建。',
        'Displaying the form in the template can be done via the form Twig function:': '在模板中显示表单可以通过 Twig 函数 <code translate="no" class="notranslate">form</code> 来完成：',
        'When refreshing a conference page in the browser, note that each form field shows the right HTML widget (the data type is derived from the model):': '在浏览器中刷新会议页面时，请注意每个表单字段都显示正确的 HTML 小部件（数据类型从模型中派生）：',
        'The form() function generates the HTML form based on all the information defined in the Form type. It also adds enctype=multipart/form-data on the <form> tag as required by the file upload input field. Moreover, it takes care of displaying error messages when the submission has some errors. Everything can be customized by overriding the default templates, but we won\'t need it for this project.': '<code translate="no" class="notranslate">form()</code> 函数根据表单类型中定义的所有信息生成 HTML 表单。它还会在 <code translate="no" class="notranslate">&lt;form&gt;</code> 标签上添加 <code translate="no" class="notranslate">enctype=multipart/form-data</code>，这是文件上传输入字段所要求的。此外，当提交有误时，它还会负责显示错误消息。所有内容都可以通过覆盖默认模板来自定义，但本项目中我们不需要这样做。',
        'Customizing a Form Type': '自定义表单类型',
        'Even if form fields are configured based on their model counterpart, you can customize the default configuration in the form type class directly:': '即使表单字段是根据其模型对应项配置的，您也可以在表单类型类中直接自定义默认配置：',
        'Note that we have added a submit button (that allows us to keep using the simple {{ form(comment_form) }} expression in the template).': '请注意，我们已经添加了一个提交按钮（这允许我们在模板中继续使用简单的 <code translate="no" class="notranslate">{{ form(comment_form) }}</code> 表达式）。',
        'Some fields cannot be auto-configured, like the photoFilename one. The Comment entity only needs to save the photo filename, but the form has to deal with the file upload itself. To handle this case, we have added a field called photo as un-mapped field: it won\'t be mapped to any property on Comment. We will manage it manually to implement some specific logic (like storing the uploaded photo on disk).': '有些字段无法自动配置，如 <code translate="no" class="notranslate">photoFilename</code>。<code translate="no" class="notranslate">Comment</code> 实体只需要保存照片的文件名，但表单需要处理文件上传本身。为了处理这种情况，我们添加了一个名为 photo 的未 <code translate="no" class="notranslate">photo</code> as un-<code translate="no" class="notranslate">mapped</code> 字段：它不会映射到 <code translate="no" class="notranslate">Comment</code> 上的任何属性。我们将手动管理它以实现一些特定逻辑（如将上传的照片存储在磁盘上）。',
        'As an example of customization, we have also modified the default label for some fields.': '作为自定义的一个例子，我们还修改了某些字段的默认标签。',
        'Validating Models': '模型验证',
        'The Form Type configures the frontend rendering of the form (via some HTML5 validation). Here is the generated HTML form:': '表单类型配置了表单的前端渲染（通过一些 HTML5 验证）。以下是生成的 HTML 表单：',
        'The form uses the email input for the comment email and makes most of the fields required. Note that the form also contains a _token hidden field to protect the form from CSRF attacks.': '表单使用 <code translate="no" class="notranslate">email</code> 输入作为评论的电子邮件，并使大多数字段成为 <code translate="no" class="notranslate">required</code>。请注意，表单还包含一个 <code translate="no" class="notranslate">_token</code> 隐藏字段，以保护表单免受 <a href="https://owasp.org/www-community/attacks/csrf" class="reference external" rel="external noopener noreferrer" target="_blank">CSRF 攻击</a>。',
        'But if the form submission bypasses the HTML validation (by using an HTTP client that does not enforce these validation rules like cURL), invalid data can hit the server.': '但是，如果表单提交绕过了 HTML 验证（例如，使用不强制执行这些验证规则的 HTTP 客户端，如 cURL），则无效数据可能会到达服务器。',
        'We also need to add some validation constraints on the Comment data model:': '我们还需要在 <code translate="no" class="notranslate">Comment</code> 数据模型上添加一些验证约束：',
        'Handling a Form': '处理表单',
        'The code we have written so far is enough to display the form.': '到目前为止，我们所写的代码足以显示表单。',
        'We should now handle the form submission and the persistence of its information to the database in the controller:': '现在我们应该在控制器中处理表单提交并将其信息保存到数据库中：',
        'When the form is submitted, the Comment object is updated according to the submitted data.': '当表单提交时，<code translate="no" class="notranslate">Comment</code> 对象会根据提交的数据进行更新。',
        'The conference is forced to be the same as the one from the URL (we removed it from the form).': '会议被强制为与 URL 中的会议相同（我们已从表单中删除它）。',
        'If the form is not valid, we display the page, but the form will now contain submitted values and error messages so that they can be displayed back to the user.': '如果表单无效，我们将显示页面，但现在表单将包含提交的值和错误消息，以便可以将它们显示回给用户。',
        'Try the form. It should work well and the data should be stored in the database (check it in the admin backend). There is one problem though: photos. They do not work as we have not handled them yet in the controller.': '尝试使用表单。它应该能够正常工作，并且数据应该存储在数据库中（在管理员后台中检查）。但有一个问题：照片。它们不起作用，因为我们还没有在控制器中处理它们。',
        'Uploading Files': '上传文件',
        'Uploaded photos should be stored on the local disk, somewhere accessible by the frontend so that we can display them on the conference page. We will store them under the public/uploads/photos directory.': '上传的照片应存储在本地磁盘上，前端可以访问的地方，以便我们可以在会议页面上显示它们。我们将它们存储在 <code translate="no" class="notranslate">public/uploads/photos</code> 目录下。',
        'As we don\'t want to hardcode the directory path in the code, we need a way to store it globally in the configuration. The Symfony Container is able to store parameters in addition to services, which are scalars that help configure services:': '由于我们不希望在代码中硬编码目录路径，因此我们需要一种方法将其全局存储在配置中。Symfony 容器除了能够存储服务之外，还能够存储参数，这些参数是标量值，有助于配置服务：',
        'We have already seen how services are automatically injected into constructor arguments. For container parameters, we can explicitly inject them via the Autowire attribute.': '我们之前已经看到服务是如何自动注入到构造函数参数中的。对于容器参数，我们可以通过 <code translate="no" class="notranslate">Autowire</code> 属性显式地注入它们。',
        'Now, we have everything we need to know to implement the logic needed to store the uploaded file to its final destination:': '现在，我们已经具备了实现将上传的文件存储到最终目的地所需的逻辑所需的所有知识：',
        'To manage photo uploads, we create a random name for the file. Then, we move the uploaded file to its final location (the photo directory). Finally, we store the filename in the Comment object.': '为了管理照片上传，我们为文件创建一个随机名称。然后，我们将上传的文件移动到其最终位置（照片目录）。最后，我们将文件名存储在 Comment 对象中。',
        'Try to upload a PDF file instead of a photo. You should see the error messages in action. The design is quite ugly at the moment, but don\'t worry, everything will turn beautiful in a few steps when we will work on the design of the website. For the forms, we will change one line of configuration to style all form elements.': '尝试上传 PDF 文件而不是照片。您应该看到错误消息正在运行。目前的设计相当丑陋，但不用担心，当我们将处理网站的设计时，一切都会在几步之内变得美丽。对于表单，我们将更改一行配置来设置所有表单元素的样式。',
        'Debugging Forms': '调试表单',
        'When a form is submitted and something does not work quite well, use the "Form" panel of the Symfony Profiler. It gives you information about the form, all its options, the submitted data and how they are converted internally. If the form contains any errors, they will be listed as well.': '当表单提交并且某些内容无法正常工作时，请使用 Symfony Profiler 的“表单”面板。它提供了有关表单、其所有选项、提交的数据以及它们如何在内部转换的信息。如果表单包含任何错误，它们也将被列出。',
        'The typical form workflow goes like this:': '典型的表单工作流程如下：',
        'The form is displayed on a page;': '表单显示在页面上；',
        'The user submits the form via a POST request;': '用户通过 POST 请求提交表单；',
        'The server redirects the user to another page or the same page.': '服务器将用户重定向到另一个页面或同一页面。',
        'But how can you access the profiler for a successful submit request? Because the page is immediately redirected, we never see the web debug toolbar for the POST request. No problem: on the redirected page, hover over the left "200" green part. You should see the "302" redirection with a link to the profile (in parenthesis).': '但是，如何访问成功提交请求的探查器？由于页面会立即重定向，因此我们从未看到 POST 请求的 Web 调试工具栏。没问题：在重定向的页面上，将鼠标悬停在左侧的绿色“200”部分上。您应该能看到带有指向探查器链接的“302”重定向（在括号中）。',
        'Click on it to access the POST request profile, and go to the "Form" panel:': '单击它以访问 POST 请求探查器，并转到“表单”面板：',
        'Displaying Uploaded Photos in the Admin Backend': '在管理员后台显示上传的照片',
        'The admin backend is currently displaying the photo filename, but we want to see the actual photo:': '管理员后台当前正在显示照片的文件名，但我们希望看到实际的照片：',
        'Excluding Uploaded Photos from Git': '将上传的照片从 Git 中排除',
        'Don\'t commit yet! We don\'t want to store uploaded images in the Git repository. Add the /public/uploads directory to the .gitignore file:': '现在不要提交！我们不希望将上传的图像存储在 Git 存储库中。将 <code translate="no" class="notranslate">/public/uploads</code> 目录添加到 <code translate="no" class="notranslate">.gitignore</code> 文件中：',
        'Storing Uploaded Files on Production Servers': '在生产服务器上存储上传的文件',
        'The last step is to store the uploaded files on production servers. Why would we have to do something special? Because most modern cloud platforms use read-only containers for various reasons. Platform.sh is no exception.': '最后一步是在生产服务器上存储上传的文件。为什么我们必须做一些特别的事情？因为出于各种原因，大多数现代云平台都使用只读容器。Platform.sh 也不例外。',
        'Not everything is read-only in a Symfony project. We try hard to generate as much cache as possible when building the container (during the cache warmup phase), but Symfony still needs to be able to write somewhere for the user cache, the logs, the sessions if they are stored on the filesystem, and more.': '在 Symfony 项目中，并非所有内容都是只读的。我们在构建容器时（在缓存预热阶段）会尽力生成尽可能多的缓存，但 Symfony 仍然需要能够在某处写入用户缓存、日志、会话（如果它们存储在文件系统中）等内容。',
        'Have a look at .platform.app.yaml, there is already a writeable mount for the var/ directory. The var/ directory is the only directory where Symfony writes (caches, logs, ...).': '查看 <code translate="no" class="notranslate">.platform.app.yaml</code>，其中已经有一个 <code translate="no" class="notranslate">var/</code> 目录的可写挂载。<code translate="no" class="notranslate">var/</code> 目录是 Symfony 写入（缓存、日志等）的唯一目录。',
        'Let\'s create a new mount for uploaded photos:': '让我们为上传的照片创建一个新的挂载点：',
        'You can now deploy the code and photos will be stored in the public/uploads/ directory like our local version.': '现在，您可以部署代码，并且照片将像我们的本地版本一样存储在 <code translate="no" class="notranslate">public/uploads/</code> 目录中。',
        'Going Further': '深入探索',
        'SymfonyCasts Forms tutorial;': '<a href="https://symfonycasts.com/screencast/symfony-forms" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 表单教程</a>；',
        'How to customize Symfony Form rendering in HTML;': '如何<a href="https://symfony.com/doc/6.4/form/form_customization.html" class="reference external">在 HTML 中自定义 Symfony 表单渲染</a>；',
        'Validating Symfony Forms;': '<a href="https://symfony.com/doc/6.4/forms.html#validating-forms" class="reference external">验证 Symfony 表单</a>；',
        'The Symfony Form Types reference;': '<a href="https://symfony.com/doc/6.4/reference/forms/types.html" class="reference external">Symfony 表单类型参考</a>；',
        'The FlysystemBundle docs, which provides integration with multiple cloud storage providers, such as AWS S3, Azure and Google Cloud Storage;': '<a href="https://github.com/thephpleague/flysystem-bundle/blob/master/docs/1-getting-started.md" class="reference external" rel="external noopener noreferrer" target="_blank">FlysystemBundle 文档</a>，它提供了与多个云存储提供商（如 AWS S3、Azure 和 Google Cloud Storage）的集成；',
        'The Symfony Configuration Parameters.': '<a href="https://symfony.com/doc/6.4/configuration.html#configuration-parameters" class="reference external">Symfony 配置参数</a>。',
        'The Symfony Validation Constraints;': '<a href="https://symfony.com/doc/6.4/validation.html#basic-constraints" class="reference external">Symfony 验证约束</a>；',
        'The Symfony Form Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony2/how_symfony2_forms_works_en.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 表单速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Managing the Lifecycle of Doctrine Objects': '管理 Doctrine 对象的生命周期',
        'Securing the Admin Backend': '保护管理后台的安全'
    };

    fanyi(translates, 2);
})($);
