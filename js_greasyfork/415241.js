// ==UserScript==
// @name         综合素质评价辅助脚本
// @namespace    http://www.mahua-a.top
// @version      1.0
// @description  使用自动化的脚本来应付繁琐而又重复的填写过程
// @author       Michael Xiao
// @match        http://gzzp.jlipedu.cn/eedu_base/r_index.do*
// @require      https://unpkg.com/notiflix@2.6.0/dist/notiflix-aio-2.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415241/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415241/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// I Love Zhou Xun!
(function () {
    'use strict';

    // Your code here...

    Notiflix.Notify.Init({});
    Notiflix.Loading.Init({});


    var MH = {}

    MH.easyReq = function (url, dataObj, method) {
        Notiflix.Loading.Standard('处理中....');
        $.ajax({
            url: url,
            type: method,
            data: method == 'POST' ? JSON.stringify(dataObj) : dataObj,
            complete: function () {
                Notiflix.Loading.Remove()
            },
            success: function () {
                Notiflix.Notify.Success('操作成功，但建议检查所填写的数据！');
            },
            error: function () {
                Notiflix.Notify.Failure('操作未成功，可能是网络问题，请重试!');
            },
            contentType: "application/json; charset=utf-8",

        })
    }


    MH.isStudent = function () {
        // 从带有用户名的元素上判断
        return $('.start_menu .bg_cnt ul:nth-child(1)').text().indexOf('家长') == -1
    }

    MH.loadCSS = function (href) {
        $("head").append("<link>");
        var css = $("head").children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: href
        });
    }

    MH.addApp = function () {
        if ($('#myIconf_hiGrowPlanStudentJl').length == 0) {
            dktpLib.desktop.deskIcon.addToCurDesktop({
                "h": 600,
                "icon": "icon/desktop/jlhiczgh.png",
                "id": "f_hiGrowPlanStudentJl",
                "minh": 600,
                "minw": 1000,
                "mode": 1,
                "open": null,
                "resize": 1,
                "status": 2,
                "text": "成长规划",
                "url": "c_processApp.do?id=9004",
                "w": 1100
            })
        }

        if ($('#myIconf_hiCommentTermStudentJl').length == 0) {
            dktpLib.desktop.deskIcon.addToCurDesktop({
                "h": 600,
                "icon": "icon/desktop/jlhixqpy.png",
                "id": "f_hiCommentTermStudentJl",
                "minh": 600,
                "minw": 1000,
                "mode": 1,
                "open": null,
                "resize": 1,
                "status": 2,
                "text": "评语与陈述",
                "url": "c_processApp.do?id=9008",
                "w": 1100
            })
        }

        dktpLib.desktop.deskIcon.addToCurDesktop({
            "h": 600,
            "icon": "https://s1.ax1x.com/2020/11/01/BwLgbR.png",
            "id": "dt_afdian",
            "minh": 600,
            "minw": 1000,
            "mode": 1,
            "open": null,
            "resize": 1,
            "status": 2,
            "text": "赞赏作者",
            "url": "http://afdian.net/@hempflower",
            "w": 1100
        })

    }

    MH.randArr = function (arr) {
        var index = Math.floor((Math.random() * arr.length))
        return arr[index]
    }

    MH.motto = function () {
        return MH.randArr([
            '人，只要有一种信念，有所追求，什么艰苦都能忍受，什么环境也都能适应。',
            '只要你肯奋斗，没有什么是绝对不可能的。',
            '我们不要哀叹生活的不幸，诅咒命运的不公。在命运面前，我们要做强者，掐住命运的咽喉，叩问命运，改变命运。',
            '我们教书，是要引起学生的读书兴趣，做教员的不可一句一句或一字一字的都讲给学生听，最好使学生自我去研究，教员不讲也能够，等到学生实在不能用自我的力量去了解功课时，才去帮忙他。',
            '我走得很慢，但是我从不后悔。',
            ' 人们可以为一个陌路人的点滴帮助而感激不尽,却无视朝夕相处老板的种种恩惠,将其视之为理所当然。',
            '攀登科学高峰，就像登山运动员攀登珠穆朗玛峰一样，要克服无数艰难险阻，懦夫和懒汉是不可能享受到胜利的喜悦和幸福的。',
            '现在很痛苦，等过阵子回头看看，会发现其实那都不算事。',
            '勤奋是你生命的密码，能译出你一部壮丽的史诗。对于攀登者来说，失掉往昔的足迹并不可惜，迷失了继续前时的方向却很危险。',
            '一个人在科学探索的道路上，走过弯路，犯过错误，并不是坏事，更不是什么耻辱，要在实践中勇于承认和改正错误。——爱因斯坦',
            '张扬个性的年代，我就是我。',
            ' 一天要做三件事，第一要笑，第二要微笑，第三要哈哈大笑。',
            '时间是个常数，花掉一天等于浪费小时',
            '古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。',
            '喷泉的高度不会超过它的源头；一个人的事业也是这样，他的成就绝不会超过自己的信念。'
        ])
    }

    MH.selfWord = function () {
        return MH.randArr([
            '学习上，本人学习目的明确，基础知识扎实，并努力做到各方面的均衡发展，在学习过程中，我注重理论与实际相结合，虽然实践不够，但是我定会在以后的工作和学习中努力增加。生活上，本人严格要求自己，生活朴素，生活作风严谨，积极参加各种有益的社会活动，认真投入到学校的各项组织活动中，踊跃参加班集体活动。',
            '有良好的生活习惯，生活充实而有条理，有严谨的生活态度和良好的生活作风，为人热情大方，诚实守信，乐于助人，拥有自己的良好处事原则，能够与老师、同学和睦相处。能吃苦耐劳，具有很好的独立能力。',
            '学习上，我有较强的自学能力，勤钻研，肯思考，能合理安排好学习时间，善于摸索符合自己的学习方法，养成良好的学习习惯',
            '宝剑锋从磨砺出，梅花香自苦寒来"，本人坚信通过不断地学习和努力，使自己成为一个有理想、有道德、有文化、有纪律的学生，以优异的成绩迎接挑战，为社会主义建设贡献我毕生的力量',
            '在校期间，本人一直勤奋学习，刻苦钻研，通过系统地学习掌握较为扎实的基础知识。',
            '在高二生活中，我体会到了压力，有了动力，提高了能力。难忘高中生活，难忘高中的酸甜苦辣。',
            '在三年的高中生活中，让我感觉最充实的是学习。高中的学习不同于初中，它对我们要求更加严格，所以为了适应它，我已建立了成套的学习方法。在高中学习中，充满挑战，我们要敢于挑战，要努力拼搏。',
            '本人在校热爱祖国，尊敬师长，团结同学，乐于助人，是老师的好帮手，同学的好朋友。我学习勤奋，积极向上，喜欢和同学讨论并解决问题，经常参加班级学校组织的各种课内外活动。在家尊老爱幼，经常帮爸爸妈妈做家务是家长的好孩子，邻居的好榜样。',
            '时光流逝，丰富多彩的三年高中生活即将结束，这三年是我人生中最重要的一段里程，它将永远铭记在我的脑海里。'
        ])
    }

    MH.parentWord = function () {
        return MH.randArr([
            '虽然时间在流逝，但是，我已经知道了你心中有了奋斗的目标，我也欣慰地看到你正朝着这一目标不断前进。家长也为你创造了优越的学习条件，所有关心你的人都爱着你，相信你自己一定能努力把心中的理想变成现实。', '短短的一个学期，你已经取得了令人欣慰的进步，我为你喝彩，为你祝福。但是，你应该记住：没有最好，只有更好。努力进取，全面发展——优秀，优秀，更优秀！',
            '我知道，你已经为自己设计好了一幅美好的蓝图，并且你也正在为实现这一目标努力奋斗着。我相信你一定能成功。祝福你，美好的明天属于不断进取的攀登者！',
            '你已经站在了人生的起跑线上，为了实现心中的远大目标，你正努力拼搏着。胜利属于不畏艰难，勇往直前的人！胜利一定属于你！',
            '不靠天，不靠地，勤奋学习，不断进取，用知识来充实自己的头脑，把自己的命运掌握在自己的手中。我相信，你的明天一定是幸福的，你的明天也一定是快乐的。',
            '有了信心、决心、恒心，通过自己脚踏实地的奋斗，你心中的理想就一定能够实现！记住，今天的付出，一定能在明天得到回报。',
            '在人生的道路上，你已经有了良好的开端。我为你的成功喝彩，我为你的明天祝福！同时，我也得提醒你，一个人无论有多大的学问，始终都不能满足，因为知识是无穷的，学习是没有止境的。',
            '学习劲头足，听课又专注，做事更认真，你是同学们学习的榜样。但是，成绩只代表昨天，并不能说明你明天就一定也很优秀。所以，每个人都应该把成绩当作自己腾飞的起点',
            '本学期，你真正意识到了学习的重要性，你比以前更努力了，老师感到很欣慰。老师对你的要求特别严格，你也不能放松对自己的要求，形势对你来说比较严峻，你应该在这有限的时间里不懈地努力，明年高考才能一鸣惊人!老师会尽力帮助你的。',
            '我早说过你会闪光的，你没有让我失望。这学期大家都看到了一个全新的你，你不但改掉了爱说小话的毛病，而且学习刻苦努力，成绩明显进步。但是，千万别骄傲，前面的困难还很多，你要有足够的勇气信心和毅力来克服这些困难。持之以恒，你会笑到最后!',
            '你做事沉稳，思维敏捷，但是妈妈又总觉得你缺乏学习的激情。你是否发觉期中考试之后，你的学习不进反退了?这说明你真的缺乏拼劲和韧性，要知道“宝剑锋从磨砺出，梅花香自苦寒来”，不要再浪费时间了，努力吧!老师期待你的爆发!',
            '你劳动时总那么勤快，同学间的小事，你常常忍让。你发现没有，只要努力一下，你的字就可以写得漂亮，让脑子多思考一下问题，你就可以得出令人满意的答案。若今后让在学习上多花点时间，认真完成各项作业，就更好了。',
            '乐于助人，待人友善。能尽量帮干家务，吃穿不追求名牌，不与他人攀比。一直受到老师的表扬，做事追求尽善尽美。认真学习，爱好广泛，德智体方面都全面发展。希望她以后能再接再厉，保持良好的品质和品德，充满斗志，成为社会的有用之才，为国家作贡献。'
        ])
    }


    window.onload = function () {


        console.log('综合素质评价辅助工具已启动！你可以在菜单处查看此脚本添加的功能！')
        console.log('作者: Michael Xiao')
        console.log('QQ: 1993996310')


        setTimeout(function () {



            $('.full_bg_mask').remove()
            $('#myDlg_m_d_uid1').remove()

            MH.addApp()

            console.log('[HACK] 阻止改密弹窗')
            // 向侧栏添加菜单
            $('.start_menu .bg_cnt ul:nth-child(3)').append(`<li class="menu_item" id="hemp_gh" style="color:red"><div id="sysuiid_about_mi" style="cursor:pointer"></div>[AUTO]填写成长规划</li>`)
            $('.start_menu .bg_cnt ul:nth-child(3)').append(`<li class="menu_item" id="hemp_pj" style="color:red"><div id="sysuiid_about_mi" style="cursor:pointer"></div>[AUTO]填写评价</li>`)

            // 对应的监听器
            $('#hemp_gh').click(function () {
                console.log('自动填写规划')

                var dataObj = JSON.parse('{"plan":{"myCharacter":"自信","myMotto":"只有自己，才能举起属于自己的太阳","myMerit":"遇事冷静","myDefect":"懒","myInterest":"打羽毛球","myProfession1":"自动化","myProfession2":"医生"},"subjectStr1":"2,3,4,5,6","subjectStr2":"2,3,4,5,6","subjectStr3":"1,2,3,4,5,6","professions":[{"professionName":"自动化","schoolName":"西安电子科技大学"},{"professionName":"通讯","schoolName":"西安交通大学"},{"professionName":"计算机","schoolName":"上海交通大学"}],"goals":[{"aspectName":"思想品德","finishStatus":1,"goal":"提升自身道德修养。培养责任心，增强与社会的凝聚力","aspect":2,"_id":8,"_uid":8,"_state":"modified"},{"aspectName":"思想品德","finishStatus":1,"goal":null,"aspect":2,"_id":9,"_uid":9},{"aspectName":"思想品德","finishStatus":1,"goal":null,"aspect":2,"_id":10,"_uid":10},{"aspectName":"思想品德","finishStatus":1,"goal":null,"aspect":2,"_id":11,"_uid":11},{"aspectName":"学业水平","finishStatus":1,"goal":"补短板，强长处。贯彻好每一个学科的细节","aspect":1,"_id":12,"_uid":12,"_state":"modified"},{"aspectName":"学业水平","finishStatus":1,"goal":null,"aspect":1,"_id":13,"_uid":13},{"aspectName":"学业水平","finishStatus":1,"goal":null,"aspect":1,"_id":14,"_uid":14},{"aspectName":"学业水平","finishStatus":1,"goal":null,"aspect":1,"_id":15,"_uid":15},{"aspectName":"身心健康","finishStatus":1,"goal":"锻炼身体，提升身体素质。积极与他人交往。","aspect":3,"_id":16,"_uid":16,"_state":"modified"},{"aspectName":"身心健康","finishStatus":1,"goal":null,"aspect":3,"_id":17,"_uid":17},{"aspectName":"身心健康","finishStatus":1,"goal":null,"aspect":3,"_id":18,"_uid":18},{"aspectName":"身心健康","finishStatus":1,"goal":null,"aspect":3,"_id":19,"_uid":19},{"aspectName":"艺术素养","finishStatus":1,"goal":null,"aspect":4,"_id":20,"_uid":20},{"aspectName":"艺术素养","finishStatus":1,"goal":"培养艺术兴趣，参与艺术活动","aspect":4,"_id":21,"_uid":21},{"aspectName":"艺术素养","finishStatus":1,"goal":null,"aspect":4,"_id":22,"_uid":22},{"aspectName":"艺术素养","finishStatus":1,"goal":null,"aspect":4,"_id":23,"_uid":23},{"aspectName":"社会实践","finishStatus":1,"goal":"积极参加各种有益的社会活动","aspect":5,"_id":24,"_uid":24},{"aspectName":"社会实践","finishStatus":1,"goal":null,"aspect":5,"_id":25,"_uid":25},{"aspectName":"社会实践","finishStatus":1,"goal":null,"aspect":5,"_id":26,"_uid":26},{"aspectName":"社会实践","finishStatus":1,"goal":null,"aspect":5,"_id":27,"_uid":27}]}')

                // 覆盖一些随机内容，防止千篇一律
                dataObj['plan']['myCharacter'] = MH.randArr('外向 善良 开朗 活泼 好动 轻松 愉快 热情 可亲 豁达 稳重 幽默 真诚 豪爽 耿直 成熟 独立 果断 健谈 机敏 深沉 坚强 兴奋 热情 率直 毅力 友爱 风趣 沉静 谨慎 忠诚 友善 严肃 忠心 乐观 坦率 勇敢 自信 自立 沉著 执著 容忍 体贴 满足 积极 有趣 知足 勤劳 和气 无畏 务实'.split(' '))
                dataObj['plan']['myMotto'] = MH.motto()
                dataObj['plan']['myDefect'] = MH.randArr('懒散 消极 遇事退缩 自制力差 经常熬夜 学习不专一'.split(' '))
                dataObj['plan']['myInterest'] = MH.randArr('唱歌、听音乐、看电影、看韩剧、看综艺娱乐节目、看书、看小说、看杂志、逛街、购物、了解市场的行情、跳舞、演奏乐器、去健身房健身、减肥、塑形、瑜伽、足球、篮球、排球、跑步、羽毛球'.split('、'))

                // 发送请求
                MH.easyReq('http://gzzp.jlipedu.cn/eedu_high/r_saveHischGrowPlan.do', dataObj, 'POST')
            })

            $('#hemp_pj').click(function () {
                console.log('自动填写评价')
                var content = ''
                if (MH.isStudent()) {
                    content = MH.selfWord()
                } else {
                    content = MH.parentWord()
                }

                MH.easyReq('http://gzzp.jlipedu.cn/eedu_high/r_saveComment.do', { comment: content }, 'GET')
            })

            $('#sysuiid_logout_mi').click(function () {
                window.location.href = 'http://gzzp.jlipedu.cn/eedu_base/c_logout.do'
            })

            $('#myIcondt_afdian').click(function () {
                window.open('http://afdian.net/@hempflower')
            })

            Notiflix.Notify.Success('脚本注入成功，功能可以正常使用了！');
        }, 700)

    }


})();