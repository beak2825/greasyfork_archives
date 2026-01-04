// ==UserScript==
// @name         Book for Symfony 6 翻译 7-database.html
// @namespace    fireloong
// @version      0.0.8
// @description  设置数据库 7-database.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/7-database.html
// @match        https://symfony.com/doc/current/the-fast-track/en/7-database.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501831/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%207-databasehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501831/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%207-databasehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Setting up a Database\n        \n            ': '设置数据库',
        'The Conference Guestbook website is about gathering feedback during conferences. We need to store the comments contributed by the conference attendees in a permanent storage.': '会议留言簿网站是关于在会议期间收集反馈的。我们需要将会议参与者提供的评论存储在永久存储中。',
        'A comment is best described by a fixed data structure: an author, their email, the text of the feedback, and an optional photo. The kind of data that can be best stored in a traditional relational database engine.': '一个评论最好由一个固定的数据结构来描述：作者、他们的电子邮件、反馈的文本和一张可选的照片。这种类型的数据最适合存储在传统的关系数据库引擎中。',
        'PostgreSQL is the database engine we will use.': '我们将使用 PostgreSQL 作为数据库引擎。',
        'Adding PostgreSQL to Docker Compose': '将 PostgreSQL 添加到 Docker Compose',
        'On our local machine, we have decided to use Docker to manage services. The generated compose.yaml file already contains PostgreSQL as a service:': '在我们的本地机器上，我们决定使用 Docker 来管理服务。生成的 <code translate="no" class="notranslate">compose.yaml</code> 文件已经包含 PostgreSQL 作为一项服务：',
        'This will install a PostgreSQL server and configure some environment variables that control the database name and credentials. The values do not really matter.': '这将安装一个 PostgreSQL 服务器，并配置一些控制数据库名称和凭据的环境变量。这些值实际上并不重要。',
        'We also expose the PostgreSQL port (5432) of the container to the local host. That will help us access the database from our machine:': '我们还将容器的 PostgreSQL 端口（<code translate="no" class="notranslate">5432</code>）暴露给本地主机。这将帮助我们从我们的机器访问数据库：',
        'The pdo_pgsql extension should have been installed when PHP was set up in a previous step.': '在前面的步骤中设置 PHP 时，应该已经安装了 <code translate="no" class="notranslate">pdo_pgsql</code> 扩展。',
        'Starting Docker Compose': '启动 Docker Compose',
        'Start Docker Compose in the background (-d):': '在后台启动 Docker Compose（<code translate="no" class="notranslate">-d</code>）：',
        'Wait a bit to let the database start up and check that everything is running fine:': '稍等片刻以让数据库启动，并检查一切是否正常运行：',
        'If there are no running containers or if the State column does not read Up, check the Docker Compose logs:': '如果没有正在运行的容器，或者 <code translate="no" class="notranslate">State</code> 列没有显示 <code translate="no" class="notranslate">Up</code>，请检查 Docker Compose 日志：',
        'Accessing the Local Database': '访问本地数据库',
        'Using the psql command-line utility might prove useful from time to time. But you need to remember the credentials and the database name. Less obvious, you also need to know the local port the database runs on the host. Docker chooses a random port so that you can work on more than one project using PostgreSQL at the same time (the local port is part of the output of docker compose ps).': '使用 <code translate="no" class="notranslate">psql</code> 命令行实用程序可能会不时地证明很有用。但你需要记住凭据和数据库名称。不那么明显的是，你还需要知道数据库在主机上运行的本地端口。Docker 选择一个随机端口，以便你可以同时使用 PostgreSQL 处理多个项目（本地端口是 <code translate="no" class="notranslate">docker compose ps</code> 命令输出的一部分）。',
        "If you run psql via the Symfony CLI, you don't need to remember anything.": '如果你通过 Symfony CLI 运行 <code translate="no" class="notranslate">psql</code>，那你什么都不需要记住。',
        'The Symfony CLI automatically detects the Docker services running for the project and exposes the environment variables that psql needs to connect to the database.': 'Symfony CLI 会自动检测为项目运行的 Docker 服务，并公开 <code translate="no" class="notranslate">psql</code> 连接到数据库所需的环境变量。',
        'Thanks to these conventions, accessing the database via symfony run is much easier:': '得益于这些约定，通过 <code translate="no" class="notranslate">symfony run</code> 访问数据库要容易得多：',
        "If you don't have the psql binary on your local host, you can also run it via docker compose:": '如果你本地主机上没有 <code translate="no" class="notranslate">psql</code> 二进制文件，你也可以通过 <code translate="no" class="notranslate">docker compose</code> 来运行它：',
        'Dumping and Restoring Database Data': '转储和恢复数据库数据',
        'Use pg_dump to dump the database data:': '使用 <code translate="no" class="notranslate">pg_dump</code> 来转储数据库数据：',
        'And restore the data:': '并恢复数据：',
        'Adding PostgreSQL to Platform.sh': '将 PostgreSQL 添加到 Platform.sh',
        'For the production infrastructure on Platform.sh, adding a service like PostgreSQL should be done in the .platform/services.yaml file, which was already done via the webapp package recipe:': '对于 Platform.sh 上的生产基础设施，添加像 PostgreSQL 这样的服务应该在 <code translate="no" class="notranslate">.platform/services.yaml</code> 文件中进行，这已通过 <code translate="no" class="notranslate">webapp</code> 包配方完成：',
        'The database service is a PostgreSQL database (same version as for Docker) that we want to provision with 1GB of disk.': '<code translate="no" class="notranslate">database</code> 服务是一个 PostgreSQL 数据库（与 Docker 使用的版本相同），我们希望为其分配 1GB 的磁盘空间。',
        'We also need to "link" the DB to the application container, which is described in .platform.app.yaml:': '我们还需要将数据库“链接”到应用程序容器，这在 <code translate="no" class="notranslate">.platform.app.yaml</code> 文件中进行了描述：',
        'The database service of type postgresql is referenced as database on the application container.': '类型为 <code translate="no" class="notranslate">postgresql</code> 的 <code translate="no" class="notranslate">database</code> 服务在应用程序容器中被引用为 <code translate="no" class="notranslate">database</code>。',
        'Check that the pdo_pgsql extension is already installed for the PHP runtime:': '检查 PHP 运行时是否已安装 <code translate="no" class="notranslate">pdo_pgsql</code> 扩展：',
        'Accessing the Platform.sh Database': '访问 Platform.sh 数据库',
        'PostgreSQL is now running both locally via Docker and in production on Platform.sh.': '现在，PostgreSQL 既可以通过 Docker 在本地运行，也可以在 Platform.sh 上进行生产运行。',
        'As we have just seen, running symfony run psql automatically connects to the database hosted by Docker thanks to environment variables exposed by symfony run.': '正如我们刚才所见，运行 <code translate="no" class="notranslate">symfony run psql</code> 会自动连接到由 Docker 托管的数据库，这要归功于 <code translate="no" class="notranslate">symfony run</code> 暴露的环境变量。',
        'If you want to connect to PostgreSQL hosted on the production containers, you can open an SSH tunnel between the local machine and the Platform.sh infrastructure:': '如果你想要连接到托管在生产容器上的 PostgreSQL，你可以在本地机器和 Platform.sh 基础设施之间打开一个 SSH 隧道：',
        'By default, Platform.sh services are not exposed as environment variables on the local machine. You must explicitly do so by running the var:expose-from-tunnel command. Why? Connecting to the production database is a dangerous operation. You can mess with real data.': '默认情况下，Platform.sh 服务不会作为环境变量在本地机器上公开。你必须通过运行 <code translate="no" class="notranslate">var:expose-from-tunnel</code> 命令来明确执行此操作。为什么？连接到生产数据库是一项危险的操作。你可能会破坏真实数据。',
        'Now, connect to the remote PostgreSQL database via symfony run psql as before:': '现在，像以前一样通过 <code translate="no" class="notranslate">symfony run psql</code> 连接到远程 PostgreSQL 数据库：',
        "When done, don't forget to close the tunnel:": '完成后，不要忘记关闭隧道：',
        'To run some SQL queries on the production database instead of getting a shell, you can also use the symfony sql command.': '如果你想在生产数据库上运行一些 SQL 查询而不是获取一个 shell，你也可以使用 <code translate="no" class="notranslate">symfony sql</code> 命令。',
        'Exposing Environment Variables': '公开环境变量',
        'Docker Compose and Platform.sh work seamlessly with Symfony thanks to environment variables.': '由于环境变量的作用，Docker Compose 和 Platform.sh 可以与 Symfony 无缝协作。',
        'Check all environment variables exposed by symfony by executing symfony var:export:': '通过执行 <code translate="no" class="notranslate">symfony var:export</code> 命令，检查 symfony 公开的所有环境变量：',
        'The PG* environment variables are read by the psql utility. What about the others?': '<code translate="no" class="notranslate">PG*</code> 环境变量由 <code translate="no" class="notranslate">psql</code> 实用程序读取。其他环境变量呢？',
        'When a tunnel is open to Platform.sh with var:expose-from-tunnel, the var:export command returns remote environment variables:': '当使用 <code translate="no" class="notranslate">var:expose-from-tunnel</code> 打开到 Platform.sh 的隧道时，<code translate="no" class="notranslate">var:export</code> 命令会返回远程环境变量：',
        'Describing your Infrastructure': '描述你的基础设施',
        'You might not have realized it yet, but having the infrastructure stored in files alongside of the code helps a lot. Docker and Platform.sh use configuration files to describe the project infrastructure. When a new feature needs an additional service, the code changes and the infrastructure changes are part of the same patch.': '你可能还没有意识到这一点，但是将基础设施存储在代码旁边的文件中会有很大的帮助。Docker 和 Platform.sh 使用配置文件来描述项目基础设施。当新功能需要额外的服务时，代码更改和基础设施更改都是同一补丁的一部分。',
        'Going Further': '深入探索',
        'Platform.sh services;': '<a href="https://symfony.com/doc/6.4/cloud/services/intro.html#available-services" class="reference external">Platform.sh 服务</a>；',
        'Platform.sh tunnel;': '<a href="https://symfony.com/doc/6.4/cloud/services/intro.html#connecting-to-a-service" class="reference external">Platform.sh 隧道</a>；',
        'PostgreSQL documentation;': '<a href="https://www.postgresql.org/docs/" class="reference external" rel="external noopener noreferrer" target="_blank">PostgreSQL 文档</a>；',
        'docker compose commands.': '<a href="https://docs.docker.com/compose/reference/" class="reference external" rel="external noopener noreferrer" target="_blank">docker compose 命令</a>；',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Creating a Controller': '创建控制器',
        'Describing the Data Structure': '描述数据结构'
    };

    fanyi(translates, 2);
})($);
