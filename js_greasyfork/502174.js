// ==UserScript==
// @name         Book for Symfony 6 翻译 11-branch.html
// @namespace    fireloong
// @version      0.0.7
// @description  代码分支 11-branch.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/11-branch.html
// @match        https://symfony.com/doc/current/the-fast-track/en/11-branch.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502174/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2011-branchhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502174/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2011-branchhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Branching the Code\n        \n            ': '代码分支',
        'There are many ways to organize the workflow of code changes in a project. But working directly on the Git master branch and deploying directly to production without testing is probably not the best one.': '组织项目中代码更改的工作流程有很多方法。但是直接在 Git 主分支上工作并未经测试就直接部署到生产环境可能不是最好的方法。',
        'Testing is not just about unit or functional tests, it is also about checking the application behavior with production data. If you or your stakeholders can browse the application exactly as it will be deployed to end users, this becomes a huge advantage and allows you to deploy with confidence. It is especially powerful when non-technical people can validate new features.': '测试不仅仅是关于单元测试或功能测试，还包括使用生产数据检查应用程序行为。如果您或您的利益相关者能够像在最终用户上部署时一样浏览应用程序，这将成为一个巨大的优势，并允许您充满信心地进行部署。当非技术人员可以验证新功能时，这一点尤其强大。',
        "We will continue doing all the work in the Git master branch in the next steps for simplicity sake and to avoid repeating ourselves, but let's see how this could work better.": '为了简化并避免重复，我们将在接下来的步骤中继续在 Git 主分支上完成所有工作，但让我们看看如何使其工作得更好。',
        'Adopting a Git Workflow': '采用 Git 工作流',
        'One possible workflow is to create one branch per new feature or bug fix. It is simple and efficient.': '一种可能的工作流是为每个新功能或错误修复创建一个分支。它既简单又高效。',
        'Creating Branches': '创建分支',
        'The workflow starts with the creation of a Git branch:': '工作流程从创建 Git 分支开始：',
        'This command creates a sessions-in-db branch from the master branch. It "forks" the code and the infrastructure configuration.': '此命令从 <code translate="no" class="notranslate">master</code> 分支创建一个 <code translate="no" class="notranslate">sessions-in-db</code> 分支。它“分叉”了代码和基础设施配置。',
        'Storing Sessions in the Database': '将会话存储在数据库中',
        'As you might have guessed from the branch name, we want to switch session storage from the filesystem to a database store (our PostgreSQL database here).': '正如您可能从分支名称中猜到的那样，我们想要将会话存储从文件系统切换到数据库存储（在这里是我们的 PostgreSQL 数据库）。',
        'The needed steps to make it a reality are typical:': '实现这一目标所需的步骤很典型：',
        'Create a Git branch;': '创建一个 Git 分支；',
        'Update the Symfony configuration if needed;': '如果需要，请更新 Symfony 配置；',
        'Write and/or update some code if needed;': '如果需要，请编写和/或更新一些代码；',
        'Update the PHP configuration if needed (like adding the PostgreSQL PHP\nextension);': '如果需要，请更新PHP配置（如添加 PostgreSQL PHP 扩展）；',
        'Update the infrastructure on Docker and Platform.sh if needed (add the PostgreSQL service);': '如果需要，请在 Docker 和 Platform.sh 上更新基础结构（添加 PostgreSQL 服务）；',
        'Test locally;': '本地测试；',
        'Test remotely;': '远程测试；',
        'Merge the branch to master;': '将分支合并到 master；',
        'Deploy to production;': '部署到生产；',
        'Delete the branch.': '删除分支。',
        'To store sessions in the database, change the session.handler_id configuration to point to the database DSN:': '为了将会话存储在数据库中，请更改 <code translate="no" class="notranslate">session.handler_id</code> 配置以指向数据库 DSN：',
        'To store sessions in the database, we need to create the sessions table. Do so with a Doctrine migration:': '为了将会话存储在数据库中，我们需要创建会话表。请通过 Doctrine 迁移来完成：',
        'Migrate the database:': '迁移数据库：',
        'Test locally by browsing the website. As there are no visual changes and because we are not using sessions yet, everything should still work as before.': '通过浏览网站在本地进行测试。由于没有视觉上的变化，并且因为我们还没有使用会话，所以一切应该仍然像以前一样工作。',
        "We don't need steps 3 to 5 here as we are re-using the database as the session storage, but the chapter about using Redis shows how straightforward it is to add, test, and deploy a new service in both Docker and Platform.sh.": '由于我们在这里重新使用数据库作为会话存储，因此我们不需要第3到第5步，但是关于使用 Redis 的章节展示了在 Docker 和 Platform.sh 中添加、测试和部署新服务是多么直接。',
        'Commit your changes to the new branch:': '将您的更改提交到新分支：',
        'Deploying a Branch': '部署分支',
        'Before deploying to production, we should test the branch on the same infrastructure as the production one. We should also validate that everything works fine for the Symfony prod environment (the local website used the Symfony dev environment).': '在生产环境中部署之前，我们应该在与生产环境相同的基础设施上测试该分支。我们还应该验证 Symfony <code translate="no" class="notranslate">prod</code> 环境（本地网站使用 Symfony <code translate="no" class="notranslate">dev</code> 环境）中的一切是否正常工作。',
        "Now, let's create a Platform.sh environment based on the Git branch:": '现在，让我们基于 Git 分支创建一个 Platform.sh 环境：',
        'This command creates a new environment as follows:': '此命令将按以下方式创建新环境：',
        'The branch inherits the code and infrastructure from the current Git branch (sessions-in-db);': '该分支从当前 Git 分支（<code translate="no" class="notranslate">sessions-in-db</code>）继承代码和基础结构；',
        'The data come from the master (aka production) environment by taking a consistent snapshot of all service data, including files (user uploaded files for instance) and databases;': '数据来自 master (又名生产)环境，通过对所有服务数据(包括文件(例如用户上传的文件)和数据库)进行一致的快照;',
        'A new dedicated cluster is created to deploy the code, the data, and the infrastructure.': '创建一个新的专用集群来部署代码、数据和基础设施。',
        'As the deployment follows the same steps as deploying to production, database migrations will also be executed. This is a great way to validate that the migrations work with production data.': '由于部署遵循与生产部署相同的步骤，因此也将执行数据库迁移。这是验证迁移与生产数据一起工作的好方法。',
        'The non-master environments are very similar to the master one except for some small differences: for instance, emails are not sent by default.': '非 <code translate="no" class="notranslate">master</code> 环境非常类似于 <code translate="no" class="notranslate">master</code> 环境，但存在一些小差异：例如，默认情况下不会发送电子邮件。',
        'Once the deployment is finished, open the new branch in a browser:': '部署完成后，在浏览器中打开新分支：',
        'Note that all Platform.sh commands work on the current Git branch. This command opens the deployed URL for the sessions-in-db branch; the URL will look like https://sessions-in-db-xxx.eu-5.platformsh.site/.': '请注意，所有 Platform.sh 命令都在当前 Git 分支上运行。此命令打开 <code translate="no" class="notranslate">sessions-in-db</code> 分支的已部署 URL；URL 将类似于 <code translate="no" class="notranslate">https://sessions-in-db-xxx.eu-5.platformsh.site/</code>。',
        'Test the website on this new environment, you should see all the data that you created in the master environment.': '在这个新环境中测试网站，你应该能看到在主环境中创建的所有数据。',
        "If you add more conferences on the master environment, they won't show up in the sessions-in-db environment and vice-versa. The environments are independent and isolated.": '如果在 <code translate="no" class="notranslate">master</code> 环境中添加更多的会议，它们将不会显示在 <code translate="no" class="notranslate">sessions-in-db</code> 环境中，反之亦然。环境是独立和隔离的。',
        'If the code evolves on master, you can always rebase the Git branch and deploy the updated version, resolving the conflicts for both the code and the infrastructure.': '如果代码是在 master 上演进的，那么您总是可以重新构建 Git 分支并部署更新的版本，从而解决代码和基础架构的冲突。',
        'You can even synchronize the data from master back to the sessions-in-db environment:': '您甚至可以将数据从 master 同步回 <code translate="no" class="notranslate">sessions-in-db</code> 环境:',
        'Debugging Production Deployments before Deploying': '部署前调试生产部署',
        'By default, all Platform.sh environments use the same settings as the master/prod environment (aka the Symfony prod environment). This allows you to test the application in real-life conditions. It gives you the feeling of developing and testing directly on production servers, but without the risks associated with it. This reminds me of the good old days when we were deploying via FTP.': '默认情况下，所有 Platform.sh 环境使用与 <code translate="no" class="notranslate">master</code>/<code translate="no" class="notranslate">prod</code> 环境(也称为Symfony <code translate="no" class="notranslate">prod</code> 环境)相同的设置。这允许您在实际条件下测试应用程序。它给您直接在生产服务器上开发和测试的感觉，但没有与之相关的风险。这让我想起了通过 FTP 进行部署的美好时光。',
        'In case of a problem, you might want to switch to the dev Symfony environment:': '如果出现问题，您可能希望切换到开发 Symfony 环境:',
        'When done, move back to production settings:': '完成后，返回生产设置：',
        'Never enable the dev environment and never enable the Symfony Profiler on the master branch; it would make your application really slow and open a lot of serious security vulnerabilities.': '<strong>永远不要</strong>在 <code translate="no" class="notranslate">master</code> 分支上启用 <code translate="no" class="notranslate">dev</code> 环境和 Symfony Profiler；它会使你的应用程序变得非常缓慢，并开放许多严重的安全漏洞。',
        'Testing Production Deployments before Deploying': '在生产部署前进行测试',
        'Having access to the upcoming version of the website with production data opens up a lot of opportunities: from visual regression testing to performance testing. Blackfire is the perfect tool for the job.': '使用生产数据访问网站的即将发布的版本带来了很多机会：从视觉回归测试到性能测试。<a href="https://www.blackfire.io" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire</a> 是这项工作的完美工具。',
        'Refer to the step about Performance to learn more about how you can use Blackfire to test your code before deploying.': '参考<a href="29-performance.html" class="reference internal">性能</a>步骤，以了解有关如何在部署前使用 Blackfire 测试代码的更多信息。',
        'Merging to Production': '合并到生产环境',
        'When you are satisfied with the branch changes, merge the code and the infrastructure back to the Git master branch:': '当你对分支更改满意时，将代码和基础架构合并回 Git 主分支：',
        'And deploy:': '并进行部署：',
        'When deploying, only the code and infrastructure changes are pushed to Platform.sh; the data are not affected in any way.': '在部署时，只有代码和基础架构更改被推送到 Platform.sh；数据不会受到任何影响。',
        'Cleaning up': '清理',
        'Finally, clean up by removing the Git branch and the Platform.sh environment:': '最后，通过删除 Git 分支和 Platform.sh 环境来进行清理：',
        'Going Further': '深入探索',
        'Git branching;': '<a href="https://www.git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B" class="reference external" rel="external noopener noreferrer" target="_blank">Git 分支</a>；',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Building the User Interface': '构建用户界面',
        'Listening to Events': '监听事件'
    };

    fanyi(translates, 2);
})($);
