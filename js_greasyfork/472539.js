// ==UserScript==
// @name         Typing Practice界面汉化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  汉化Typing Practice打字页面,网址https://www.keybr.com/
// @author       低山
// @match        https://www.keybr.com/*
// @icon         https://www.keybr.com/assets/a4de433bd238eb45.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472539/Typing%20Practice%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/472539/Typing%20Practice%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    let timeout = 500;//调整页面刷新时间，每次最好加100

    setTimeout(main, timeout);

    function main() {

        sidebar();

        const currentUrl = window.location.href;

        if (currentUrl === 'https://www.keybr.com/') {
            settingButton();
            mainData();
        } else if (currentUrl === 'https://www.keybr.com/profile') {
            profileData();
            mainData();
        } else if (currentUrl === 'https://www.keybr.com/typing-test') {
            settingButton();
            typingTest();
        } else if (currentUrl === 'https://www.keybr.com/help') {
            help();
        } else if (currentUrl === 'https://www.keybr.com/high-scores') {
            highScores();
        } else if (currentUrl === 'https://www.keybr.com/multiplayer') {
            multiPlayer();
            //setTimeout(multiPlayer, timeout);
        } else if (currentUrl === 'https://www.keybr.com/layouts') {
            layouts();
        } else if (currentUrl === 'https://www.keybr.com/text-tools') {
            textTools();
        } else if (currentUrl === 'https://www.keybr.com/account') {
            account();
        }


    }

    function sidebar(){
        //汉化侧边栏
        const mainSpanElement = document.getElementsByClassName('lVX4wJNzzy');
        mainSpanElement[0].innerHTML = '练习';
        mainSpanElement[1].innerHTML = '统计';
        mainSpanElement[2].innerHTML = '打字测试';
        mainSpanElement[3].innerHTML = '帮助';
        mainSpanElement[4].innerHTML = '排行榜';
        mainSpanElement[5].innerHTML = '多人游戏';
        mainSpanElement[6].innerHTML = '布局';
        mainSpanElement[7].innerHTML = '文本工具';

        //汉化登录按钮
        document.getElementsByClassName('cU6A3976KW')[0].innerHTML = '登录';
    }

    function settingButton(){
        //汉化设置按钮文本
        document.getElementsByClassName('q0cDWjdhfy ehGdExnozv')[0].innerHTML = '⚙️ 更改设置...';
    }

    function mainData(){
        //汉化主页面数据栏
        const mainArray = document.getElementsByClassName('ETt7IjOtGk');
        mainArray[0].innerHTML = '打字速度:';
        mainArray[1].innerHTML = '准确性:';
        mainArray[2].innerHTML = '分数:';
        mainArray[3].innerHTML = '所有按键:';
        mainArray[4].innerHTML = '不熟悉键:';
        mainArray[5].innerHTML = '平均打字速度:';
        mainArray[6].innerHTML = '最快打字速度:';
        mainArray[7].innerHTML = '准确度:';
        mainArray[8].innerHTML = '每日目标:';
    }

    function profileData(){
        //汉化配置页面
        document.querySelectorAll("h1")[0].innerHTML = '我的统计';

        const proH2Array = document.querySelectorAll("h2");
        proH2Array[0].innerHTML = '全局统计';
        proH2Array[1].innerHTML = '今日统计';
        proH2Array[2].innerHTML = '自我比较';

        document.getElementsByClassName('jxPD1tJQrY')[0].innerHTML = '低山高梧桐 汉化  ❣️  在这里面切换课程';

        const proPArray = document.querySelectorAll('p');
        proPArray[0].innerHTML = '这是一个包含有关您的学习进度的详细统计信息的页面。您完成的课程越多，这些统计数据就越详细和准确。';
        document.getElementsByClassName('ulmcn1WjF4')[0].innerHTML = '展示选中课程统计信息:';
        proPArray[4].innerHTML = '您的最高历史速度击败了 '+ document.getElementsByClassName('UKglR8wTTT')[0].textContent +' 的人';
        proPArray[5].innerHTML = '您的平均历史速度击败了 '+ document.getElementsByClassName('UKglR8wTTT')[0].textContent +' 的人';
        proPArray[6].innerHTML = '您在所有用户中打字速度的相对区间。';
        proPArray[7].innerHTML = '查看您相对于其他用户的打字速度。标准越高，以该速度打字的人就越多。您的位置用彩色垂直线标记。';
        proPArray[8].innerHTML = '该图表显示所有键位的学习情况概述。';
        proPArray[9].innerHTML = 'y轴：键位。x轴：每个按键的打字速度  🟥-慢 🟩-快';
        proPArray[10].innerHTML = '该图表表示全局打字速度随时间变化情况。';
        document.getElementsByClassName('VpZ_UHSOd7')[2].innerHTML = 'y轴：打字速度。x轴：时间  🟩-打字速度 🟥-打字精准度 🟪-课程中的按键数';
        proPArray[13].innerHTML = '此图表显示每个键的键入速度变化。';
        document.getElementsByClassName('VpZ_UHSOd7')[3].innerHTML = 'y轴：打字速度。x轴：课程数目  🟩-当前所选键的键入速度';
        proPArray[18].innerHTML = '此图表显示每个键的平均键入速度。';
        proPArray[19].innerHTML = '此图表显示相对键位频率。';
        document.getElementsByClassName('VpZ_UHSOd7')[4].innerHTML = '条形图颜色  🟩-命中数 🟥-未命中数 🟪-未命中/命中率（相对未命中频率）';
        proPArray[21].innerHTML = '此图表以热图的形式显示相对关键频率。';
        proPArray[22].innerHTML = '此日历显示主动学习的日期。';

        const staArray = document.getElementsByClassName("AABHJK7Kdv");
        staArray[0].innerHTML = '总时间';
        staArray[1].innerHTML = '课程数目';
        staArray[2].innerHTML = '最高速度:';
        staArray[3].innerHTML = '平均速度:';
        staArray[4].innerHTML = '总时间';
        staArray[5].innerHTML = '课程数目';
        staArray[6].innerHTML = '最高速度:';
        staArray[7].innerHTML = '平均速度:';

        const imgArray =  document.getElementsByClassName('jOK9USeKgC');
        imgArray[0].innerHTML = '相对打字速度'
        imgArray[1].innerHTML = '学习情况概述'
        imgArray[2].innerHTML = '打字速度'
        imgArray[3].innerHTML = '单键打字概述'
        imgArray[4].innerHTML = '按键输入速度直方图'
        imgArray[5].innerHTML = '按键频率直方图'
        imgArray[6].innerHTML = '按键频率热图'
        imgArray[7].innerHTML = '练习日历'

    }

    function typingTest(){
        //汉化打字测试页面
        document.querySelectorAll("span")[1].innerHTML = '测试持续时间(规格):';
    }

    function help(){
        document.querySelectorAll("h1")[0].innerHTML = '学习更快地打字';

        const helpH2Array =  document.querySelectorAll("h2");
        helpH2Array[0].innerHTML = '触摸打字';
        helpH2Array[1].innerHTML = '教学方法';
        helpH2Array[2].innerHTML = '单词生成算法';
        helpH2Array[3].innerHTML = '使用键盘的正确方法';
        helpH2Array[4].innerHTML = '此网页的有效性';

        const helpH3Array =  document.querySelectorAll("h3");
        helpH3Array[1].innerHTML = '算法以首字母开头';
        helpH3Array[3].innerHTML = '你学习的首字母';
        helpH3Array[5].innerHTML = '算法添加更多字母';
        helpH3Array[7].innerHTML = '您学习其他字母';
        helpH3Array[9].innerHTML = '循环重复';

        const helpPArray = document.querySelectorAll("p");
        helpPArray[0].innerHTML = '此Web应用程序将帮助您学习盲打，这意味着通过肌肉记忆打字，而无需使用视力找到键盘上的键。它可以显着提高您的打字速度和准确性。相反的是一指禅打字，这是一种初学者的打字方法，您看着键盘而不是屏幕，只使用食指。';
        helpPArray[1].innerHTML = '此应用程序使用独特的方法。它采用统计数据和智能算法来自动创建与您当前技能水平相匹配的打字课程。它通过重复以下循环来工作：';
        helpPArray[2].innerHTML = '在每个阶段，您只需键入提供的单词列表，其余的工作由计算机完成。';
        helpPArray[3].innerHTML = '此应用程序使用母语的语音规则生成随机但可读和可发音的单词。这些词看起来几乎是自然的，而且经常是。键入合理的文本比重复随机字母要容易得多，它可以帮助您记住频繁的组合键。最新一点至关重要。例如，在英语中，字母“W”几乎不可能跟在“Z”后面，并且您永远不会在此应用程序中键入这样的组合。相反，您将键入更常见的单词，例如“the”，“that”，“with”等。很快，您将学习如何非常快速地键入“th”组合。';
        helpPArray[4].innerHTML = '单词是从使用以下规则选择的字母生成的。';
        helpPArray[5].innerHTML = '当你第一次开始练习时，计算机对你的打字技巧一无所知，所以它使用一小组最常见的字母来生成单词，如“E”、“N”、“I”、“T”、“R”和“L”。所有生成的单词都将由这个小字母集组成，其余字母未使用。由于字母的统计数据未知，相应的指标为灰色。';
        helpPArray[6].innerHTML = '当您开始键入生成的单词时，计算机会收集您的键入统计信息。指示灯开始将其颜色从红色变为绿色。红色表示单个键的键入速度较慢，绿色表示相反。在这个阶段，你的目标是通过提高你的打字速度，使所有的字母都变绿。请注意，在此示例中，字母“T”突出显示，因为它的打字速度指标最差，因此它成为目标字母。目标字母包含在每个生成的单词中，这是需要了解的关键信息。这意味着在任何给定时间，您都在练习给您带来最大麻烦的确切键。';
        helpPArray[7].innerHTML = '当您的打字速度提高，并且所有字母最终变为绿色时，一个新的字母“S”将添加到集合中。随机单词将从这组新的扩展字母中生成。字母“S”是目标字母，出现在每个生成的单词中。同样，此字母的指示器颜色为灰色，因为它的键入统计信息未知。';
        helpPArray[8].innerHTML = '在这一步中，你的目标是使这个新字母变绿，当这种情况发生时，另一个字母被添加到集合中，循环继续。实际上，前面字母的打字速度很可能会降低，并且您会看到它们再次变为红色，如示例中所示。这是意料之中的，你的目标还是一样，让新的目标字母变绿，解锁下一个。';
        helpPArray[9].innerHTML = '如果你足够坚持，迟早所有的字母都会变成绿色。恭喜，您已经实现了主要目标！但是，这并不意味着您应该停止学习，您可以根据需要继续学习。';
        helpPArray[10].innerHTML = '以下图例给出了每种指标颜色的确切含义。';
        helpPArray[11].innerHTML = '将所有手指放在主行上，即包含大写锁定键的那一行。键“F”和“J”上有小凸起，将食指放在凸起上。每个手指负责自己的一组键，如下图所示。';
        helpPArray[12].innerHTML = '我们选择了一些示例配置文件来向您展示人们在使用此应用程序时在学习触摸打字方面的进展。这些是真实的、匿名的用户配置文件。希望他们能激励你继续学习！';

        const helpLiArray =  document.querySelectorAll("li");
        helpLiArray[0].innerHTML = '该算法会根据您的打字技巧为您生成一个随机单词列表。您的技能水平是使用到目前为止收集的打字统计数据来衡量的。这些单词由算法选择的一组字母组成。';
        helpLiArray[1].innerHTML = '您键入给定的单词。你尽量少犯错误。';
        helpLiArray[2].innerHTML = '键入时，算法会收集键入统计信息，例如每个键的键入时间指标。最后，这些统计信息用于生成第一步的下一个单词列表。';
        helpLiArray[3].innerHTML = '⬜ 具有未知置信度的未校准密钥。您尚未按下此键。';
        helpLiArray[4].innerHTML = '🟥 具有最低置信度的校准密钥。按此键的次数越多，此指标就越准确。';
        helpLiArray[5].innerHTML = '🟩 具有最高置信度的校准密钥。按此键的次数越多，此指标就越准确。';
        helpLiArray[6].innerHTML = '🟫 具有提升频率的键。找到此键花费的时间最多，因此算法选择将其包含在每个生成的单词中。';
        helpLiArray[7].innerHTML = '手动包含在课程中的密钥。';
        helpLiArray[8].innerHTML = '课程中尚未包含的密钥。';
    }

    function highScores(){
        document.querySelectorAll("h1")[0].innerHTML = '排行榜';
        document.querySelectorAll("p")[0].innerHTML = '最近几天最快的用户排行榜，按他们的分数从最好到最差排列。打字分数是根据打字速度、文本长度、文本中不同字符的数量和错误数来衡量的。该公式的设计方式是为了奖励更快的速度、更长的文本和更大的字母表，但要惩罚错误的数量。';
        const thArray = document.querySelectorAll("th");
        thArray[1].innerHTML = '用户';
        thArray[2].innerHTML = '打字速度';
        thArray[3].innerHTML = '分数';
    }

    function multiPlayer(){
        document.getElementsByClassName('GD1wnGAiZo AQRUNFqgS4')[0] = '在这个在线多人游戏中与其他玩家竞争。你打字越快，你的车开得越快。尽可能快地输入以赢得比赛！';
    }

    function layouts(){
        const layH2Array = document.querySelectorAll("h2");
        layH2Array[0].innerHTML = 'US 经典布局'
        layH2Array[1].innerHTML = 'US Dvorak布局'
        layH2Array[2].innerHTML = 'US Colemak布局'
        layH2Array[3].innerHTML = 'US Workman布局'

        const layPArray = document.querySelectorAll("P");
        layPArray[1].innerHTML = '这一切都始于 1860 年代。密尔沃基的业余发明家、政治家、印刷商和报人克里斯托弗·莱瑟姆·肖尔斯（Christopher Latham Sholes）经常利用业余时间修补和创造新机器，以提高他的业务效率。'
        layPArray[2].innerHTML = '流行的理论指出，肖尔斯不得不重新设计键盘以应对早期打字机的机械故障。连接钥匙和信牌的文字条在纸下面循环悬挂。如果用户快速键入一系列字母，其类型条彼此靠近，则精密的机器将被卡住。'
        layPArray[3].innerHTML = '肖尔斯重新设计了排列方式，以分离最常见的字母序列，如“th”或“he”。该机器于1875年由纽约的武器制造商雷明顿父子公司获得许可生产。这台机器被命名为雷明顿1号，是一次商业失败，未能大量销售。'
        layPArray[4].innerHTML = '在收到反馈后，雷明顿公司更新了机器，以制造雷明顿2号。这台新机器于 1877 年发布，并取得了巨大的成功。它是第一个使用我们今天所知的QWERTY键盘布局，为用户提供了键入大写和小写字母的选项，通过使用“Shift”键在两者之间移动。'
        layPArray[5].innerHTML = '经典的QWERTY键盘布局是一个不幸的历史事故，并不是最佳的，这就是发明其他布局的原因。'
        layPArray[6].innerHTML = '此图表以热图的形式显示相对关键频率。'
        layPArray[8].innerHTML = '德沃夏克是1936年由奥古斯特·德沃夏克和威廉·迪利创建的英语键盘布局。它被设计为QWERTY布局的更快，更符合人体工程学的替代方案。德沃夏克的支持者声称，与QWERTY相比，它需要更少的手指运动，从而减少错误，提高打字速度，减少重复性劳损，并提供更舒适的体验。'
        layPArray[9].innerHTML = '然而，它未能取代QWERTY成为最常见的键盘布局，主要是由于QWERTY在60年前被引入。'
        layPArray[10].innerHTML = '截至2005年，世界纪录中最快的英语打字员是芭芭拉·布莱克本（Barbara Blackburn）使用德沃夏克键盘布局创造的。'
        layPArray[11].innerHTML = '几乎所有主要的现代操作系统都允许用户切换到 Dvorak 布局，并且您的操作系统也很有可能支持它。'
        layPArray[12].innerHTML = '此图表以热图的形式显示相对关键频率。'
        layPArray[14].innerHTML = 'Colemak布局旨在成为Qwerty和Dvorak键盘布局的实用替代品，为已经习惯标准布局的用户提供了更渐进的更改。'
        layPArray[15].innerHTML = 'Colemak布局以QWERTY布局为基础设计，改变了17个键的位置，同时保留了大多数非字母字符和许多流行的键盘快捷键的QWERTY位置。这使得已经输入QWERTY的人更容易学习。它与德沃夏克布局有几个共同的设计目标，例如最小化手指路径距离和大量使用主排。'
        layPArray[16].innerHTML = '它受到许多主要现代操作系统的支持。'
        layPArray[17].innerHTML = '此图表以热图的形式显示相对关键频率。'
        layPArray[19].innerHTML = 'Workman布局减少了手指和手腕的横向移动，使左右手的使用更加平衡。21 个字符与 Qwerty 不同。'
        layPArray[20].innerHTML = 'Workman 布局提供了许多好处。它舒适、符合人体工程学且高效，经常将按键放置在手指的自然运动范围内。手指和手腕的横向移动需求减少。整体手指行程也非常低。'
        layPArray[21].innerHTML = '发现Workman布局在英语中实现的手指行程距离甚至比Colemak还要短。然而，它通常会产生更高的同指 n 克频率;或者换句话说，与其他布局相比，一根手指需要连续敲击两个键的频率更高。'
        layPArray[22].innerHTML = '此图表以热图的形式显示相对关键频率。'
    }

    function textTools(){
        document.querySelectorAll("h1")[0].innerHTML = '文本工具';
        document.querySelectorAll("p")[0].innerHTML = '计算文本中的字符和单词。找出最常见的单词是什么。测量键入阅读这些单词所花费的时间。';

        const textArray =  document.getElementsByClassName('ETt7IjOtGk');
        textArray[0].innerHTML = '带空格的字符:'
        textArray[1].innerHTML = '不包括空格的字符:'
        textArray[2].innerHTML = '所有单词:'
        textArray[3].innerHTML = '独特的词:'
        textArray[4].innerHTML = '平均字长:'
        textArray[5].innerHTML = '前 15 个最常见的词:'
        textArray[6].innerHTML = '在 40 WPM 的平均打字速度下，这将需要 '+ document.getElementsByClassName('UKglR8wTTT')[20].textContent +' 以键入此文本。'
        textArray[7].innerHTML = '在 300 WPM 的平均读取速度下，需要 '+ document.getElementsByClassName('UKglR8wTTT')[20].textContent +' 阅读此文本。'
    }

    function account(){
        document.querySelectorAll("h1")[0].innerHTML = '帐户 |  匿名用户';

        const accH2Array = document.querySelectorAll("h2");
        accH2Array[0].innerHTML = '高级帐户'
        accH2Array[1].innerHTML = '使用社交网络登录'
        accH2Array[2].innerHTML = '使用电子邮件登录'

        const accPArray = document.querySelectorAll("P");
        accPArray[0].innerHTML = '创建一个帐户，将您的打字数据存储在我们的云服务器上。这允许您从任何计算机或浏览器访问您的个人资料。如果您没有帐户，那么您的打字数据存储在本地，只能从当前计算机访问。'
        accPArray[1].innerHTML = '我们不存储任何密码。相反，我们使用第三方服务来验证我们的用户。我们提供几种便捷的方法来创建帐户和登录。'
        accPArray[2].innerHTML = '您可以随时选择退出。删除帐户就像创建一个帐户一样简单。'
        accPArray[3].innerHTML = '购买高级帐户以解锁其他功能并享受无广告体验。以下是高级帐户权益的列表：'
        accPArray[4].innerHTML = '这是一次性付款，提供终身访问权限。(低山：浏览器下个AdGuard插件一样的)'
        accPArray[6].innerHTML = '使用您的首选社交网络登录。我们尊重您的隐私，并承诺绝不向您的留言墙、朋友或电子邮件发送垃圾邮件。'
        accPArray[8].innerHTML = '不使用密码的简单登录。只需提供您的电子邮件地址，我们将向您发送登录链接。单击链接成为注册用户。如果要在另一台计算机上登录，请打开同一电子邮件，然后再次单击该链接。如果您输入与以前相同的电子邮件地址，我们将根据需要多次重新向您发送登录链接。该链接是永久性的，永远不会更改，因此请保密。'

        const accLiArray = document.querySelectorAll("li");
        accLiArray[0].innerHTML = '没有广告。广告可能会分散您的注意力并阻碍您的学习进度。这是摆脱它们的好方法。'
        accLiArray[1].innerHTML = '没有跟踪器。跟踪器不可避免地带有广告。删除所有跟踪器以获得完整的在线隐私。'
        accLiArray[2].innerHTML = '超快的响应速度。广告需要相当长的时间来加载。摆脱它们意味着所有页面的加载时间更快。'
    }

})();
