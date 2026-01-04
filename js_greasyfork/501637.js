// ==UserScript==
// @name         Book for Symfony 6 翻译 2-project.html
// @namespace    fireloong
// @version      0.0.9
// @description  项目介绍 2-project.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/2-project.html
// @match        https://symfony.com/doc/current/the-fast-track/en/2-project.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501637/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%202-projecthtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501637/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%202-projecthtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Introducing the Project\n        \n            ': '项目介绍',
        "We need to find a project to work on. It is quite a challenge as we need to find a project large enough to cover Symfony thoroughly, but at the same time, it should be small enough; I don't want you to get bored implementing similar features more than once.": '我们需要找一个项目来实践。这确实是一个挑战，因为我们需要找一个足够大的项目来全面覆盖 Symfony，但与此同时，项目也应该足够小；我不想让你们因为多次实现类似的功能而感到无聊。',
        'Revealing the Project': '揭示项目',
        "It might be nice if the project was somehow related to Symfony and its community. As we organize quite a few online and in-person conferences every year, what about a guestbook? A livre d'or as we say in French. I like the old-fashioned and outdated feeling of developing a guestbook in the 21st century!": '如果项目在某种程度上与 Symfony 及其社区有关，那就太好了。由于我们每年组织相当多的线上和线下会议，那么做一个留言簿怎么样？就像我们用法语说的“livre d\'or”（金书）。我喜欢在 21 世纪开发留言簿这种过时又老派的感觉！',
        'We have it. The project is all about getting feedback on conferences: a list of conferences on the homepage, a page for each conference, full of nice comments. A comment is composed of some small text and an optional photo taken during the conference. I suppose I have just written down all the specifications we need to get started.': '我们有了。这个项目是关于获取会议反馈的：首页列出会议，每个会议一个页面，上面全是好评。评论由一些简短的文字和会议期间拍摄的可选照片组成。我想我已经写下了我们开始所需的所有规格。',
        'The project will contain several applications. A traditional web application with an HTML frontend, an API, and an SPA for mobile phones. How does that sound?': '这个项目将包含几个应用程序。一个带有 HTML 前端的传统 Web 应用程序，一个 API，以及一个用于手机的单页应用程序（SPA）。听起来怎么样？',
        'Learning is Doing': '学习就是实践',
        'Learning is doing. Period. Reading a book about Symfony is nice. Coding an application on your personal computer while reading a book about Symfony is even better. This book is very special as everything has been done to let you follow along, code, and be sure to get the same results as I had locally on my machine when I coded it initially.': '学习就是实践。阅读一本关于 Symfony 的书很好。在阅读一本关于 Symfony 的书的同时，在个人电脑上编写一个应用程序更好。这本书非常特别，因为已经做了一切努力，让你能够跟随、编写代码，并确保获得与我在最初编写代码时在我的机器上获得相同的结果。',
        "The book contains all the code you need to write and all the commands you need to execute to get the final result. No code is missing. All commands are written down. This is possible because modern Symfony applications have very little boilerplate code. Most of the code we will write together is about the project's business logic. Everything else is mostly automated or generated automatically for us.": '这本书包含了你需要编写的所有代码和需要执行的所有命令，以获得最终结果。没有遗漏任何代码。所有命令都已写下。这是可能的，因为现代 Symfony 应用程序几乎没有样板代码。我们将一起编写的大部分代码都是关于项目的业务逻辑。其它所有内容大多为我们自动完成或自动生成。',
        'Looking at the Final Infrastructure Diagram': '查看最终基础架构图',
        'Even if the project idea seems simple, we are not going to build an "Hello World"-like project. We won\'t only use PHP and a database.': '即使项目想法似乎很简单，我们也不会构建一个像“Hello World”这样的项目。我们不会只使用 PHP 和数据库。',
        'The goal is to create a project with some of the complexities you might find in real-life. Want a proof? Have a look at the final infrastructure of the project:': '我们的目标是创建一个具有一些您可能在现实生活中遇到的复杂性的项目。想要证据吗？看看项目的最终基础架构：',
        'One of the great benefit of using a framework is the small amount of code needed to develop such a project:': '使用框架的一个巨大好处是开发此类项目所需的代码量很少：',
        '20 PHP classes under src/ for the website;': '网站下的 <code translate="no" class="notranslate">src/</code> 目录中有 20 个 PHP 类；',
        '550 PHP Logical Lines of Code (LLOC) as reported by PHPLOC;': '<a href="https://github.com/sebastianbergmann/phploc" class="reference external" rel="external noopener noreferrer" target="_blank">PHPLOC</a> 报告的 PHP 逻辑代码行（LLOC）为 550 行；',
        '40 lines of configuration tweaks in 3 files (via attributes and YAML), mainly to configure the backend design;': '在 3 个文件中（通过属性和 YAML）有 40 行配置调整，主要用于配置后端设计；',
        '20 lines of development infrastructure configuration (Docker);': '20 行开发基础设施配置（Docker）；',
        '100 lines of production infrastructure configuration (Platform.sh);': '100 行生产基础设施配置（Platform.sh）；',
        '5 explicit environment variables.': '5个显式环境变量。',
        'Ready for the challenge?': '准备好迎接挑战了吗？',
        'Getting the Project Source Code': '获取项目源代码',
        'To continue on the old-fashioned theme, I could have created a CD containing the source code, right? But what about a Git repository companion instead?': '为了继续这个老派的主题，我本可以创建一个包含源代码的光盘，对吧？但用一个 Git 仓库伴侣怎么样？',
        'Clone the guestbook repository somewhere on your local machine:': '在您的本地机器上的某个位置克隆<a href="https://github.com/the-fast-track/book-6.4-1" class="reference external" rel="external noopener noreferrer" target="_blank">留言簿仓库</a>：',
        'This repository contains all the code of the book.': '这个仓库包含了书中的所有代码。',
        'Note that we are using symfony new instead of git clone as the command does more than just cloning the repository (hosted on Github under the the-fast-track organization: https://github.com/the-fast-track/book-6.4-1). It also starts the web server, the containers, migrates the database, loads fixtures, ... After running the command, the website should be up and running, ready to be used.': '请注意，我们使用的是 <code translate="no" class="notranslate">symfony new</code> 而不是 <code translate="no" class="notranslate">git clone</code>，因为该命令不仅仅克隆仓库（托管在 Github 上的 <code translate="no" class="notranslate">the-fast-track</code> 组织下：<code translate="no" class="notranslate">https://github.com/the-fast-track/book-6.4-1</code>）。它还启动 Web 服务器、容器、迁移数据库、加载固定装置等。运行命令后，网站应该已经启动并运行，可以使用了。',
        'The code is 100% guaranteed to be synchronized with the code in the book (use the exact repository URL listed above). Trying to manually synchronize changes from the book with the source code in the repository is almost impossible. I tried in the past. I failed. It is just impossible. Especially for books like the ones I write: books that tells you a story about developing a website. As each chapter depends on the previous ones, a change might have consequences in all following chapters.': '代码与书中的代码保证100%同步（使用上面列出的确切仓库 URL）。尝试手动将书中的更改与仓库中的源代码同步几乎是不可能的。我过去试过。我失败了。这简直是不可能的。尤其是对我写的这类书来说：书中讲述的是一个开发网站的故事。由于每一章都依赖于前一章，因此更改可能会对后续所有章节产生影响。',
        "The good news is that the Git repository for this book is automatically generated from the book content. You read that right. I like to automate everything, so there is a script whose job is to read the book and create the Git repository. There is a nice side-effect: when updating the book, the script will fail if the changes are inconsistent or if I forget to update some instructions. That's BDD, Book Driven Development!": '好消息是，这本书的 Git 仓库是自动根据书籍内容生成的。你没听错。我喜欢自动化一切，所以有一个脚本的工作是读取书籍内容并创建 Git 仓库。这有一个很好的副作用：在更新书籍时，如果更改不一致或我忘记更新某些说明，脚本将会失败。这就是 BDD（书籍驱动开发）！',
        'Navigating the Source Code': '浏览源代码',
        "Even better, the repository is not just about the final version of the code on the main branch. The script executes each action explained in the book and it commits its work at the end of each section. It also tags each step and substep to ease browsing the code. Nice, isn't it?": '更好的是，这个存储库不仅仅包含主分支上的代码的最终版本。该脚本执行书中解释的每个操作，并在每节结束时提交其工作。它还为每个步骤和子步骤打上标签，以方便浏览代码。很棒，不是吗？',
        "If you are lazy, you can get the state of the code at the end of a step by checking out the right tag. For instance, if you'd like to read and test the code at the end of step 10, execute the following:": '如果你比较懒，可以通过检出正确的标签来获取步骤结束时的代码状态。例如，如果你想在步骤 10 结束时阅读并测试代码，可以执行以下操作：',
        'Like for cloning the repository, we are not using git checkout but symfony book:checkout. The command ensures that whatever the state you are currently in, you end up with a functional website for the step you ask for. Be warned that all data, code, and containers are removed by this operation.': '就像克隆存储库一样，我们没有使用 <code translate="no" class="notranslate">git checkout</code>，而是使用了  <code translate="no" class="notranslate">symfony book:checkout</code>。该命令确保无论您当前处于什么状态，最终您都会获得一个与您请求的步骤相对应的功能性网站。<strong>请注意，此操作会删除所有数据、代码和容器。</strong>',
        'You can also check out any substep:': '您还可以检出任何子步骤：',
        'Again, I highly recommend you code yourself. But if you get stuck, you can always compare what you have with the content of the book.': '再次强调，我非常建议您自己编写代码。但如果您遇到困难，可以随时将您的代码与书中的内容进行比较。',
        'Not sure that you got everything right in substep 10.2? Get the diff:': '不确定您在子步骤 10.2 中是否所有操作都正确？查看差异：',
        'Want to know when a file has been created or modified?': '想知道某个文件是什么时候创建或修改的吗？',
        'You can also browse diffs, tags, and commits directly on GitHub. This is a great way to copy/paste code if you are reading a paper book!': '你也可以直接在 GitHub 上浏览差异、标签和提交。如果你正在阅读纸质书，这是复制/粘贴代码的好方法！',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Checking your Work Environment': '检查你的工作环境',
        'Going from Zero to Production': '从零到生产'
    };

    fanyi(translates, 2);
})($);
