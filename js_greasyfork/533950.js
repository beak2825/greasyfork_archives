// ==UserScript==
// @name         Codedex 中文化插件
// @namespace    https://github.com/wangyan-life
// @match        https://www.codedex.io/*
// @version      1.0
// @description  Codedex 汉化插件，Codedex 中文化界面，将 Codedex 编程学习网站翻译成中文。(Codedex Translation To Chinese)
// @author       wangyan-life
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533950/Codedex%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/533950/Codedex%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 翻译管理器类 - 核心类
    class TranslationManager {
        constructor() {
            this.debug = false; // 设置为true开启调试日志
            // 初始化字典集合
            this.dictionaries = {
                // 按钮文本翻译字典
                buttons: {
                    'Sign up': '注册',
                    'Get Started': '开始使用',
                    'Sign up for free': '免费注册',
                    'Learn': '学习',
                    'Practice': '练习',
                    'Build': '构建',
                    'Community': '社区',
                    'Pricing': '定价',
                    'Explore All Courses': '探索所有课程',
                    'Start Learning for Free': '开始免费学习',
                    'Join Club now': '立即加入俱乐部',
                    'Join Club': '加入俱乐部',
                    'Continue Learning': '继续学习',
                    'View syllabus': '查看教学大纲',
                    'See all': '查看所有',
                    'Send invite': '发送邀请',
                    'All Courses': '所有课程',
                    'Resume Learning': '继续学习',
                    'Prev': '上一页',
                    'Check Answer': '检查答案',
                    'Next': '下一页',
                    'Run': '运行',
                    'Submit': '提交',
                    'View Profile': '查看个人资料',
                    'Back': '返回'
                },

                // 页脚链接翻译字典
                footers: {
                    'COMPANY': '公司',
                    'About': '关于我们',
                    'Blog': '博客',
                    'Shop': '商店',
                    'Community': '社区',
                    'Help Center': '帮助中心',
                    'Pricing': '定价',
                    'PRACTICE': '练习',
                    'Challenges': '挑战',
                    'Projects': '项目',
                    '#30NitesOfCode': '30天编程挑战',
                    'Learn': '学习',
                    'All Courses': '所有课程',
                    'Intermediate Python': '中级Python',
                    'Command Line': '命令行',
                    'Intermediate JavaScript': '中级JavaScript'
                },

                // 下拉菜单项翻译字典
                dropdown: {
                    'Profile': '个人资料',
                    'Settings': '设置',
                    'Switch theme': '切换主题',
                    'Sign Out': '退出登录',
                    'Challenges': '挑战',
                    'Projects': '项目',
                    'Home': '主页',
                    'Worlds': '大世界'
                },

                // 练习标题翻译
                exerciseTitles: {
                    'Setting Up': '环境设置',
                    'Pattern': '模式',
                    'Initials': '首字母',
                    'Snail Mail': '蜗牛邮件',
                    'Exercise': '练习',
                    'Hello World': '你好世界'
                },

                // 打字效果标题翻译
                typewriter: {
                    'Level up your learning': '提升你的学习体验',
                    'Practice your coding chops': '练习你的编码技能',
                    'Build an awesome portfolio': '构建一个很棒的作品集',
                    'Make friends along the way': '在旅途中结交朋友',
                    'Loved by our': '深受我们的',
                    'learners': '学习者喜爱',
                    'Recommended': '推荐',
                    'DATA SCIENCE': '数据科学',
                    'WEB DEVELOPMENT': '网页开发'
                },

                // 用户统计信息翻译
                userStats: {
                    'Level': '等级',
                    'Total XP': '总经验值',
                    'Rank': '段位',
                    'Bronze': '青铜',
                    'Silver': '白银',
                    'Gold': '黄金',
                    'Badges': '徽章',
                    'Day streak': '连续天数',
                    'View profile': '查看个人资料'
                },

                // 课程元数据翻译
                courseMeta: {
                    'COURSE': '课程',
                    'Python': 'Python',
                    'Next exercise:': '下一个练习:'
                },

                // 常见文本翻译
                common: {
                    'New Item Unlocked!': '解锁了新物品！',
                    'Rubber Duck': '橡皮鸭',
                    'Rubber duck debugging is a classic technique used by developers to debug code. By explaining the code line-by-line to a rubber duck, you can break down the code into smaller pieces, and potentially identify the error.': '橡皮鸭调试法是开发者用来调试代码的经典技巧。通过向一只橡皮鸭逐行解释代码，你可以将代码分解成更小的部分，并可能发现错误。',
                    '... It\'s silly, we know.': '...这听起来很傻，我们知道。',
                    'Codédex Bot': 'Codédex机器人',
                    'I\'m a coding mentor bot built with GPT-4 👋. I\'m here to answer any questions related to programming, Codédex, and much more.': '我是一个用GPT-4构建的编程导师机器人👋。我在这里回答任何与编程、Codédex等相关的问题。',
                    'Editor Themes': '编辑器主题',
                    'Congrats! You unlocked Editor Themes. You can now change the theme of the editor to your liking.': '恭喜！你解锁了编辑器主题。现在你可以根据自己的喜好更改编辑器的主题。',
                    'Done with this exercise? Click "Check Answer" to continue!': '完成这个练习了吗？点击"检查答案"继续！',
                    'You got it! ✺◟(＾∇＾)◞✺': '你做对了！✺◟(＾∇＾)◞✺',
                    'Press': '按',
                    'to continue': '继续',
                    'FEATURE UNLOCKED!': '功能已解锁！',
                    'You have': '你已经获得了',
                    'This means you can now join our Discord community to chat and hang out with fellow learners and the team behind Codédex!': '这意味着你现在可以加入我们的Discord社区，与其他学习者和Codédex团队聊天交流！',
                    'See you there.': '在那里见。',
                    'Back': '返回',
                    'Join Discord': '加入Discord',
                    'This means you can now join our On-Platform community to chat and hang out with fellow learners!': '这意味着你现在可以加入我们的平台内社区，与其他学习者聊天交流！',
                    'Say hi in the': '在',
                    'Introductions': '介绍',
                    'channel.': '频道打个招呼吧。',
                    'Join Community': '加入社区',
                    'Help': '帮助',
                    'Get a Hint': '获取提示',
                    'Show Hint': '显示提示',
                    '🐍 The Legend of Python': '🐍 Python传奇',
                    'Get started learning Python, a beginner friendly programming language and do cool stuff with data.': '开始学习Python，一种对初学者友好的编程语言，并用它处理数据做一些很酷的事情。',
                    '🌐 The Origins Trilogy': '🌐 起源三部曲',
                    'Want to create your own website? Learn the three core technologies that make up the web.': '想要创建自己的网站？学习构成网络的三种核心技术。',
                    '🗺️ All Courses': '🗺️ 所有课程',
                    'Explore more': '探索更多',
                    'Challenge Packs': '代码挑战包',
                    'Practice what you learned with bite-sized code challenges.': '通过小型代码挑战练习您所学的知识。',
                    'Project Tutorials': '项目教程',
                    'Explore fun, step-by-step projects from beginner to advanced.': '探索从初学者到高级的有趣的、循序渐进的项目教程。',
                    '#30NitesOfCode': '#30天编程挑战',
                    'Commit to 30 days of learning and building–while raising a virtual pet!': '承诺30天的学习和构建–同时还能养一个虚拟宠物！',
                    'Builds': '作品',
                    'Create and share code snippets and projects directly in the browser.': '直接在浏览器中创建和分享代码片段和项目。',
                    'New project tutorials': '新项目教程',
                    'See all': '查看所有',
                    'Invite a Friend': '邀请朋友',
                    'Having fun? Share the love with a friend (or two)! <br>Enter an email and we\'ll send them a personal invite 💌': '觉得有趣吗？与朋友分享吧（一个或两个）！<br>输入邮箱，我们会发送给他们一个个人邀请 💌',
                    'Your friend\'s email': '你朋友的邮箱',
                    'Send Invite': '发送邀请',
                    'Jump back in': '回到课程',
                    'Did you know that you can join our': '你知道吗，你可以加入我们的',
                    'Community': '社区',
                    'to get live help from our Code Mentors?': '获取我们代码导师的实时帮助？',
                    'OR': '或者',
                    'Report a bug': '报告Bug',
                    'Comments': '注释',
                    'Congrats!': '恭喜！'
                },

                // 练习页面内容翻译
                exerciseContent: {
                },

                // 添加段落翻译字典
                paragraphs: {
                    'bottom-copy': {
                        pattern: /Start your coding journey with 200\+ hours of interactive programming exercises paired with real-world projects\. Explore for free! ✨/,
                        replacement: '通过200多小时的互动编程练习和真实世界的项目开始您的编程之旅。免费探索！✨'
                    },
                    'need-account': {
                        pattern: /Already have an account\? (.+)Log in(.+)/,
                        replacement: '已经有账号？$1登录$2'
                    }
                }
            };

            // 页面元素选择器配置
            this.selectors = {
                buttons: '.btn-content, button.nes-pointer, button:not([data-translated]), p.nes-pointer:not([data-translated])',
                paragraphs: 'section p:not([data-translated]), section li:not([data-translated])',
                exerciseTitle: 'h1.python-typewriter .AudEo',
                headers: '.header-bar p',
                dialogs: 'dialog p, dialog .heading, dialog button, dialog a',
                successMessages: '.message-container h2',
                promptSpans: '.correct-answer-container span',
                footerTitles: '.row-title p',
                footerLinks: '.links a span.nes-pointer',
                dropdownItems: '.dropdown-item.nes-pointer p',
                typewriterText: 'p.title, h1.python-typewriter span.AudEo',
                hintButton: '.sc-f296b5ac-0 summary .btn-content',
                hintText: '.sc-f296b5ac-0 summary .arrow span',
                helpTitle: '.sc-bb936ad9-0 h3',
                botMessage: '.idle-message-container h2',
                popupTitles: 'dialog .heading',
                itemNames: '.item-name',
                hintContent: '.children',
                userStats: {
                    level: '.level',
                    statText: '.stats .text',
                    rank: '.stats .num',
                    buttons: 'button .btn-content'
                },

                // 添加底部文本选择器
                bottomCopy: '.bottom-copy',

                // 添加课程描述选择器
                courseDescriptions: '.row-copy h3, .row-copy p',

                // 添加特色卡片选择器
                featureSection: {
                    title: '.kVhtKG .title p',
                    cardTitles: '.card-title',
                    cardDescriptions: '.card-description'
                },

                // 添加项目标题选择器 - 注意我们需要精确定位标题内的p元素
                projectSection: {
                    titles: '.title p:not(.all)'
                },

                // 添加邀请朋友组件选择器
                inviteSection: {
                    title: '.copy .title',
                    description: '.copy .description',
                    input: '.input-container input',
                    button: '.input-container .btn-content'
                },

                // 添加独立"回到课程"文本的选择器
                standaloneText: 'div.last-course + div, .last-course + p',

                // 添加提示悬浮窗选择器
                popup: {
                    container: '.popup.nes-container',
                    paragraphs: '.popup.nes-container p',
                    links: '.popup.nes-container a'
                }
            };

            // 添加页面特定翻译映射
            this.pageSpecificTranslations = {
                // Python课程页面
                '/python/01-setting-up': {
                    'Setting Up': '环境设置',
                    'Welcome to the first chapter of The Legend of Python! 🐍': '欢迎来到Python传奇的第一章！🐍',
                    'The programming language we are learning is called': '我们正在学习的编程语言叫做',
                    'created by a developer named': '由一位名叫',
                    'in the early 90s.': '在90年代早期创建的。',
                    'Python is designed to be easy for us to read, which makes it the perfect coding language for beginners.': 'Python被设计成易于阅读的语言，这使它成为初学者的完美编程语言。',
                    'It\'s also super versatile and used in the following:': '它也非常versatile（多功能），并被用于以下领域：',
                    'Data analysis & visualization': '数据分析与可视化',
                    'Artificial intelligence (AI)': '人工智能(AI)',
                    'Machine learning (ML)': '机器学习(ML)',
                    'Web development': '网页开发',
                    'And more!': '以及更多！',
                    'All the code we write in this course will be in Python files, with the': '我们在本课程中编写的所有代码都将保存在Python文件中，使用',
                    'extension. And we write them inside a code editor.': '扩展名。我们在代码编辑器中编写它们。',
                    'A code editor': '一个代码编辑器',
                    'is a text editor where we can write and execute code.': '是一个可以编写和执行代码的文本编辑器。',
                    'There\'s a code editor on the right side, created just for you. 👉': '在右侧有一个专为你创建的代码编辑器。👉',
                    'Let\'s give it a try!': '让我们试一试！',
                    'Instructions': '指导',
                    'Copy and paste this line of code in line 3:': '将这行代码复制并粘贴到第3行：',
                    'And then press the "Run" button and wait 1-2 seconds.': '然后按"运行"按钮并等待1-2秒。',
                    'This should appear in the Terminal window if you did it correctly:': '如果你做对了，终端窗口中应该显示：',
                    'You are now ready for the journey ahead.': '你现在已经准备好迎接前方的旅程了。',
                    'Press the "Check Answer" button and then "Next" to continue.': '按"检查答案"按钮，然后按"下一步"继续。',
                    'Happy coding!': '编程愉快！',
                    'In this exercise, you don\'t have to know what\'s going on with the code. You can just copy and paste.': '在这个练习中，你不需要知道代码是如何工作的。你只需要复制粘贴即可。',

                },
                '/python/02-hello-world': {
                    'Hello World': '你好世界',
                    'In Python, the': '在Python中，',
                    'function is used to tell a computer to "talk." This is something we are going to use': '函数用于告诉计算机"说话"。这是我们将会',
                    'a lot': '经常使用',
                    'The message we want to display should be inside the parentheses and surrounded by quotes. They can be double quotes': '我们想要显示的消息应该在括号内并由引号包围。它们可以是双引号',
                    'or single quotes': '或单引号',
                    ', but the opening and closing quote marks have to be the same.': '，但是开始和结束的引号必须是相同的。',
                    'This is an example of a': '这是一个',
                    'function:': '函数的例子：',
                    'In the example above, we instructed our program to print a message. This resulting text that is printed to the screen is referred to as the': '在上面的例子中，我们指示程序打印一条消息。打印到屏幕上的结果文本被称为',
                    'output': '输出',
                    'The output of this example program would be:': '这个示例程序的输出将是：',
                    'Create a new': '创建一个新的',
                    'program.': '程序。',
                    'On a new line, use': '在新的一行中，使用',
                    'to output the message "Hello World!"': '输出消息"Hello World!"',
                    'And then run the program.': '然后运行程序。',
                    'Were you able to print "Hello World!" in the terminal?': '你能够在终端中打印出"Hello World!"吗？',
                    'To open the emoji picker, you can do:': '要打开表情符号选择器，你可以这样做：'
                    
                },
                '/python/03-pattern': {
                    'Pattern': '模式',
                    'Line by Line': '逐行执行',
                    'Python is run one line at a time, from top to bottom.': 'Python是从上到下一次执行一行代码。',
                    'We can output multiple messages by using multiple': '我们可以使用多个',
                    'functions. For example, if we want to print out two simple greetings:': '函数来输出多条消息。例如，如果我们想打印两个简单的问候语：',
                    'This will output:': '这将输出：',
                    'Now let\'s use what we just learned to complete a special challenge! ⋆˙⟡': '现在让我们使用刚学到的知识来完成一个特殊的挑战！⋆˙⟡',
                    'Instructions': '指导',
                    'Suppose we want the output to look exactly like this pattern below:': '假设我们希望输出看起来完全像下面这个模式：',
                    'How can you do that?': '你该如何做到这一点？',
                    'Create a': '创建一个',
                    'pattern.py': 'pattern.py',
                    'program that prints this pattern exactly as shown.': '程序，打印出与示例完全相同的模式。',
                    'This will likely take some trial and error, but give it a shot!': '这可能需要一些尝试和错误，但值得一试！',
                    'Done with this exercise? Click "Check Answer" to continue!': '完成这个练习了吗？点击"检查答案"继续！',
                    '(ー_ーゞ It\'s a tricky one. Hmmm.': '（ー_ーゞ 这是一个棘手的练习。嗯嗯。',
                    'This is super hard to pull off using just one print() function, but what if you use four print() functions?': '使用一个print()函数很难实现这一点，但如果你使用四个print()函数呢？'
                },
                '/python/04-initials': {
                    'Initials': '首字母',
                    'Comments': '注释',
                    'Comments are very important in programming because they are used to document what our code does. They are also used to disable parts of the program.': '注释在编程中非常重要，因为它们用于记录我们的代码做什么。它们也用于禁用程序的某些部分。',
                    'When the program is run, the comments are ignored.': '当程序运行时，注释会被忽略。',
                    'In Python, we can create a comment using the': '在Python中，我们可以使用',
                    'hashtag symbol:': '井号符号创建注释：',
                    'On the first line, we created a comment. As a result, everything to the right of the hashtag': '在第一行，我们创建了一个注释。因此，井号',
                    'is ignored. The program continues to the next line, and the output is simply:': '右侧的所有内容都被忽略。程序继续执行下一行，输出仅为：',
                    'Python only ignores anything after the': 'Python只忽略',
                    'on a line. So when a comment is placed towards the end of a line:': '在一行中后面的内容。所以当注释放在行尾时：',
                    'Here, the output would still be "Hi" because everything before the comment on the same line will still run.': '这里，输出仍然是"Hi"，因为同一行中注释之前的所有内容仍会运行。',
                    'Create an': '创建一个',
                    'program that displays your initials in': '程序，以',
                    'block letters': '块状字母',
                    'display your initials.': '显示你的首字母缩写。',
                    'First, start the program with a comment that says a fun fact about yourself.': '首先，在程序开头添加一条有关你自己的有趣事实的注释。',
                    'Then, create your block letters with your initials.': '然后，使用你的首字母创建块状字母。',
                    'For example, if your name is Dua Lipa, your initials would be D and L, and your block letters would look like this:': '例如，如果你的名字是Dua Lipa，你的首字母缩写就是D和L，你的块状字母看起来会像这样：',
                    'This will likely need seven print() functions. One for each line.': '这可能需要七个print()函数。每行一个。'
                },
                '/python/05-snail-mail': {
                    'Snail Mail': '蜗牛邮件',
                    'Congrats!': '恭喜！',
                    'Congrats! You\'ve made it to the end of chapter one! 🫶': '恭喜！你已经完成了第一章！🫶',
                    'Here\'s a refresher on what we went over:': '以下是我们学过内容的回顾：',
                    'The': '',
                    'function is used to output messages to the terminal.': '函数用于向终端输出消息。',
                    'Python code runs one line at a time, from top to bottom.': 'Python代码是从上到下一次执行一行。',
                    'are created using the': '是使用',
                    'hashtag symbol.': '井号符号创建的。',
                    'Let\'s try one more thing together!': '让我们再一起尝试一件事！',
                    'Create a blank': '创建一个空白的',
                    'program.': '程序。',
                    'In this exercise, you will write a letter to your future self... in Python.': '在这个练习中，你将用Python给未来的自己写一封信。',
                    'Take a moment and think about what you hope to achieve on this journey.': '花点时间思考一下你希望在这个旅程中实现什么。',
                    'Use': '使用',
                    'to output:': '输出：',
                    'Today\'s date.': '今天的日期。',
                    'How you are feeling right now.': '你现在的感受。',
                    'What you want to accomplish by learning to code.': '你通过学习编程想要实现什么。',
                    'A little message to your older, wiser, and programmer self.': '给你未来那个更老、更明智、已经成为程序员的自己的一条小消息。',
                    'Your favorite emoji to spice things up!': '你最喜欢的表情符号来增添趣味！',
                    'When it\'s done, take a screenshot and click the Twitter icon to post your letter!': '完成后，截图并点击Twitter图标发布你的信！',
                    'P.S. We will return the letter when the time is right. 😊': 'P.S. 我们会在适当的时候归还这封信。😊',
                    'To open the emoji picker:': '打开表情符号选择器：',
                    'Mac:': 'Mac：',
                    'Windows:': 'Windows：',
                    'You can find fellow learners\' letters at': '你可以在',
                    'Footnote: The code block at the top of the page shows a': '脚注：页面顶部的代码块显示了一个',
                    'mysterious slash. The backslash is an escape character; it\'s a fun little trick that allows us to use a single quote in the message without closing it!': '神秘的斜杠。反斜杠是一个转义字符；这是一个有趣的小技巧，允许我们在消息中使用单引号而不会结束字符串！'
                },
                '/python/06-data-types': {
                    'Data Types': '数据类型',
                    'Variables': '变量',
                    'In programming, variables are used for storing data values. Each variable has a name and holds a value. 📦': '在编程中，变量用于存储数据值。每个变量都有一个名称并保存一个值。📦',
                    'The variable name can consist of letters, numbers, and the': '变量名可以由字母、数字和',
                    'underscore.': '下划线组成。',
                    'These are all valid variable names and values:': '以下都是有效的变量名和值：',
                    'The': '',
                    'equal sign means assignment:': '等号表示赋值：',
                    'We\'re assigning the string value': '我们将字符串值',
                    'to the variable': '赋给变量',
                    'We\'re assigning the number value': '我们将数字值',
                    'to the variable': '赋给变量',
                    'We\'re assigning the truth value': '我们将真值',
                    'to the variable': '赋给变量',
                    'We can also change the value of a variable, or print it out:': '我们也可以改变变量的值，或者将其打印出来：',
                    'Here, we are assigning the number value': '在这里，我们将数字值',
                    'to the variable': '赋给变量',
                    'Then, we are reassigning the number value': '然后，我们重新将数字值',
                    'to the same variable. And printing it out.': '赋给同一个变量。并将其打印出来。',
                    'Integer': '整数',
                    'An integer, or': '整数，或者',
                    'is a whole number. It has no decimal point and contains the number 0, positive and negative counting numbers. If we were counting the number of people on the bus or the number of jellybeans in a jar, we would use an integer.': '是一个整数。它没有小数点，包含数字0、正数和负数。如果我们要数公共汽车上的人数或罐子里的糖豆数量，我们会使用整数。',
                    'Float': '浮点数',
                    'A floating-point number, or a float, is a decimal number. It can be used to represent fractions or precise measurements. If you were measuring the length and width of the couch, calculating the test score percentage, or storing a baseball player\'s batting average, we would use a float instead of an int.': '浮点数，或者float，是一个小数。它可以用来表示分数或精确测量值。如果你要测量沙发的长度和宽度，计算测试分数的百分比，或存储棒球运动员的打击率，我们会使用float而不是int。',
                    'String': '字符串',
                    'A string, or': '字符串，或者',
                    'is used for storing text. Strings are wrapped in double quotes': '用于存储文本。字符串被包裹在双引号',
                    'or single quotes': '或单引号',
                    'When we did printing in the first chapter, we printed a string data type.': '在第一章进行打印时，我们打印的是字符串数据类型。',
                    'Boolean': '布尔值',
                    'A Boolean data type, or': '布尔数据类型，或者',
                    'stores a value that can only be either true or false. In Python, it\'s capitalized': '存储的值只能是真或假。在Python中，它被大写为',
                    'It\'s named after the British mathematician': '它以英国数学家',
                    'George Boole': '乔治·布尔',
                    'No instructions in this exercise! You got a freebie. 💫': '本练习没有具体指导！这是个免费赠送的内容。💫',
                    '"Check Answer" and "Next", and go get \'em!': '"检查答案"和"下一页"，然后继续前进吧！',
                    'Don\'t worry if this is confusing right now, we will learn more in the next few exercises.': '如果现在感到困惑也不用担心，我们将在接下来的几个练习中学习更多内容。'
                }
            };
        }

        // 获取合并的翻译字典
        getMergedDictionary() {
            return {
                ...this.dictionaries.exerciseContent,
                ...this.dictionaries.common,
                ...this.getCurrentPageTranslations() // 添加页面特定翻译
            };
        }

        // 添加获取当前页面特定翻译的方法
        getCurrentPageTranslations() {
            // 获取当前页面路径
            const currentPath = window.location.pathname;

            // 检查是否有对应该路径的特定翻译
            if (this.pageSpecificTranslations[currentPath]) {
                return this.pageSpecificTranslations[currentPath];
            }

            // 尝试进行模式匹配，例如所有Python页面可能共享一些翻译
            for (const path in this.pageSpecificTranslations) {
                if (currentPath.includes(path.split('/').filter(p => p.length > 0)[0])) {
                    return this.pageSpecificTranslations[path];
                }
            }

            // 如果没有找到匹配，返回空对象
            return {};
        }

        // 工具方法：只替换元素中的文本节点，保留所有HTML结构和子元素
        replaceTextNodesOnly(element, originalText, translatedText) {
            let found = false;

            // 遍历所有子节点
            Array.from(element.childNodes).forEach(node => {
                // 只处理文本节点
                if (node.nodeType === Node.TEXT_NODE) {
                    const nodeText = node.textContent.trim();
                    // 如果这个文本节点包含我们要翻译的文本
                    if (nodeText === originalText || nodeText.includes(originalText)) {
                        // 替换文本，但保持原有的空白字符
                        node.textContent = node.textContent.replace(originalText, translatedText);
                        found = true;
                    }
                }
            });

            // 如果没有找到匹配的文本节点，但整个元素的文本与原文本匹配
            // 尝试创建相同的HTML结构但替换文本内容
            if (!found && element.textContent.trim() === originalText) {
                // 创建一个临时元素来解析HTML
                const temp = document.createElement('div');
                temp.innerHTML = element.innerHTML;

                // 递归查找并替换temp中的文本节点
                const replaceTextInNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const nodeText = node.textContent.trim();
                        if (nodeText === originalText || nodeText.includes(originalText)) {
                            node.textContent = node.textContent.replace(originalText, translatedText);
                            return true;
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        let replaced = false;
                        Array.from(node.childNodes).forEach(child => {
                            if (replaceTextInNode(child)) {
                                replaced = true;
                            }
                        });
                        return replaced;
                    }
                    return false;
                };

                if (replaceTextInNode(temp)) {
                    // 只有在成功替换了文本的情况下才更新原始元素
                    element.innerHTML = temp.innerHTML;
                }
            }

            return found;
        }

        // 翻译指定元素的文本内容
        translateElementText(element, dictionary) {
            const originalText = element.textContent.trim();

            if (dictionary[originalText]) {
                // 如果元素已经被翻译过，则不再翻译
                if (element.dataset.translated === 'true') {
                    return true;
                }
                
                element.textContent = dictionary[originalText];
                // 标记此元素已被翻译
                element.dataset.translated = 'true';
                return true;
            }

            return false;
        }

        // 翻译HTML内容，处理部分匹配
        translateHtml(element, dictionary) {
            // 如果已经翻译过，跳过
            if (element.dataset.translated === 'true') {
                return true;
            }
            
            const originalHtml = element.innerHTML;
            let updatedHtml = originalHtml;
            let changed = false;

            // 先尝试翻译整个内容
            if (dictionary[element.textContent.trim()]) {
                element.textContent = dictionary[element.textContent.trim()];
                element.dataset.translated = 'true';
                return true;
            }

            // 排序字典键，优先翻译较长的字符串，避免部分匹配问题
            const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

            // 保存代码块和其他HTML元素
            const htmlElements = [];
            let tempHtml = updatedHtml;
            let index = 0;
            
            // 保存所有代码块
            const codeRegex = /<code[^>]*>.*?<\/code>/g;
            let match;
            
            while ((match = codeRegex.exec(tempHtml)) !== null) {
                htmlElements.push(match[0]);
                tempHtml = tempHtml.replace(match[0], `__HTML_ELEMENT_${index}__`);
                index++;
            }

            // 在纯文本上进行翻译
            for (const key of sortedKeys) {
                if (tempHtml.includes(key)) {
                    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    tempHtml = tempHtml.replace(new RegExp(safeKey, 'g'), dictionary[key]);
                    changed = true;
                }
            }

            // 还原HTML元素
            if (changed) {
                for (let i = 0; i < htmlElements.length; i++) {
                    tempHtml = tempHtml.replace(`__HTML_ELEMENT_${i}__`, htmlElements[i]);
                }
                
                element.innerHTML = tempHtml;
                element.dataset.translated = 'true';
            }

            return changed;
        }

        // 翻译按钮文本
        translateButtons() {
            const buttonElements = document.querySelectorAll(this.selectors.buttons);

            buttonElements.forEach(button => {
                const originalText = button.textContent.trim();

                if (this.dictionaries.buttons[originalText]) {
                    const translatedText = this.dictionaries.buttons[originalText];

                    if (button.classList.contains('btn-content')) {
                        const innerSpan = button.querySelector('span');
                        if (innerSpan) {
                            innerSpan.textContent = translatedText;
                        } else {
                            this.replaceTextNodesOnly(button, originalText, translatedText);
                        }
                    } else if (button.classList.contains('nes-pointer')) {
                        this.replaceTextNodesOnly(button, originalText, translatedText);
                    } else {
                        this.replaceTextNodesOnly(button, originalText, translatedText);
                    }
                }
            });
        }

        // 翻译页脚链接
        translateFooterLinks() {
            // 翻译页脚标题
            const rowTitles = document.querySelectorAll(this.selectors.footerTitles);
            rowTitles.forEach(title => {
                this.translateElementText(title, this.dictionaries.footers);
            });

            // 翻译页脚链接
            const footerLinks = document.querySelectorAll(this.selectors.footerLinks);
            footerLinks.forEach(link => {
                this.translateElementText(link, this.dictionaries.footers);
            });
        }

        // 翻译打字效果标题
        translateTypewriterTitles() {
            const titleElements = document.querySelectorAll(this.selectors.typewriterText);
            titleElements.forEach(title => {
                const originalText = title.textContent.trim();
                if (this.dictionaries.typewriter[originalText]) {
                    title.textContent = this.dictionaries.typewriter[originalText];
                    // 对于打字效果的元素，移除typewriter类并设置可见性
                    if (title.classList.contains('typewriter')) {
                        title.classList.remove('typewriter');
                    }
                    title.style.opacity = '1';
                }
            });
        }

        // 翻译下拉菜单
        translateDropdownMenu() {
            const dropdownItems = document.querySelectorAll(this.selectors.dropdownItems);

            dropdownItems.forEach(item => {
                const itemText = item.textContent.trim();

                if (this.dictionaries.dropdown[itemText]) {
                    item.textContent = this.dictionaries.dropdown[itemText];
                } else {
                    const textNodes = Array.from(item.childNodes).filter(node =>
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
                    );

                    textNodes.forEach(textNode => {
                        const originalText = textNode.textContent.trim();
                        if (this.dictionaries.dropdown[originalText]) {
                            textNode.textContent = textNode.textContent.replace(
                                originalText,
                                this.dictionaries.dropdown[originalText]
                            );
                        }
                    });
                }
            });
        }

        // 翻译用户统计信息
        translateUserStats() {
            // 翻译用户等级
            const levelElements = document.querySelectorAll(this.selectors.userStats.level);
            levelElements.forEach(element => {
                const text = element.textContent;
                const match = text.match(/Level (\d+)/);
                if (match) {
                    element.textContent = `等级 ${match[1]}`;
                }
            });

            // 翻译统计项文本
            const statTextElements = document.querySelectorAll(this.selectors.userStats.statText);
            statTextElements.forEach(element => {
                this.translateElementText(element, this.dictionaries.userStats);
            });

            // 翻译段位名称
            const rankElements = document.querySelectorAll(this.selectors.userStats.rank);
            rankElements.forEach(element => {
                this.translateElementText(element, this.dictionaries.userStats);
            });

            // 翻译按钮
            const profileButtons = document.querySelectorAll(this.selectors.userStats.buttons);
            profileButtons.forEach(button => {
                this.translateElementText(button, this.dictionaries.userStats);
            });
        }

        // 翻译课程元数据
        translateCourseMeta() {
            const courseMeta = document.querySelectorAll('.course-meta');

            courseMeta.forEach(meta => {
                // 翻译标签
                const label = meta.querySelector('.label');
                if (label) {
                    this.translateElementText(label, this.dictionaries.courseMeta);
                }

                // 翻译课程名称
                const courseName = meta.querySelector('.course-name');
                if (courseName) {
                    this.translateElementText(courseName, this.dictionaries.courseMeta);
                }

                // 翻译下一个练习提示
                const nextExercise = meta.querySelector('.next-exercise');
                if (nextExercise) {
                    const text = nextExercise.textContent;
                    const match = text.match(/^(Next exercise:)\s+(.+)$/);
                    if (match) {
                        const prefix = match[1];
                        const exerciseName = match[2];

                        const translatedPrefix = this.dictionaries.courseMeta[prefix] || prefix;
                        const translatedName = this.dictionaries.exerciseTitles[exerciseName] || exerciseName;

                        nextExercise.textContent = `${translatedPrefix} ${translatedName}`;
                    }
                }
            });
        }

        // 翻译练习页面
        translateExercisePage() {
            // 翻译页面标题
            const headerBar = document.querySelector(this.selectors.headers);
            if (headerBar) {
                this.translateElementText(headerBar, this.dictionaries.exerciseTitles);
            }

            // 翻译练习标题
            const exerciseTitle = document.querySelector(this.selectors.exerciseTitle);
            if (exerciseTitle) {
                const titleText = exerciseTitle.textContent.trim();
                const match = titleText.match(/(\d+\.\s+)(.+)/);
                if (match && this.dictionaries.exerciseTitles[match[2]]) {
                    exerciseTitle.textContent = match[1] + this.dictionaries.exerciseTitles[match[2]];
                }
            }

            // 翻译段落内容
            const paragraphs = document.querySelectorAll(this.selectors.paragraphs);
            const mergedDict = this.getMergedDictionary();

            paragraphs.forEach(paragraph => {
                // 先尝试完全匹配
                if (!this.translateElementText(paragraph, mergedDict)) {
                    // 然后尝试部分匹配
                    this.translateHtml(paragraph, mergedDict);
                }
            });

            // 翻译提示部分
            const hintButton = document.querySelector(this.selectors.hintButton);
            if (hintButton && hintButton.textContent.includes('Show Hint')) {
                const svgElement = hintButton.querySelector('svg');
                if (svgElement) {
                    const svgHtml = svgElement.outerHTML;
                    hintButton.innerHTML = svgHtml + '显示提示';
                }
            }

            // 翻译获取提示文本
            const hintText = document.querySelector(this.selectors.hintText);
            if (hintText && hintText.textContent.includes('Get a Hint')) {
                hintText.textContent = '获取提示 ';
            }

            // 翻译帮助标题
            const helpTitle = document.querySelector(this.selectors.helpTitle);
            if (helpTitle && helpTitle.textContent === 'Help') {
                helpTitle.textContent = '帮助';
            }

            // 翻译机器人消息
            const botMessage = document.querySelector(this.selectors.botMessage);
            if (botMessage) {
                this.translateElementText(botMessage, mergedDict);
            }

            // 翻译提示内容
            this.translateHintContent();

            // 翻译弹窗内容
            this.translateDialogs();
        }

        // 翻译弹窗内容
        translateDialogs() {
            const mergedDict = this.getMergedDictionary();

            // 翻译弹窗标题
            const popupTitles = document.querySelectorAll(this.selectors.popupTitles);
            popupTitles.forEach(title => {
                this.translateElementText(title, mergedDict);
            });

            // 翻译物品名称
            const itemNames = document.querySelectorAll(this.selectors.itemNames);
            itemNames.forEach(item => {
                if (item.childNodes.length > 0) {
                    const itemText = item.childNodes[0].textContent.trim();
                    if (mergedDict[itemText]) {
                        item.childNodes[0].textContent = mergedDict[itemText] + ' ';
                    }
                }
            });

            // 翻译弹窗描述
            const dialogTexts = document.querySelectorAll(this.selectors.dialogs);
            dialogTexts.forEach(element => {
                this.translateHtml(element, mergedDict);
            });
        }

        // 翻译成功消息
        translateSuccessMessages() {
            // 翻译成功消息标题
            const successTitle = document.querySelector(this.selectors.successMessages);
            if (successTitle) {
                this.translateElementText(successTitle, this.dictionaries.common);
            }

            // 翻译提示信息
            const promptSpan = document.querySelector(this.selectors.promptSpans);
            if (promptSpan) {
                const originalText = promptSpan.innerHTML;

                if (originalText.includes('<strong>Next</strong>')) {
                    promptSpan.innerHTML = originalText
                        .replace('Press', this.dictionaries.common['Press'])
                        .replace('<strong>Next</strong>', `<strong>${this.dictionaries.buttons['Next']}</strong>`)
                        .replace('to continue', this.dictionaries.common['to continue']);
                } else {
                    this.translateHtml(promptSpan, this.dictionaries.common);
                }
            }
        }

        // 添加一个专门的方法来处理h2标题元素
        translateSectionHeadings() {
            // 找到所有h1-h6标题
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const mergedDict = this.getMergedDictionary();
            
            headings.forEach(heading => {
                // 避免重复翻译
                if (heading.dataset.translated === 'true') return;
                
                // 检查标题ID
                if (heading.id === 'instructions') {
                    // 处理Instructions标题
                    const textNodes = Array.from(heading.childNodes).filter(node => 
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Instructions'
                    );
                    
                    if (textNodes.length > 0) {
                        textNodes.forEach(node => {
                            node.textContent = node.textContent.replace('Instructions', '指导');
                        });
                        heading.dataset.translated = 'true';
                        this.log('翻译标题: Instructions -> 指导');
                    } else {
                        const originalHTML = heading.innerHTML;
                        const newHTML = originalHTML.replace(/>(\s*)Instructions(\s*)</g, '>$1指导$2<');
                        heading.innerHTML = newHTML;
                        heading.dataset.translated = 'true';
                        this.log('通过HTML替换翻译标题: Instructions -> 指导');
                    }
                } else if (heading.id === 'data-types' || heading.id === 'variables' || 
                          heading.id === 'integer' || heading.id === 'float' || 
                          heading.id === 'string' || heading.id === 'boolean') {
                    // 处理数据类型相关标题
                    // 获取文本节点
                    const textNodes = Array.from(heading.childNodes).filter(node => 
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
                    );
                    
                    textNodes.forEach(node => {
                        const originalText = node.textContent.trim();
                        if (mergedDict[originalText]) {
                            node.textContent = node.textContent.replace(originalText, mergedDict[originalText]);
                        }
                    });
                } else {
                    // 处理其他标题
                    const headingText = heading.textContent.trim();
                    if (mergedDict[headingText] && !heading.dataset.translated) {
                        // 检查是否有特殊结构
                        const hasAnchor = heading.querySelector('a');
                        if (hasAnchor) {
                            // 如果标题包含锚链接，需要进行特殊处理
                            const textNodes = Array.from(heading.childNodes).filter(node => 
                                node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
                            );
                            
                            textNodes.forEach(node => {
                                const originalText = node.textContent.trim();
                                if (mergedDict[originalText]) {
                                    node.textContent = node.textContent.replace(originalText, mergedDict[originalText]);
                                }
                            });
                        } else {
                            // 简单标题直接替换
                            heading.textContent = mergedDict[headingText];
                        }
                        heading.dataset.translated = 'true';
                        this.log(`翻译标题: ${headingText} -> ${mergedDict[headingText]}`);
                    }
                }
            });
        }

        // 定期执行翻译
        setupTranslationRetries() {
            // 立即执行一次翻译
            this.translateAll();

            // 500ms后再次执行，捕获可能的延迟加载内容
            setTimeout(() => this.translateAll(), 500);

            // 1.5秒后再执行一次，确保大部分内容都已加载
            setTimeout(() => this.translateAll(), 1500);

            // 减少翻译频率，从30秒改为2分钟
            setInterval(() => this.translateAll(), 120000);

            // 设置DOM变化监听
            this.setupMutationObserver();
            
            // 添加页面导航监听，在页面切换时执行翻译
            window.addEventListener('popstate', () => setTimeout(() => this.translateAll(), 300));
        }

        // 设置DOM变化监听
        setupMutationObserver() {
            // 添加一个标志来防止重复翻译
            let translationInProgress = false;
            
            const observer = new MutationObserver((mutations) => {
                // 如果已有翻译正在进行，则跳过
                if (translationInProgress) return;
                
                // 检查是否有重要的DOM变化
                let needsTranslation = false;

                mutations.forEach(mutation => {
                    // 如果添加了节点或修改了文本内容
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        // 检查这些变化是否由我们自己的翻译操作引起
                        let isSelfCaused = false;
                        if (mutation.type === 'childList') {
                            // 检查添加的节点是否含有我们插入的标记
                            for (let i = 0; i < mutation.addedNodes.length; i++) {
                                const node = mutation.addedNodes[i];
                                if (node.nodeType === Node.ELEMENT_NODE && 
                                    (node.dataset && node.dataset.translated === 'true')) {
                                    isSelfCaused = true;
                                    break;
                                }
                            }
                        }
                        
                        if (!isSelfCaused) {
                            needsTranslation = true;
                        }
                    }
                });

                // 只在需要时执行翻译
                if (needsTranslation) {
                    translationInProgress = true;
                    // 增加延迟，避免过于频繁的翻译
                    setTimeout(() => {
                        this.translateAll();
                        translationInProgress = false;
                    }, 300);
                }
            });

            // 使用更合理的配置观察DOM变化
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true
            });
        }

        // 翻译所有内容
        translateAll() {
            this.log('开始执行全面翻译');
            // 添加防抖动机制
            if (this._translateAllTimeout) {
                clearTimeout(this._translateAllTimeout);
            }
            
            this._translateAllTimeout = setTimeout(() => {
                // 添加新的翻译方法调用（放在最前面，确保先处理标题）
                this.translateSectionHeadings();
                
                // 原有的翻译方法调用
                this.translateButtons();
                this.translateFooterLinks();
                this.translateTypewriterTitles();
                this.translateDropdownMenu();
                this.translateParagraphs();
                this.translateCourseDescriptions();
                this.translateFeatureCards();
                this.translateProjectTitles();
                this.translateInviteComponent();
                this.translateStandaloneText();
                this.translatePopup();

                // 翻译用户相关内容
                this.translateUserStats();

                // 翻译课程相关内容
                this.translateCourseMeta();

                // 翻译练习页面
                this.translateExercisePage();

                // 翻译成功消息
                this.translateSuccessMessages();
                
                this._translateAllTimeout = null;
            }, 50);
            this.log('翻译完成');
        }

        // 检查打字效果并翻译
        setupTypewriterMonitoring() {
            // 初始执行
            this.translateTypewriterTitles();

            // 每500毫秒检查一次，总共检查10次
            let checkCount = 0;
            const interval = setInterval(() => {
                this.translateTypewriterTitles();
                checkCount++;
                if (checkCount >= 10) {
                    clearInterval(interval);
                }
            }, 500);
        }

        // 添加一个专门翻译段落文本的方法
        translateParagraphs() {
            // 遍历所有配置的段落类型
            for (const [className, config] of Object.entries(this.dictionaries.paragraphs)) {
                // 查找对应class的元素
                const elements = document.getElementsByClassName(className);

                Array.from(elements).forEach(element => {
                    // 保存原始HTML以保留链接等结构
                    const originalHtml = element.innerHTML;
                    // 使用正则表达式进行替换
                    if (config.pattern.test(originalHtml)) {
                        element.innerHTML = originalHtml.replace(
                            config.pattern,
                            config.replacement
                        );
                    }
                });
            }

            // 直接查找并翻译底部文本
            const bottomCopyElement = document.querySelector(this.selectors.bottomCopy);
            if (bottomCopyElement) {
                const text = bottomCopyElement.textContent;
                if (text.includes('Start your coding journey with 200+ hours')) {
                    bottomCopyElement.textContent = '通过200多小时的互动编程练习和真实世界的项目开始您的编程之旅。免费探索！✨';
                }
            }
        }

        // 添加专门的课程描述翻译方法
        translateCourseDescriptions() {
            // 查找所有课程描述容器
            const courseDescriptionElements = document.querySelectorAll(this.selectors.courseDescriptions);
            const mergedDict = this.getMergedDictionary();

            courseDescriptionElements.forEach(element => {
                // 尝试直接匹配文本
                if (!this.translateElementText(element, mergedDict)) {
                    // 如果没有直接匹配，尝试部分匹配
                    this.translateHtml(element, mergedDict);
                }
            });

            // 另一种方式: 直接查找课程卡片
            const courseRows = document.querySelectorAll('.row-copy');

            courseRows.forEach(row => {
                // 翻译标题
                const title = row.querySelector('h3');
                if (title) {
                    this.translateElementText(title, mergedDict);
                }

                // 翻译描述
                const description = row.querySelector('p');
                if (description) {
                    this.translateElementText(description, mergedDict);
                }
            });
        }

        // 添加专门翻译特色卡片的方法
        translateFeatureCards() {
            const mergedDict = this.getMergedDictionary();

            // 翻译标题
            const titleElement = document.querySelector(this.selectors.featureSection.title);
            if (titleElement) {
                this.translateElementText(titleElement, mergedDict);
            }

            // 翻译卡片标题
            const cardTitles = document.querySelectorAll(this.selectors.featureSection.cardTitles);
            cardTitles.forEach(title => {
                this.translateElementText(title, mergedDict);
            });

            // 翻译卡片描述
            const cardDescriptions = document.querySelectorAll(this.selectors.featureSection.cardDescriptions);
            cardDescriptions.forEach(description => {
                this.translateElementText(description, mergedDict);
            });
        }

        // 添加专门翻译项目标题的方法
        translateProjectTitles() {
            const mergedDict = this.getMergedDictionary();

            // 翻译项目标题
            const titleElements = document.querySelectorAll(this.selectors.projectSection.titles);
            titleElements.forEach(title => {
                this.translateElementText(title, mergedDict);
            });
        }

        // 添加专门翻译邀请组件的方法
        translateInviteComponent() {
            const mergedDict = this.getMergedDictionary();

            // 翻译标题
            const titleElement = document.querySelector(this.selectors.inviteSection.title);
            if (titleElement) {
                this.translateElementText(titleElement, mergedDict);
            }

            // 翻译描述
            const descriptionElement = document.querySelector(this.selectors.inviteSection.description);
            if (descriptionElement) {
                this.translateHtml(descriptionElement, mergedDict);
            }

            // 翻译输入框占位符
            const inputElement = document.querySelector(this.selectors.inviteSection.input);
            if (inputElement && inputElement.placeholder) {
                if (mergedDict[inputElement.placeholder]) {
                    inputElement.placeholder = mergedDict[inputElement.placeholder];
                }
            }

            // 翻译按钮
            const buttonElement = document.querySelector(this.selectors.inviteSection.button);
            if (buttonElement) {
                this.translateElementText(buttonElement, mergedDict);
            }
        }

        // 添加专门翻译独立文本的方法
        translateStandaloneText() {
            const mergedDict = this.getMergedDictionary();

            // 查找独立的"Jump back in"文本
            const standaloneElements = document.querySelectorAll(this.selectors.standaloneText);
            standaloneElements.forEach(element => {
                if (element.textContent.trim() === 'Jump back in') {
                    element.textContent = mergedDict['Jump back in'] || '回到课程';
                }
            });

            // 另一种查找方式：根据内容直接查找
            const allParagraphs = document.querySelectorAll('p, div');
            allParagraphs.forEach(element => {
                if (element.textContent.trim() === 'Jump back in') {
                    element.textContent = mergedDict['Jump back in'] || '回到课程';
                }
            });
        }

        // 添加专门翻译悬浮窗的方法
        translatePopup() {
            const mergedDict = this.getMergedDictionary();

            // 查找悬浮窗内所有段落
            const popupParagraphs = document.querySelectorAll(this.selectors.popup.paragraphs);
            popupParagraphs.forEach(paragraph => {
                // 翻译段落文本，先尝试完全匹配
                if (!this.translateElementText(paragraph, mergedDict)) {
                    // 再尝试部分匹配
                    this.translateHtml(paragraph, mergedDict);
                }
            });

            // 翻译链接文本
            const popupLinks = document.querySelectorAll(this.selectors.popup.links);
            popupLinks.forEach(link => {
                // 对于"Community"这样的短文本进行直接匹配
                this.translateElementText(link, mergedDict);

                // 对于"Report a bug"这样的文本，可能需要特殊处理
                if (link.textContent.trim() === 'Report a bug') {
                    link.textContent = mergedDict['Report a bug'] || '报告Bug';
                }
            });
        }

        // 改进提示内容翻译方法
        translateHintContent() {
            const mergedDict = this.getMergedDictionary();
            
            // 查找所有提示内容
            const hintContainers = document.querySelectorAll('.children');
            
            hintContainers.forEach(container => {
                // 如果已翻译，跳过
                if (container.dataset.translated === 'true') return;
                
                // 查找容器内的段落
                const paragraphs = container.querySelectorAll('p');
                
                paragraphs.forEach(paragraph => {
                    // 先保存所有代码块、链接和其他HTML元素
                    const htmlElements = [];
                    let tempHtml = paragraph.innerHTML;
                    
                    // 保存代码块
                    const codeRegex = /<code[^>]*>.*?<\/code>/g;
                    let match;
                    let index = 0;
                    
                    while ((match = codeRegex.exec(tempHtml)) !== null) {
                        htmlElements.push(match[0]);
                        tempHtml = tempHtml.replace(match[0], `__HTML_ELEMENT_${index}__`);
                        index++;
                    }
                    
                    // 保存其他HTML元素，如链接等
                    const elementRegex = /<[^>]+>.*?<\/[^>]+>/g;
                    while ((match = elementRegex.exec(tempHtml)) !== null) {
                        // 确保这不是已经替换过的代码块占位符
                        if (!match[0].includes('__HTML_ELEMENT_')) {
                            htmlElements.push(match[0]);
                            tempHtml = tempHtml.replace(match[0], `__HTML_ELEMENT_${index}__`);
                            index++;
                        }
                    }
                    
                    // 尝试翻译纯文本内容
                    for (const [original, translated] of Object.entries(mergedDict)) {
                        if (tempHtml.includes(original)) {
                            tempHtml = tempHtml.replace(
                                new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                                translated
                            );
                        }
                    }
                    
                    // 还原HTML元素
                    for (let i = 0; i < htmlElements.length; i++) {
                        tempHtml = tempHtml.replace(`__HTML_ELEMENT_${i}__`, htmlElements[i]);
                    }
                    
                    paragraph.innerHTML = tempHtml;
                });
                
                // 标记容器已翻译
                container.dataset.translated = 'true';
            });
        }

        // 添加日志方法
        log(message) {
            if (this.debug) {
                console.log(`[中文翻译] ${message}`);
            }
        }
    }

    // 创建翻译管理器实例
    const translator = new TranslationManager();

    // 页面加载完成后进行初始化
    document.addEventListener('DOMContentLoaded', () => {
        translator.setupTranslationRetries();
        translator.setupTypewriterMonitoring();
    });

    // 如果DOMContentLoaded已经触发，直接初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            translator.setupTranslationRetries();
            translator.setupTypewriterMonitoring();
        });
    } else {
        // 已经加载完毕，直接执行
        translator.setupTranslationRetries();
        translator.setupTypewriterMonitoring();
    }

    // 确保在所有资源加载后也执行一次翻译
    window.addEventListener('load', () => translator.translateAll());
})(); // ==UserScript==