// ==UserScript==
// @name         Book for Symfony 6 翻译 8-doctrine.html
// @namespace    fireloong
// @version      0.0.8
// @description  描述数据结构 8-doctrine.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/8-doctrine.html
// @match        https://symfony.com/doc/current/the-fast-track/en/8-doctrine.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501917/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%208-doctrinehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501917/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%208-doctrinehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Describing the Data Structure\n        \n            ': '描述数据结构',
        'To deal with the database from PHP, we are going to depend on Doctrine, a set of libraries that help developers manage databases: Doctrine DBAL (a database abstraction layer), Doctrine ORM (a library to manipulate our database content using PHP objects), and Doctrine Migrations.': '为了从 PHP 处理数据库，我们将依赖于 <a href="https://www.doctrine-project.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Doctrine</a>，这是一套帮助开发者管理数据库的库：Doctrine DBAL（数据库抽象层）、Doctrine ORM（一个使用 PHP 对象来操作数据库内容的库）和 Doctrine Migrations。',
        'Configuring Doctrine ORM': '配置 Doctrine ORM',
        "How does Doctrine know the database connection? Doctrine's recipe added a configuration file, config/packages/doctrine.yaml, that controls its behavior. The main setting is the database DSN, a string containing all the information about the connection: credentials, host, port, etc. By default, Doctrine looks for a DATABASE_URL environment variable.": 'Doctrine 是如何知道数据库连接的？Doctrine 的配方添加了一个配置文件，即 <code translate="no" class="notranslate">config/packages/doctrine.yaml</code>，它控制其行为。主要设置是数据库 DSN，这是一个包含连接所有信息的字符串：凭据、主机、端口等。默认情况下，Doctrine 会查找一个 <code translate="no" class="notranslate">DATABASE_URL</code> 环境变量。',
        'Almost all installed packages have a configuration under the config/packages/ directory. Most of the time, the defaults have been chosen carefully to work for most applications.': '几乎所有已安装的包都在 <code translate="no" class="notranslate">config/packages/</code> 目录下有一个配置文件。大多数情况下，默认设置都是经过精心选择的，适用于大多数应用程序。',
        'Understanding Symfony Environment Variable Conventions': '理解 Symfony 环境变量约定',
        "You can define the DATABASE_URL manually in the .env or .env.local file. In fact, thanks to the package's recipe, you'll see an example DATABASE_URL in your .env file. But because the local port to PostgreSQL exposed by Docker can change, it is quite cumbersome. There is a better way.": '您可以在 <code translate="no" class="notranslate">.env</code> 或 <code translate="no" class="notranslate">.env.local</code> 文件中手动定义 <code translate="no" class="notranslate">DATABASE_URL</code>。事实上，由于包的配方，您将在 <code translate="no" class="notranslate">.env</code> 文件中看到一个示例 <code translate="no" class="notranslate">DATABASE_URL</code>。但是，由于 Docker 公开的 PostgreSQL 本地端口可能会更改，因此这相当繁琐。有更好的方法。',
        'Instead of hard-coding DATABASE_URL in a file, we can prefix all commands with symfony. This will detect services ran by Docker and/or Platform.sh (when the tunnel is open) and set the environment variable automatically.': '我们不必在文件中硬编码 <code translate="no" class="notranslate">DATABASE_URL</code>，而是可以在所有命令前加上 <code translate="no" class="notranslate">symfony</code>。这将检测 Docker 和/或 Platform.sh（当隧道打开时）运行的服务，并自动设置环境变量。',
        'Docker Compose and Platform.sh work seamlessly with Symfony thanks to these environment variables.': '由于这些环境变量，Docker Compose 和 Platform.sh 可以与 Symfony 无缝协作。',
        'Check all exposed environment variables by executing symfony var:export:': '通过执行 <code translate="no" class="notranslate">symfony var:export</code> 检查所有暴露的环境变量：',
        'Remember the database service name used in the Docker and Platform.sh configurations? The service names are used as prefixes to define environment variables like DATABASE_URL. If your services are named according to the Symfony conventions, no other configuration is needed.': '还记得在 Docker 和 Platform.sh 配置中使用的 <code translate="no" class="notranslate">database</code> 服务名称吗？服务名称用作前缀来定义环境变量，如 <code translate="no" class="notranslate">DATABASE_URL</code>。如果您的服务名称符合 Symfony 约定，则无需其它配置。',
        'Databases are not the only service that benefit from the Symfony conventions. The same goes for Mailer, for example (via the MAILER_DSN environment variable).': '数据库并不是唯一从 Symfony 约定中受益的服务。例如，Mailer 也是如此（通过 <code translate="no" class="notranslate">MAILER_DSN</code> 环境变量）。',
        'Changing the Default DATABASE_URL Value in .env': '在 .env 文件中更改默认的 DATABASE_URL 值',
        'We will still change the .env file to setup the default DATABASE_URL to use PostgreSQL:': '我们仍然会更改 <code translate="no" class="notranslate">.env</code> 文件，以设置默认的 <code translate="no" class="notranslate">DATABASE_URL</code> 来使用 PostgreSQL：',
        "Why does the information need to be duplicated in two different places? Because on some Cloud platforms, at build time, the database URL might not be known yet but Doctrine needs to know the database's engine to build its configuration. So, the host, username, and password do not really matter.": '为什么信息需要在两个不同的地方重复？因为在一些云平台上，在构建时可能还不知道数据库 URL，但 Doctrine 需要知道数据库的引擎来构建其配置。因此，主机名、用户名和密码实际上并不重要。',
        'Creating Entity Classes': '创建实体类',
        'A conference can be described with a few properties:': '会议可以用几个属性来描述：',
        'The city where the conference is organized;': '会议举办的城市；',
        'The year of the conference;': '会议的年份；',
        'An international flag to indicate if the conference is local or international (SymfonyLive vs SymfonyCon).': '一个国际标志，用于指示会议是本地的还是国际的（SymfonyLive vs SymfonyCon）。',
        'The Maker bundle can help us generate a class (an Entity class) that represents a conference.': 'Maker 包可以帮助我们生成一个表示会议的类（实体类）。',
        'It is now time to generate the Conference entity:': '现在是时候生成 <code translate="no" class="notranslate">Conference</code> 实体了：',
        'This command is interactive: it will guide you through the process of adding all the fields you need. Use the following answers (most of them are the defaults, so you can hit the "Enter" key to use them):': '此命令是交互式的：它将引导您完成添加所需所有字段的过程。使用以下答案（其中大多数是默认值，因此您可以按“Enter”键使用它们）：',
        'Here is the full output when running the command:': '以下是运行命令时的完整输出：',
        'The Conference class has been stored under the App\\Entity\\ namespace.': '<code translate="no" class="notranslate">Conference</code> 类已存储在 <code translate="no" class="notranslate">App\\Entity\\</code> 命名空间中。',
        'The command also generated a Doctrine repository class: App\\Repository\\ConferenceRepository.': '该命令还生成了一个 Doctrine 存储库类：<code translate="no" class="notranslate">App\\Repository\\ConferenceRepository</code>。',
        'The generated code looks like the following (only a small portion of the file is replicated here):': '生成的代码如下所示（这里只复制了文件的一小部分）：',
        'Note that the class itself is a plain PHP class with no signs of Doctrine. Attributes are used to add metadata useful for Doctrine to map the class to its related database table.': '请注意，该类本身是一个普通的 PHP 类，没有任何 Doctrine 的迹象。使用属性为 Doctrine 添加元数据，以便将类映射到其相关的数据库表。',
        'Doctrine added an id property to store the primary key of the row in the database table. This key (ORM\\Id()) is automatically generated (ORM\\GeneratedValue()) via a strategy that depends on the database engine.': 'Doctrine 添加了一个 <code translate="no" class="notranslate">id</code> 属性来存储数据库中行的主键。这个键（<code translate="no" class="notranslate">ORM\\Id()</code>）是通过依赖于数据库引擎的策略自动生成的（<code translate="no" class="notranslate">ORM\\GeneratedValue()</code>）。',
        'Now, generate an Entity class for conference comments:': '现在，为会议评论生成一个实体类：',
        'Enter the following answers:': '输入以下答案：',
        'Linking Entities': '连接实体',
        'The two entities, Conference and Comment, should be linked together. A Conference can have zero or more Comments, which is called a one-to-many relationship.': '两个实体，即 Conference 和 Comment，应该链接在一起。一个 Conference 可以有零个或多个 Comment，这被称为一对多关系。',
        'Use the make:entity command again to add this relationship to the Conference class:': '再次使用 <code translate="no" class="notranslate">make:entity</code> 命令将此关系添加到 <code translate="no" class="notranslate">Conference</code> 类中：	',
        'If you enter ? as an answer for the type, you will get all supported types:': '如果你输入 <code translate="no" class="notranslate">?</code> 作为类型的答案，你将得到所有支持的类型：',
        'Have a look at the full diff for the entity classes after adding the relationship:': '在添加关系后，查看实体类的完整差异：',
        'Everything you need to manage the relationship has been generated for you. Once generated, the code becomes yours; feel free to customize it the way you want.': '您所需要管理关系的一切都已为您生成。一旦生成，代码就属于您了；请随意按照您想要的方式进行自定义。',
        'Adding more Properties': '添加更多属性',
        'I just realized that we have forgotten to add one property on the Comment entity: attendees might want to attach a photo of the conference to illustrate their feedback.': '我刚意识到我们在 Comment 实体上忘记添加一个属性了：与会者可能希望附加一张会议的照片来阐述他们的反馈。',
        'Run make:entity once more and add a photoFilename property/column of type string, but allow it to be null as uploading a photo is optional:': '再次运行 <code translate="no" class="notranslate">make:entity</code>，并添加一个类型为 <code translate="no" class="notranslate">string</code> 的 <code translate="no" class="notranslate">photoFilename</code> 属性/列，但允许它为 <code translate="no" class="notranslate">null</code>，因为上传照片是可选的：',
        'Migrating the Database': '迁移数据库',
        'The project model is now fully described by the two generated classes.': '现在，项目模型完全由两个生成的类描述。',
        'Next, we need to create the database tables related to these PHP entities.': '接下来，我们需要创建与这些 PHP 实体相关的数据库表。',
        'Doctrine Migrations is the perfect match for such a task. It has already been installed as part of the orm dependency.': '<em>Doctrine Migrations</em> 是完成这种任务的完美匹配。它已经被作为 <code translate="no" class="notranslate">orm</code> 依赖的一部分安装好了。',
        'A migration is a class that describes the changes needed to update a database schema from its current state to the new one defined by the entity attributes. As the database is empty for now, the migration should consist of two table creations.': '<em>migration</em> 是一个类，它描述了从当前状态更新数据库模式到由实体属性定义的新状态所需的更改。由于目前数据库是空的，迁移应该包括两个表的创建。',
        "Let's see what Doctrine generates:": '让我们看看 Doctrine 生成了什么：',
        'Notice the generated file name in the output (a name that looks like migrations/Version20191019083640.php):': '注意输出中生成的文件名（一个看起来像 <code translate="no" class="notranslate">migrations/Version20191019083640.php</code> 的名称）：',
        'Updating the Local Database': '更新本地数据库',
        'You can now run the generated migration to update the local database schema:': '现在可以运行生成的迁移来更新本地数据库架构:',
        'The local database schema is now up-to-date, ready to store some data.': '现在本地数据库模式是最新的，准备好存储一些数据了。',
        'Updating the Production Database': '更新生产数据库',
        'The steps needed to migrate the production database are the same as the ones you are already familiar with: commit the changes and deploy.': '迁移生产数据库所需的步骤与您已经熟悉的步骤相同：提交更改并部署。',
        'When deploying the project, Platform.sh updates the code, but also runs the database migration if any (it detects if the doctrine:migrations:migrate command exists).': '在部署项目时，Platform.sh 会更新代码，并在存在时运行数据库迁移（它会检测是否存在 <code translate="no" class="notranslate">doctrine:migrations:migrate</code> 命令）。',
        'Going Further': '深入探索',
        'Databases and Doctrine ORM in Symfony applications;': 'Symfony 应用程序中的<a href="https://symfony.com/doc/6.4/doctrine.html" class="reference external">数据库和 Doctrine ORM</a>；',
        'SymfonyCasts Doctrine tutorial;': '<a href="https://symfonycasts.com/screencast/symfony-doctrine/install" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Doctrine 教程</a>；',
        'Working with Doctrine Associations/Relations;': '<a href="https://symfony.com/doc/6.4/doctrine/associations.html" class="reference external">使用 Doctrine 关联/关系工作</a>；',
        'DoctrineMigrationsBundle docs.': '<a href="https://symfony.com/bundles/DoctrineMigrationsBundle/current/index.html" class="reference external">DoctrineMigrationsBundle 文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Setting up a Database': '设置数据库',
        'Setting up an Admin Backend': '设置管理后端'
    };

    fanyi(translates, 2);
})($);
