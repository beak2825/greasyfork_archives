// ==UserScript==
// @name         Book for Symfony 6 翻译 16-spam.html
// @namespace    fireloong
// @version      0.0.8
// @description  使用 API 防止垃圾邮件 16-spam.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/16-spam.html
// @match        https://symfony.com/doc/current/the-fast-track/en/16-spam.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502283/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2016-spamhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502283/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2016-spamhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Preventing Spam with an API\n        \n            ': '使用 API 防止垃圾邮件',
        'Anyone can submit a feedback. Even robots, spammers, and more. We could add some "captcha" to the form to somehow be protected from robots, or we can use some third-party APIs.': '任何人都可以提交反馈。甚至机器人、垃圾邮件发送者等等。我们可以在表单中添加一些“验证码”来在某种程度上免受机器人的攻击，或者我们可以使用一些第三方 API。',
        'I have decided to use the free Akismet service to demonstrate how to call an API and how to make the call "out of band".': '我决定使用免费的  <a href="https://akismet.com" class="reference external" rel="external noopener noreferrer" target="_blank">Akismet</a> 服务来演示如何调用 API 以及如何进行“带外”调用。',
        'Signing up on Akismet': '在 Akismet 上注册',
        'Sign-up for a free account on akismet.com and get the Akismet API key.': '在 <a href="https://akismet.com" class="reference external" rel="external noopener noreferrer" target="_blank">akismet.com</a> 上注册一个免费帐户并获取 Akismet API 密钥。',
        'Depending on Symfony HTTPClient Component': '取决于 Symfony HTTPClient 组件',
        'Instead of using a library that abstracts the Akismet API, we will do all the API calls directly. Doing the HTTP calls ourselves is more efficient (and allows us to benefit from all the Symfony debugging tools like the integration with the Symfony Profiler).': '我们不会使用抽象 Akismet API 的库，而是直接进行所有 API 调用。自己进行 HTTP 调用效率更高（并且使我们能够利用 Symfony 调试工具的所有优势，例如与 Symfony Profiler 的集成）。',
        'Designing a Spam Checker Class': '设计一个垃圾邮件检查器类',
        'Create a new class under src/ named SpamChecker to wrap the logic of calling the Akismet API and interpreting its responses:': '在 <code translate="no" class="notranslate">src/</code> 下创建一个名为 <code translate="no" class="notranslate">SpamChecker</code> 的新类，以封装调用 Akismet API 和解释其响应的逻辑：',
        'The HTTP client request() method submits a POST request to the Akismet URL ($this->endpoint) and passes an array of parameters.': 'HTTPClient 的 <code translate="no" class="notranslate">request()</code> 方法向 Akismet URL（<code translate="no" class="notranslate">$this-&gt;endpoint</code>）提交一个 POST 请求，并传递一个参数数组。',
        'The getSpamScore() method returns 3 values depending on the API call response:': '<code translate="no" class="notranslate">getSpamScore()</code> 方法根据 API 调用响应返回3个值：',
        '2: if the comment is a "blatant spam";': '<code translate="no" class="notranslate">2</code>：如果评论是“明显的垃圾信息”；',
        '1: if the comment might be spam;': '<code translate="no" class="notranslate">1</code>：如果评论可能是垃圾信息；',
        '0: if the comment is not spam (ham).': '<code translate="no" class="notranslate">0</code>：如果评论不是垃圾信息（正常内容）。',
        'Use the special akismet-guaranteed-spam@example.com email address to force the result of the call to be spam.': '使用特殊的 <code translate="no" class="notranslate">akismet-guaranteed-spam@example.com</code> 电子邮件地址来强制调用结果为垃圾邮件。',
        'Using Environment Variables': '使用环境变量',
        'The SpamChecker class relies on an $akismetKey argument. Like for the upload directory, we can inject it via an Autowire annotation:': '<code translate="no" class="notranslate">SpamChecker</code> 类依赖于 <code translate="no" class="notranslate">$akismetKey</code> 参数。就像上传目录一样，我们可以通过 <code translate="no" class="notranslate">Autowire</code> 注解来注入它：',
        'We certainly don\'t want to hard-code the value of the Akismet key in the code, so we are using an environment variable instead (AKISMET_KEY).': '我们当然不想在代码中硬编码 Akismet 密钥的值，所以我们使用环境变量（<code translate="no" class="notranslate">AKISMET_KEY</code>）来代替。',
        'It is then up to each developer to set a "real" environment variable or to store the value in a .env.local file:': '然后，每个开发人员都需要设置一个“真实”的环境变量，或者将值存储在 <code translate="no" class="notranslate">.env.local</code> 文件中：',
        'For production, a "real" environment variable should be defined.': '对于生产环境，应定义一个“真实”的环境变量。',
        'That works well, but managing many environment variables might become cumbersome. In such a case, Symfony has a "better" alternative when it comes to storing secrets.': '这很好，但管理许多环境变量可能会变得繁琐。在这种情况下，当涉及到存储机密时，Symfony 有一个“更好”的替代方案。',
        'Storing Secrets': '存储机密信息',
        'Instead of using many environment variables, Symfony can manage a vault where you can store many secrets. One key feature is the ability to commit the vault to the repository (but without the key to open it). Another great feature is that it can manage one vault per environment.': '与使用多个环境变量相比，Symfony 可以管理一个可以存储许多机密的保险库。一个关键功能是能够将保险库提交到存储库（但没有打开它的密钥）。另一个很好的功能是它可以为每个环境管理一个保险库。',
        'Secrets are environment variables in disguise.': '机密信息是伪装成环境变量的信息。',
        'Add the Akismet key in the vault:': '在保险库中添加 Akismet 密钥：',
        'Because this is the first time we have run this command, it generated two keys into the config/secret/dev/ directory. It then stored the AKISMET_KEY secret in that same directory.': '因为这是我们第一次运行此命令，所以它在 <code translate="no" class="notranslate">config/secret/dev/</code> 目录中生成了两个密钥。然后，它将 <code translate="no" class="notranslate">AKISMET_KEY</code> 机密存储在同一目录中。',
        'For development secrets, you can decide to commit the vault and the keys that have been generated in the config/secret/dev/ directory.': '对于开发机密，您可以决定提交保险库和 <code translate="no" class="notranslate">config/secret/dev/</code> 目录中生成的密钥。',
        'Secrets can also be overridden by setting an environment variable of the same name.': '通过设置同名的环境变量，也可以覆盖机密信息。',
        'Checking Comments for Spam': '检查评论中的垃圾信息',
        'One simple way to check for spam when a new comment is submitted is to call the spam checker before storing the data into the database:': '当提交新评论时检查垃圾信息的一种简单方法是在将数据存储到数据库之前调用垃圾信息检查器：',
        'Check that it works fine.': '检查它是否正常工作。',
        'Managing Secrets in Production': '在生产环境中管理机密信息',
        'For production, Platform.sh supports setting sensitive environment variables:': '对于生产环境，Platform.sh 支持设置敏感环境变量：',
        'But as discussed above, using Symfony secrets might be better. Not in terms of security, but in terms of secret management for the project\'s team. All secrets are stored in the repository and the only environment variable you need to manage for production is the decryption key. That makes it possible for anyone in the team to add production secrets even if they don\'t have access to production servers. The setup is a bit more involved though.': '但是，如上所述，使用Symfony机密信息可能更好。不是从安全性的角度来看，而是从项目团队对机密信息的管理角度来看。所有机密信息都存储在存储库中，您需要为生产环境管理的唯一环境变量是解密密钥。这使得团队中的任何人即使无法访问生产服务器，也能够添加生产机密信息。不过，设置起来稍微复杂一些。',
        'First, generate a pair of keys for production use:': '首先，为生产环境生成一对密钥：',
        'On Linux and similiar OSes, use APP_RUNTIME_ENV=prod instead of --env=prod as this avoids compiling the application for the prod environment:': '在 Linux 和类似的操作系统上，请使用 <code translate="no" class="notranslate">APP_RUNTIME_ENV=prod</code> 而不是 <code translate="no" class="notranslate">--env=prod</code>，因为这可以避免为 <code translate="no" class="notranslate">prod</code> 环境编译应用程序：',
        'Re-add the Akismet secret in the production vault but with its production value:': '在生产保险库中重新添加 Akismet 机密信息，但使用其生产值：',
        'The last step is to send the decryption key to Platform.sh by setting a sensitive variable:': '最后一步是通过设置敏感变量将解密密钥发送到 Platform.sh：',
        'You can add and commit all files; the decryption key has been added in .gitignore automatically, so it will never be committed. For more safety, you can remove it from your local machine as it has been deployed now:': '您可以添加并提交所有文件；解密密钥已自动添加到 <code translate="no" class="notranslate">.gitignore</code> 中，因此它永远不会提交。为了更安全，您可以在现在已部署的情况下从本地计算机中删除它：',
        'Going Further': '深入探索',
        'The HttpClient component docs;': '<a href="https://symfony.com/doc/6.4/components/http_client.html" class="reference external">HttpClient 组件文档</a>；',
        'The Environment Variable Processors;': '<a href="https://symfony.com/doc/6.4/configuration/env_var_processors.html" class="reference external">环境变量处理器</a>；',
        'The Symfony HttpClient Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony4/httpclient_en_43.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony HttpClient 速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Securing the Admin Backend': '保护管理后台的安全',
        'Testing': '测试'
    };

    fanyi(translates, 2);
})($);
