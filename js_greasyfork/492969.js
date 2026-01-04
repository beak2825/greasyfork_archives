// ==UserScript==
// @name         中文版nhentai
// @namespace    http://tampermonkey.net/
// @version      2024-04-25_4
// @description  翻译nhentai的标签和界面为中文
// @author       limic
// @match        https://nhentai.net/*
// @icon         https://nhentai.net/favicon.ico
// @resource     DATA https://raw.githubusercontent.com/EhTagTranslation/DatabaseReleases/master/db.text.json
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492969/%E4%B8%AD%E6%96%87%E7%89%88nhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/492969/%E4%B8%AD%E6%96%87%E7%89%88nhentai.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*
    //#region 方便的标注
    const content = document.querySelector('#content');
    const tags = document.querySelector('#tags');
    const favorite = document.querySelector('#favorite');
    const download = document.querySelector('#download');
    const id_body = document.querySelector('#id_body');
    const comment_form = document.querySelector('#comment_form');
    const comments = document.querySelector('#comments');
    const favcontainer = document.querySelector('#favcontainer');
    const id_username = document.querySelector('#id_username');
    const id_email = document.querySelector('#id_email');
    const id_old_password = document.querySelector('#id_old_password');
    const id_new_password1 = document.querySelector('#id_new_password1');
    const id_new_password2 = document.querySelector('#id_new_password2');
    const id_theme = document.querySelector('#id_theme');
    const messages = document.querySelector('#messages');
    const id_username_or_email = document.querySelector('#id_username_or_email');
    const id_password = document.querySelector('#id_password');
    const id_password1 = document.querySelector('#id_password1');
    const id_password2 = document.querySelector('#id_password2');
    //#endregion
    */

    /**
     * 添加元素监视以处理DOM更新
     * @param target 监视的目标元素
     * @param proc 目标元素的事件回调函数
     * @param message 输出调试信息
    **/
    function addObserver(target, proc, message = '监视DOM更新') {
        proc(target);
        const config = { childList: true };
        const observer = new MutationObserver(function (mutationList, observer) {
            for (let mutation of mutationList) {
                if (mutation.type === 'childList') {
                    observer.disconnect();
                    console.log(`[中文版nhentai]:${message}`);
                    proc(mutation.target);
                    observer.observe(mutation.target, config);
                }
            }
        });
        observer.observe(target, config);
    }

    /**
     * 翻译时间
    **/
    function translateTime(timeElement) {
        var timeText = new Date(timeElement.dateTime).toLocaleString('zh-cn', { dateStyle: 'medium', timeStyle: 'medium' });
        timeElement.parentNode.innerHTML = `<time class="nobold">${timeText}</time>`;
    }

    /**
     * 翻译收藏按钮
    **/
    function translateFavorite(element) {
        if (element.textContent === 'Favorite') {
            element.innerHTML = '<span>收藏</span>';
        }
        else if (element.textContent === 'Unfavorite') {
            element.innerHTML = '<span>取消收藏</span>';
        }
    }

    /**
     * 翻译排序
    **/
    function translateSort() {
        var sort = content.querySelector('.sort');
        sort.firstChild.firstChild.textContent = '最新上传';
        sort.lastChild.childNodes[0].textContent = '热门:';
        sort.lastChild.childNodes[1].textContent = '今天';
        sort.lastChild.childNodes[2].textContent = '本周';
        sort.lastChild.childNodes[3].textContent = '所有';
    }

    //移除广告
    content.querySelectorAll('.advertisement').forEach(item => item.remove());

    //#region 导航栏
    const mapMenu = new Map();
    mapMenu.set('Random', '随机');
    mapMenu.set('Tags', '标签');
    mapMenu.set('Artists', '作者');
    mapMenu.set('Characters', '角色');
    mapMenu.set('Parodies', '作品');
    mapMenu.set('Groups', '社团');
    mapMenu.set('Info', '介绍信息');

    document.querySelectorAll("li.desktop > a").forEach(item => {
        if (mapMenu.has(item.textContent)) {
            item.textContent = mapMenu.get(item.textContent);
        }
    });
    document.querySelectorAll("ul.dropdown-menu > li > a").forEach(item => {
        if (mapMenu.has(item.textContent)) {
            item.textContent = mapMenu.get(item.textContent);
        }
    });

    var loginUI = document.querySelector(".menu-sign-in");
    var userUI = document.querySelector(".menu.right");
    if (loginUI) {
        loginUI.firstChild.lastChild.textContent = ' 登录';
        document.querySelector(".menu-register").firstChild.lastChild.textContent = ' 注册';
    } else {
        userUI.firstChild.firstChild.lastChild.textContent = ' 收藏夹';
        userUI.lastChild.firstChild.lastChild.textContent = ' 注销';
    }
    //#endregion

    const mapTagHeaders = new Map();
    mapTagHeaders.set('Parodies:', '作品：');
    mapTagHeaders.set('Characters:', '角色：');
    mapTagHeaders.set('Tags:', '标签：');
    mapTagHeaders.set('Artists:', '作者：');
    mapTagHeaders.set('Groups:', '社团：');
    mapTagHeaders.set('Languages:', '语言：');
    mapTagHeaders.set('Categories:', '类别：');
    mapTagHeaders.set('Pages:', '页数：');
    mapTagHeaders.set('Uploaded:', '上传日期：');

    const mapTags = new Map();
    mapTags.set('original', '原创');

    //#region 热门标签半页
    mapTags.set('sole female', '单女主');
    mapTags.set('sole male', '单男主');
    mapTags.set('group', '乱交');
    mapTags.set('lolicon', '萝莉');
    mapTags.set('stockings', '长筒袜');
    mapTags.set('nakadashi', '中出');
    mapTags.set('schoolgirl uniform', '女生制服');
    mapTags.set('glasses', '眼镜');
    mapTags.set('full color', '全彩');
    mapTags.set('shotacon', '正太');
    mapTags.set('rape', '强奸');
    mapTags.set('yaoi', '男同');
    mapTags.set('mosaic censorship', '马赛克修正');
    mapTags.set('males only', '纯男性');
    mapTags.set('incest', '乱伦');
    mapTags.set('milf', '熟女');
    mapTags.set('multi-work series', '系列作品');
    mapTags.set('x-ray', '透视');
    mapTags.set('double penetration', '双重插入');
    mapTags.set('futanari', '扶她');
    mapTags.set('paizuri', '乳交');
    mapTags.set('tankoubon', '单行本');
    mapTags.set('sex toys', '性玩具');
    mapTags.set('netorare', 'NTR');
    mapTags.set('yuri', '百合');
    mapTags.set('swimsuit', '泳装');
    mapTags.set('full censorship', '完全修正');
    mapTags.set('femdom', '女性主导');
    mapTags.set('twintails', '双马尾');
    mapTags.set('impregnation', '受孕');
    mapTags.set('ponytail', '马尾辫');
    mapTags.set('pantyhose', '连裤袜');
    mapTags.set('sister', '姐妹');
    mapTags.set('tentacles', '触手');
    mapTags.set('muscle', '肌肉');
    mapTags.set('story arc', '故事线');
    mapTags.set('mind break', '洗脑');
    mapTags.set('kemonomimi', '兽耳');
    mapTags.set('lactation', '母乳');
    mapTags.set('masturbation', '自慰');
    mapTags.set('tomgirl', '伪娘');
    mapTags.set('mind control', '催眠');
    mapTags.set('schoolboy uniform', '男生制服');
    //#endregion

    //#region 字母排序1-5页的相对热门标签(abortion-dog)
    mapTags.set('abortion', '堕胎');
    mapTags.set('absorption', '吸收');
    mapTags.set('age progression', '年龄增长');
    mapTags.set('age regression', '返老还童');
    mapTags.set('ahegao', '阿黑颜');
    mapTags.set('albino', '白化');
    mapTags.set('alien', '外星人');
    mapTags.set('alien girl', '外星女孩');
    mapTags.set('anal', '爆肛');
    mapTags.set('anal birth', '肛门出产');
    mapTags.set('anal intercourse', '肛交');
    mapTags.set('angel', '天使');
    mapTags.set('animated', '动图');
    mapTags.set('anorexic', '瘦骨嶙峋');
    mapTags.set('anthology', '选集');
    mapTags.set('apparel bukkake', '穿衣颜射');
    mapTags.set('apron', '围裙');
    mapTags.set('armpit licking', '舔腋');
    mapTags.set('armpit sex', '腋交');
    mapTags.set('artbook', '画集');
    mapTags.set('artistcg', '画师CG');
    mapTags.set('asphyxiation', '窒息');
    mapTags.set('ass expansion', '臀部膨胀');
    mapTags.set('aunt', '阿姨');
    mapTags.set('autofellatio', '自我口交');
    mapTags.set('autopaizuri', '自我乳交');
    mapTags.set('bald', '秃顶');
    mapTags.set('balljob', '睪丸交');
    mapTags.set('balls expansion', '睾丸生长');
    mapTags.set('ball sucking', '吸睪丸');
    mapTags.set('bandages', '绷带');
    mapTags.set('bandaid', '创可贴');
    mapTags.set('bbw', '胖女人');
    mapTags.set('bdsm', '调教');
    mapTags.set('bear', '熊');
    mapTags.set('beauty mark', '美人痣');
    mapTags.set('bee girl', '蜂女');
    mapTags.set('bestiality', '人兽交');
    mapTags.set('big areolae', '大乳晕');
    mapTags.set('big ass', '大屁股');
    mapTags.set('big balls', '大睪丸');
    mapTags.set('big breasts', '巨乳');
    mapTags.set('big clit', '大阴蒂');
    mapTags.set('big lips', '大嘴唇');
    mapTags.set('big muscles', '大肌肉');
    mapTags.set('big nipples', '大乳头');
    mapTags.set('big penis', '大鸡巴');
    mapTags.set('big vagina', '大阴道');
    mapTags.set('bike shorts', '自行车短裤');
    mapTags.set('bikini', '比基尼');
    mapTags.set('birth', '出产');
    mapTags.set('bisexual', '双性恋');
    mapTags.set('blackmail', '要挟');
    mapTags.set('blind', '失明');
    mapTags.set('blindfold', '蒙眼');
    mapTags.set('bloomers', '灯笼裤');
    mapTags.set('blowjob', '口交');
    mapTags.set('blowjob face', '口交颜');
    mapTags.set('body painting', '人体涂鸦');
    mapTags.set('bodystocking', '连身袜');
    mapTags.set('bodysuit', '紧身衣裤');
    mapTags.set('body swap', '身体交换');
    mapTags.set('body writing', '人体写字');
    mapTags.set('bondage', '束缚');
    mapTags.set('brain fuck', '脑交');
    mapTags.set('breast expansion', '乳房膨胀');
    mapTags.set('breast feeding', '哺乳');
    mapTags.set('bride', '婚纱');
    mapTags.set('brother', '兄弟');
    mapTags.set('bukkake', '颜射');
    mapTags.set('bull', '牛');
    mapTags.set('bunny girl', '兔女郎');
    mapTags.set('burping', '打嗝');
    mapTags.set('business suit', '西装');
    mapTags.set('butler', '管家');
    mapTags.set('cannibalism', '食人');
    mapTags.set('cashier', '收银员');
    mapTags.set('cat', '猫');
    mapTags.set('catboy', '猫男');
    mapTags.set('catfight', '女人打架');
    mapTags.set('catgirl', '猫娘');
    mapTags.set('cbt', '虐屌');
    mapTags.set('centaur', '人马');
    mapTags.set('cervix penetration', '宫颈插入');
    mapTags.set('cervix prolapse', '宫颈脱垂');
    mapTags.set('chastity belt', '贞操带');
    mapTags.set('cheating', '出轨');
    mapTags.set('cheerleader', '啦啦队员');
    mapTags.set('chikan', '痴汉');
    mapTags.set('chinese dress', '旗袍');
    mapTags.set('chloroform', '迷药');
    mapTags.set('christmas', '圣诞装');
    mapTags.set('clamp', '夹具');
    mapTags.set('clit growth', '阴蒂生长');
    mapTags.set('clit insertion', '阴蒂插入');
    mapTags.set('clit stimulation', '阴蒂刺激');
    mapTags.set('clone', '克隆');
    mapTags.set('closed eyes', '闭眼');
    mapTags.set('clothed female nude male', '裸男');
    mapTags.set('clothed male nude female', '裸女');
    mapTags.set('clothed paizuri', '穿衣乳交');
    mapTags.set('clown', '小丑');
    mapTags.set('coach', '教练');
    mapTags.set('cockphagia', '阴茎吞食');
    mapTags.set('cock ring', '锁精环');
    mapTags.set('cockslapping', '屌掴');
    mapTags.set('collar', '项圈');
    mapTags.set('comic', '西方漫画');
    mapTags.set('compilation', '汇编');
    mapTags.set('condom', '避孕套');
    mapTags.set('conjoined', '连体');
    mapTags.set('coprophagia', '食粪');
    mapTags.set('corruption', '堕落');
    mapTags.set('corset', '紧身胸衣');
    mapTags.set('cosplaying', 'Cosplay');
    mapTags.set('cousin', '表亲');
    mapTags.set('cowgirl', '牛女孩');
    mapTags.set('cowman', '牛男');
    mapTags.set('crossdressing', '异性装');
    mapTags.set('crotch tattoo', '淫纹');
    mapTags.set('crown', '王冠');
    mapTags.set('crying', '流泪');
    mapTags.set('cum bath', '精液浴');
    mapTags.set('cumflation', '精液涨肚');
    mapTags.set('cum in eye', '眼射');
    mapTags.set('cum swap', '精液交换');
    mapTags.set('cunnilingus', '舔阴');
    mapTags.set('cuntbusting', '阴道破坏');
    mapTags.set('dark nipples', '深色乳头');
    mapTags.set('dark sclera', '深色巩膜');
    mapTags.set('dark skin', '黑皮');
    mapTags.set('daughter', '女儿');
    mapTags.set('deepthroat', '深喉');
    mapTags.set('deer girl', '鹿女孩');
    mapTags.set('defaced', '污损');
    mapTags.set('defloration', '破处');
    mapTags.set('demon', '恶魔');
    mapTags.set('demon girl', '恶魔女孩');
    mapTags.set('denki anma', '电气按摩');
    mapTags.set('diaper', '尿布');
    mapTags.set('dickgirl on dickgirl', '扶她击剑');
    mapTags.set('dickgirl on female', '扶她上女');
    mapTags.set('dickgirl on male', '扶她上男');
    mapTags.set('dickgirls only', '纯扶她');
    mapTags.set('dick growth', '鸡巴生长');
    mapTags.set('dicknipples', '阴茎乳头');
    mapTags.set('dilf', '熟男');
    mapTags.set('dismantling', '拆解');
    mapTags.set('dog', '狗');
    //#endregion

    //#region 额外添加
    mapTags.set('drugs', '药物');
    mapTags.set('guro', '猎奇');
    mapTags.set('harem', '后宫');
    mapTags.set('maid', '女仆装');
    mapTags.set('pregnant', '怀孕');
    mapTags.set('unusual pupils', '异瞳');
    mapTags.set('stomach deformation', '腹部变形');
    mapTags.set('gang rape', '轮奸');
    mapTags.set('uncensored', '无修正');
    mapTags.set('exhibitionism', '露出');
    mapTags.set('monster girl', '魔物娘');
    mapTags.set('females only', '纯女性');
    mapTags.set('horns', '角');
    mapTags.set('squirting', '潮吹');
    mapTags.set('ryona', '凌虐');
    mapTags.set('slave', '奴隶');
    mapTags.set('snuff', '虐杀');
    mapTags.set('amputee', '截肢');
    mapTags.set('all the way through', '完全穿过');
    mapTags.set('blood', '血腥');
    mapTags.set('body modification', '人体改造');
    mapTags.set('vore', '丸吞');
    mapTags.set('fisting', '拳交');
    mapTags.set('prolapse', '子宫脱垂');
    mapTags.set('parasite', '寄生');
    mapTags.set('insect', '昆虫');
    mapTags.set('large insertions', '巨大插入');
    mapTags.set('eggs', '产卵');
    mapTags.set('orc', '兽人');
    mapTags.set('elf', '精灵');
    mapTags.set('insect', '昆虫');
    mapTags.set('translated', '翻译');
    mapTags.set('chinese', '中文');
    mapTags.set('doujinshi', '同人志');
    mapTags.set('japanese', '日文');
    mapTags.set('english', '英语');
    mapTags.set('very long hair', '长发');
    mapTags.set('soushuuhen', '总集篇');
    mapTags.set('ghost', '幽灵');
    mapTags.set('torture', '拷问');
    mapTags.set('piercing', '穿孔');
    mapTags.set('gaping', '敞口');
    mapTags.set('scat', '粪便');
    mapTags.set('nose hook', '鼻钩');
    mapTags.set('monster', '怪物');
    mapTags.set('possession', '附身');
    mapTags.set('teacher', '教师');
    mapTags.set('kissing', '接吻');
    mapTags.set('footjob', '足交');
    mapTags.set('handjob', '打手枪');
    mapTags.set('leotard', '紧身衣');
    mapTags.set('tomboy', '假小子');
    mapTags.set('inverted nipples', '乳头内陷');
    mapTags.set('prostate massage', '前列腺按摩');
    mapTags.set('drunk', '酗酒');
    mapTags.set('hair buns', '丸子头');
    mapTags.set('spanking', '打屁股');
    mapTags.set('gokkun', '饮精');
    mapTags.set('multimouth blowjob', '多口口交');
    mapTags.set('manga', '漫画');
    mapTags.set('lingerie', '情趣内衣');
    mapTags.set('fingering', '指法');
    mapTags.set('gloves', '手套');
    mapTags.set('filming', '拍摄');
    mapTags.set('virginity', '丧失童贞');
    mapTags.set('eye-covering bang', '长刘海');
    mapTags.set('painted nails', '美甲');
    mapTags.set('hairy', '多毛');
    mapTags.set('sweating', '出汗');
    mapTags.set('small breasts', '贫乳');
    mapTags.set('scar', '疤痕');
    mapTags.set('kimono', '和服');
    mapTags.set('smoking', '吸烟');
    mapTags.set('oppai loli', '巨乳萝莉');
    mapTags.set('oni', '鬼');
    mapTags.set('facesitting', '颜面骑乘');
    mapTags.set('yandere', '病娇');
    mapTags.set('shaved head', '光头');
    mapTags.set('detached sleeves', '分袖上衣');
    mapTags.set('bbm', '胖男人');
    mapTags.set('school swimsuit', '死库水');
    mapTags.set('hidden sex', '隐蔽性交');
    mapTags.set('tail plug', '尾塞');
    mapTags.set('tracksuit', '运动服');
    mapTags.set('sumata', '股间性交');
    mapTags.set('randoseru', '书包');
    mapTags.set('tanlines', '晒痕');
    mapTags.set('inseki', '姻亲');
    mapTags.set('niece', '侄女');
    mapTags.set('voyeurism', '偷窥');
    mapTags.set('tail', '尾巴');
    mapTags.set('leg lock', '夹腿');
    mapTags.set('facial hair', '胡子');
    mapTags.set('unusual teeth', '异齿');
    mapTags.set('nipple stimulation', '乳头刺激');
    mapTags.set('zombie', '僵尸');
    mapTags.set('vaginal birth', '阴道出产');
    mapTags.set('gender bender', '性别扭曲');
    mapTags.set('solo action', '单人表演');
    mapTags.set('gender morph', '性别变形');
    mapTags.set('gender change', '性转');
    mapTags.set('replaced', '已替换');
    mapTags.set('sundress', '夏装');
    mapTags.set('leash', '狗链');
    mapTags.set('halo', '光环');
    mapTags.set('domination loss', '统治丢失');
    mapTags.set('smalldom', '逆体格差');
    mapTags.set('mesugaki', '雌小鬼');
    mapTags.set('slime', '史莱姆');
    mapTags.set('mother', '母亲');
    mapTags.set('wings', '翅膀');
    mapTags.set('oyakodon', '亲子丼');
    mapTags.set('granddaughter', '孙女');
    mapTags.set('vampire', '吸血鬼');
    mapTags.set('exposed clothing', '开洞装');
    mapTags.set('vtuber', '虚拟主播');
    mapTags.set('miko', '巫女装');
    mapTags.set('mermaid', '人鱼');
    mapTags.set('lizard girl', '蜥蜴女孩');
    mapTags.set('shibari', '捆绑');
    mapTags.set('mouth mask', '口罩');
    mapTags.set('wolf girl', '狼女孩');
    mapTags.set('bunny boy', '兔子男孩');
    mapTags.set('high heels', '高跟鞋');
    mapTags.set('shimaidon', '手足丼');
    mapTags.set('gag', '口塞');
    mapTags.set('strap-on', '穿戴式阳具');
    mapTags.set('petplay', '人宠');
    mapTags.set('harness', '挽具');
    mapTags.set('urination', '排尿');
    mapTags.set('garter belt', '吊袜带');
    mapTags.set('dog girl', '犬娘');
    mapTags.set('multiple orgasms', '连续高潮');
    mapTags.set('gymshorts', '运动短裤');
    mapTags.set('no penetration', '无插入性行为');
    mapTags.set('father', '父亲');
    mapTags.set('urethra insertion', '尿道插入');
    mapTags.set('midget', '侏儒');
    mapTags.set('underwater', '水下');
    mapTags.set('slime girl', '史莱姆娘');
    mapTags.set('fox girl', '狐娘');
    mapTags.set('inflation', '腹部膨胀');
    mapTags.set('snake', '蛇');
    mapTags.set('frog', '青蛙');
    mapTags.set('huge breasts', '超乳');
    mapTags.set('sole dickgirl', '单扶她');
    mapTags.set('miniguy', '迷你男孩');
    mapTags.set('unbirth', '逆生产');
    mapTags.set('minigirl', '迷你女孩');
    mapTags.set('snake girl', '蛇女');
    mapTags.set('magical girl', '魔法少女');
    mapTags.set('living clothes', '生物衣');
    mapTags.set('plant girl', '植物女孩');
    mapTags.set('long tongue', '长舌头');
    mapTags.set('nipple fuck', '乳穴性交');
    mapTags.set('personality excretion', '人格排泄');
    mapTags.set('rimjob', '舔肛');
    mapTags.set('transformation', '变身');
    mapTags.set('selfcest', '自交');
    mapTags.set('penis enlargement', '阴茎生长');
    mapTags.set('tribadism', '磨豆腐');
    mapTags.set('freckles', '雀斑');
    mapTags.set('policewoman', '警服');
    mapTags.set('double anal', '双插肛门');
    mapTags.set('orgasm denial', '高潮禁止');
    mapTags.set('hairy armpits', '腋毛');
    mapTags.set('josou seme', '女装攻');
    mapTags.set('variant set', '差分图集');
    mapTags.set('saliva', '唾液');
    mapTags.set('farting', '放屁');
    mapTags.set('watermarked', '水印');
    mapTags.set('petrification', '石化');
    mapTags.set('nun', '修女');
    mapTags.set('emotionless sex', '性冷淡');
    mapTags.set('time stop', '时间停止');
    mapTags.set('drill hair', '螺旋辫');
    mapTags.set('wormhole', '虫洞');
    mapTags.set('navel fuck', '肚脐交');
    mapTags.set('minotaur', '牛头怪');
    mapTags.set('horse boy', '马男孩');
    mapTags.set('kunoichi', '女忍装');
    mapTags.set('onahole', '飞机杯');
    mapTags.set('mesuiki', '干高潮');
    mapTags.set('shared senses', '感觉连接');
    mapTags.set('twins', '双胞胎');
    mapTags.set('feminization', '娘化');
    mapTags.set('phimosis', '包茎');
    mapTags.set('ffm threesome', '女男女3P');
    mapTags.set('mmf threesome', '男女男3P');
    mapTags.set('fft threesome', '女扶女3P');
    mapTags.set('fff threesome', '女3P');
    mapTags.set('mmm threesome', '男3P');
    mapTags.set('ttt threesome', '扶她3P');
    mapTags.set('mmt threesome', '男扶男3P');
    mapTags.set('ttf threesome', '扶女扶3P');
    mapTags.set('ttm threesome', '扶男扶3P');
    mapTags.set('mtf threesome', '男扶女3P');
    mapTags.set('pixie cut', '精灵短发');
    mapTags.set('electric shocks', '电击');
    mapTags.set('sleeping', '睡眠');
    mapTags.set('military', '军装');
    mapTags.set('tickling', '挠痒');
    mapTags.set('forced exposure', '强迫暴露');
    mapTags.set('low shotacon', '低存在正太');
    mapTags.set('transparent clothing', '透明服装');
    mapTags.set('stirrup legwear', '马镫裤');
    mapTags.set('extraneous ads', '植入广告');
    mapTags.set('multiple paizuri', '多重乳交');
    mapTags.set('gothic lolita', '哥特萝莉');
    mapTags.set('heterochromia', '异色瞳');
    mapTags.set('tailjob', '尾交');
    mapTags.set('missing cover', '封面缺失');
    mapTags.set('machine', '机械奸');
    mapTags.set('prostitution', '卖淫');
    mapTags.set('foot licking', '舔足');
    mapTags.set('stuck in wall', '卡在墙上');
    mapTags.set('triple anal', '三插肛门');
    mapTags.set('old man', '老人');
    mapTags.set('low scat', '低存在排便');
    mapTags.set('smell', '气味');
    mapTags.set('humiliation', '羞辱');
    mapTags.set('swinging', '换妻');
    mapTags.set('redraw', '重绘');
    mapTags.set('netorase', '绿帽癖');
    mapTags.set('public use', '肉便器');
    mapTags.set('moral degeneration', '道德退化');
    mapTags.set('grandmother', '祖母');
    mapTags.set('internal urination', '体内排尿');
    mapTags.set('robot', '机器人');
    mapTags.set('lab coat', '白大褂');
    mapTags.set('necrophilia', '奸尸');
    mapTags.set('piss drinking', '饮尿');
    mapTags.set('ai generated', 'AI生成');
    mapTags.set('thigh high boots', '高筒靴');
    mapTags.set('webtoon', '条漫');
    mapTags.set('gyaru', '辣妹');
    mapTags.set('scanmark', '扫描水印');
    mapTags.set('enema', '灌肠');
    mapTags.set('nurse', '护士装');
    mapTags.set('shemale', '人妖');
    mapTags.set('tall girl', '高个女孩');
    mapTags.set('incomplete', '缺页');
    mapTags.set('masked face', '面具');
    mapTags.set('male on dickgirl', '男上扶她');
    mapTags.set('eyepatch', '眼罩');
    mapTags.set('pegging', '爆菊');
    mapTags.set('tiara', '宝冠');
    mapTags.set('small penis', '小鸡巴');
    mapTags.set('latex', '乳胶紧身衣');
    mapTags.set('pasties', '乳贴');
    mapTags.set('multipanel sequence', '多格序列');
    mapTags.set('gyaru-oh', '黄毛');
    mapTags.set('hotpants', '热裤');
    mapTags.set('triple penetration', '三重插入');
    mapTags.set('smegma', '阴垢');
    mapTags.set('giantess', '女巨人');
    mapTags.set('double vaginal', '双插阴道');
    mapTags.set('huge penis', '巨大鸡巴');
    mapTags.set('frottage', '阴茎摩擦');
    mapTags.set('waitress', '女侍者装');
    mapTags.set('tall man', '高个男');
    mapTags.set('milking', '挤奶');
    mapTags.set('fishnets', '渔网袜');
    mapTags.set('focus anal', '高存在肛交');
    mapTags.set('thick eyebrows', '浓眉');
    mapTags.set('shimapan', '条纹胖次');
    mapTags.set('low lolicon', '低存在萝莉');
    mapTags.set('eyemask', '眼部面具');
    mapTags.set('human pet', '人形宠物');
    mapTags.set('witch', '女巫装');
    mapTags.set('sunglasses', '太阳眼镜');
    mapTags.set('tutor', '家庭教师');
    mapTags.set('widow', '寡妇');
    mapTags.set('vomit', '呕吐');
    mapTags.set('large tattoo', '大纹身');
    mapTags.set('goblin', '哥布林');
    mapTags.set('metal armor', '机甲');
    mapTags.set('fundoshi', '兜裆布');
    mapTags.set('first person perspective', '第一人称视角');
    mapTags.set('dougi', '道服');
    mapTags.set('skinsuit', '人皮衣');
    mapTags.set('mecha girl', '机娘');
    mapTags.set('double blowjob', '双重口交');
    mapTags.set('pubic stubble', '阴毛茬');
    mapTags.set('wrestling', '摔角');
    mapTags.set('school gym uniform', '学校体操服');
    mapTags.set('nudity only', '仅裸体');
    mapTags.set('poor grammar', '语法差');
    mapTags.set('heterochromia', '异色瞳');
    mapTags.set('pig', '猪');
    mapTags.set('prehensile hair', '头发缠绕');
    mapTags.set('focus paizuri', '高存在乳交');
    mapTags.set('goudoushi', '合作本');
    mapTags.set('focus blowjob', '高存在口交');
    mapTags.set('menstruation', '经血');
    mapTags.set('wooden horse', '木马');
    mapTags.set('horse', '马');
    mapTags.set('assjob', '尻交');
    mapTags.set('non-h', '无H');
    mapTags.set('shrinking', '缩小');
    mapTags.set('oil', '润滑油');
    mapTags.set('human cattle', '人类饲养');
    mapTags.set('multiple penises', '多个阴茎');
    mapTags.set('fairy', '小精灵');
    mapTags.set('full body tattoo', '全身纹身');
    mapTags.set('wet clothes', '湿身');
    mapTags.set('out of order', '顺序错乱');
    mapTags.set('rough translation', '渣翻');
    mapTags.set('makeup', '化妆');
    mapTags.set('pillory', '枷具');
    mapTags.set('layer cake', '双层夹心');
    mapTags.set('whip', '鞭打');
    mapTags.set('low bestiality', '低存在兽交');
    mapTags.set('omorashi', '漏尿');
    mapTags.set('tube', '插管');
    mapTags.set('nipple piercing', '乳头穿孔');
    mapTags.set('vaginal sticker', '阴贴');
    mapTags.set('genital piercing', '性器穿孔');
    mapTags.set('infantilism', '幼稚型');
    mapTags.set('dog boy', '犬男孩');
    mapTags.set('full-packaged futanari', '有蛋扶她');
    mapTags.set('doll joints', '玩偶关节');
    mapTags.set('hairjob', '发丝交');
    mapTags.set('invisible', '隐形');
    mapTags.set('weight gain', '体重增加');
    mapTags.set('glory hole', '寻欢洞');
    mapTags.set('policeman', '警服');
    mapTags.set('kigurumi pajama', '卡通动物衫');
    mapTags.set('growth', '巨大化');
    mapTags.set('tights', '厚连裤袜');
    mapTags.set('gigantic breasts', '极乳');
    mapTags.set('forniphilia', '人体家具');
    mapTags.set('fox boy', '狐狸男孩');
    mapTags.set('wolf boy', '狼人');
    mapTags.set('speculum', '扩张器');
    mapTags.set('rough grammar', '语法差');
    mapTags.set('table masturbation', '桌角自慰');
    mapTags.set('mouse girl', '鼠女孩');
    mapTags.set('syringe', '注射器');
    mapTags.set('pig man', '猪人');
    mapTags.set('pantyjob', '内裤交');
    mapTags.set('trampling', '践踏');
    mapTags.set('insect girl', '昆虫女孩');
    mapTags.set('squid girl', '乌贼娘');
    mapTags.set('unusual insertions', '异物插入');
    mapTags.set('cuntboy', '人妖');
    mapTags.set('sketch lines', '线稿');
    mapTags.set('nipple expansion', '乳头膨胀');
    mapTags.set('ninja', '忍者装');
    mapTags.set('harpy', '鸟人');
    mapTags.set('multiple breasts', '多乳房');
    mapTags.set('dragon', '龙');
    mapTags.set('monkey', '猴子');
    mapTags.set('gorilla', '猩猩');
    mapTags.set('spider girl', '蜘蛛娘');
    mapTags.set('octopus', '章鱼');
    mapTags.set('futanarization', '扶她化');
    mapTags.set('stewardess', '空姐服');
    mapTags.set('raccoon girl', '浣熊女孩');
    mapTags.set('sheep girl', '羊女孩');
    mapTags.set('worm', '蠕虫');
    mapTags.set('ass expansion', '臀部膨胀');
    mapTags.set('giant', '巨人');
    mapTags.set('ear fuck', '耳交');
    mapTags.set('priest', '牧师服');
    mapTags.set('scrotal lingerie', '阴囊袋');
    mapTags.set('waiter', '男侍者装');
    mapTags.set('horse cock', '马根');
    mapTags.set('vacbed', '真空床');
    mapTags.set('phone sex', '电话性爱');
    mapTags.set('uncle', '叔叔');
    mapTags.set('stretching', '拉伸');
    mapTags.set('nijisanji', '彩虹社');
    mapTags.set('multiple arms', '多臂');
    mapTags.set('wolf', '狼');
    mapTags.set('triple vaginal', '三插阴道');
    mapTags.set('nose fuck', '鼻交');
    mapTags.set('imageset', '图集');
    mapTags.set('slug', '蛞蝓');
    mapTags.set('race queen', '赛车女郎');
    mapTags.set('nipple birth', '乳头出产');
    mapTags.set('kindergarten uniform', '幼儿园制服');
    mapTags.set('monoeye', '独眼');
    mapTags.set('pig girl', '猪女');
    mapTags.set('miyamoto smoke', '宫本烟');
    mapTags.set('tailphagia', '尾巴吞食');
    mapTags.set('pirate', '海盗服');
    mapTags.set('horse girl', '马女孩');
    mapTags.set('hood', '帽兜');
    mapTags.set('ssbbw', '超级胖女人');
    mapTags.set('kappa', '河童');
    mapTags.set('human on furry', '人上毛');
    mapTags.set('eye penetration', '插入眼睛');
    mapTags.set('pole dancing', '猩猩');
    mapTags.set('squirrel girl', '松鼠娘');
    mapTags.set('sockjob', '袜交');
    mapTags.set('headphones', '头戴式耳机');
    mapTags.set('merman', '人鱼');
    mapTags.set('foot insertion', '足插入');
    mapTags.set('zurikishi', 'ずり騎士');
    mapTags.set('gasmask', '防毒面具');
    mapTags.set('mature', '成熟');
    mapTags.set('hololive', 'Hololive');
    mapTags.set('eel', '鳗鱼');
    mapTags.set('handicapped', '残疾');
    mapTags.set('analphagia', '肛门吞食');
    mapTags.set('ponygirl', '小马女');
    mapTags.set('sarashi', '缠胸布');
    mapTags.set('nazi', '纳粹军装');
    mapTags.set('shuhan', '蜀汉');
    mapTags.set('misc', '杂项');
    mapTags.set('yukkuri', '油库里');
    mapTags.set('hanging', '绞刑');
    mapTags.set('how to', '教程');
    mapTags.set('spider', '蜘蛛');
    mapTags.set('adventitious vagina', '畸位阴道');
    mapTags.set('legjob', '腿交');
    mapTags.set('otokofutanari', '扶他');
    mapTags.set('anal prolapse', '脱肛');
    mapTags.set('shark girl', '鲨女孩');
    mapTags.set('low guro', '低存在猎奇');
    mapTags.set('widower', '鳏夫');
    mapTags.set('lizard guy', '蜥蜴男孩');
    mapTags.set('headless', '无头');
    mapTags.set('multiple straddling', '人跨骑');
    mapTags.set('western cg', '西方CG');
    mapTags.set('straitjacket', '拘束衣');
    mapTags.set('4uu', '4UU');
    mapTags.set('kodomo doushi', '两小无猜');
    mapTags.set('haigure', '高叉装');
    mapTags.set('slime boy', '史莱姆男孩');
    mapTags.set('multiple handjob', '多重打手枪');
    mapTags.set('animal on animal', '兽上兽');
    mapTags.set('tabi socks', '足袋');
    mapTags.set('giant sperm', '巨大精子');
    mapTags.set('squid boy', '乌贼男');
    mapTags.set('kneepit sex', '膝下性交');
    mapTags.set('adventitious penis', '畸位阴茎');
    mapTags.set('maggot', '蛆');
    mapTags.set('hijab', '头巾');
    mapTags.set('penis birth', '阴茎出产');
    mapTags.set('muscle growth', '肌肉成长');
    mapTags.set('animegao', '头壳');
    mapTags.set('lipstick mark', '口红印');
    mapTags.set('monkey girl', '猴女孩');
    mapTags.set('sole pussyboy', '单扶他');
    mapTags.set('rabbit', '兔子');
    mapTags.set('adventitious mouth', '畸位口');
    mapTags.set('nudism', '裸体主义');
    mapTags.set('afro', '爆炸头');
    mapTags.set('scat insertion', '粪便插入');
    mapTags.set('mimamoriencyo', 'みまもり園長');
    mapTags.set('nyama', 'にゃまる');
    mapTags.set('snail girl', '蜗牛女孩');
    mapTags.set('breast reduction', '乳房缩小');
    mapTags.set('dolphin', '海豚');
    mapTags.set('bat girl', '蝙蝠娘');
    mapTags.set('bear girl', '狗熊娘');
    mapTags.set('rim', 'りむ');
    mapTags.set('food on body', '人体盛宴');
    mapTags.set('snake boy', '蛇男');
    mapTags.set('ssbbm', '超级胖男人');
    mapTags.set('raccoon boy', '浣熊男孩');
    mapTags.set('fish', '鱼');
    mapTags.set('western imageset', '西方图集');
    mapTags.set('grandfather', '祖父');
    mapTags.set('insect boy', '昆虫男孩');
    mapTags.set('dinosaur', '恐龙');
    mapTags.set('mute', '哑巴');
    mapTags.set('fox', '狐狸');
    mapTags.set('western non-h', '西方无H');
    mapTags.set('mokkorihan', 'もっこりはん');
    mapTags.set('fanny packing', '人肉腰包');
    mapTags.set('kangaroo', '袋鼠');
    //#endregion

    const DATA = JSON.parse(GM_getResourceText('DATA'));
    const parody = DATA['data'][3]['data'];
    const character = DATA['data'][4]['data'];
    const group = DATA['data'][5]['data'];
    const artist = DATA['data'][6]['data'];


    //详情画廊页
    if (/^https:\/\/nhentai.net\/g\/\d{1,7}\/$/.test(document.URL)) {
        //#region 标签标题翻译

        tags.querySelectorAll('div.tag-container').forEach(item => {
            var tagHeader = item.firstChild;
            var tagHeaderText = tagHeader.textContent.trim();
            if (mapTagHeaders.has(tagHeaderText)) {
                tagHeader.textContent = mapTagHeaders.get(tagHeaderText);
            }
        });
        //#endregion

        //#region 复制id翻译
        var observer = new MutationObserver(function (mutationList, observer) {
            for (let mutation of mutationList) {
                if (mutation.type === 'childList' && mutation.removedNodes.length === 0) {
                    var message = mutation.addedNodes[0].childNodes[0];
                    message.textContent = message.textContent.slice(7, -18) + '已复制';
                }
            }
        });
        observer.observe(messages, { childList: true });
        //#endregion

        //#region 标签翻译

        tags.querySelectorAll('span.name').forEach(item => {
            if (mapTags.has(item.textContent)) {
                item.textContent = mapTags.get(item.textContent);
            }
            else if (parody[item.textContent]) {
                item.textContent = parody[item.textContent]['name'];
            }
            else if (character[item.textContent]) {
                item.textContent = character[item.textContent]['name'];
            }
            else if (group[item.textContent]) {
                item.textContent = group[item.textContent]['name'];
            }
            else if (artist[item.textContent]) {
                item.textContent = artist[item.textContent]['name'];
            }
        });
        //#endregion

        //上传日期
        translateTime(tags.querySelector('time'));

        //收藏&下载按钮
        addObserver(favorite.querySelector('.text'), translateFavorite, '收藏按钮文字更新');
        download.lastChild.textContent = '下载(BT种子)';

        //显示更多&全部
        const showAllImagesUI = content.querySelector('#show-all-images-container');
        if (showAllImagesUI) {
            showAllImagesUI.querySelector('#show-more-images-button > .text').textContent = '显示更多';
            showAllImagesUI.querySelector('#show-all-images-button > .text').textContent = '显示全部';
        }

        //相似推荐
        content.querySelector('#related-container > h2').textContent = '相似推荐';

        //发布评论
        content.querySelector('#comment-post-container > h3').lastChild.textContent = ' 发布评论';
        id_body.placeholder = '本站不提供翻译，不要问了。';
        comment_form.querySelector('.btn-primary').lastChild.textContent = ' 评论';

        //评论区
        observer = new MutationObserver(function (mutationList, observer) {
            for (let mutation of mutationList) {
                if (mutation.type === 'childList' && mutation.removedNodes.length === 0) {
                    if (mutation.addedNodes[0].tagName === 'H3') {
                        mutation.addedNodes[0].textContent = '评论加载……';
                    }
                    else {
                        mutation.addedNodes.forEach(item => {
                            translateTime(item.querySelector('time'));
                            item.querySelector('.fa-flag').remove();
                            var hr = document.createElement('hr');
                            hr.align = 'center';
                            hr.width = -10;
                            hr.color = '#888888';
                            item.after(hr);
                        });
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(comments, { childList: true });

    }
    //主页
    else if (document.URL === 'https://nhentai.net/' || document.URL === 'https://nhentai.net/?page=1') {
        content.querySelector('.fa-fire').parentNode.lastChild.textContent = ' 当前热门';
        content.querySelector(".fa-box-tissue").parentNode.lastChild.textContent = ' 最新上传';
    }
    //收藏夹
    else if (document.URL.startsWith('https://nhentai.net/favorites/')) {

        var userName = document.querySelector(".username").textContent;
        content.querySelector('h1').childNodes[1].textContent = `${userName}的收藏`;

        favcontainer.querySelectorAll('.remove-button > span').forEach(item => {
            item.textContent = '取消收藏';
        });
    }
    //设置页面
    else if (document.URL.startsWith('https://nhentai.net/users/') && document.URL.endsWith('/edit')) {
        content.querySelector('h1').lastChild.textContent = ' 设置';

        const mapSettings = new Map();
        mapSettings.set('Username', '用户名');
        mapSettings.set('Email', '邮箱');
        mapSettings.set('Avatar', '头像');
        mapSettings.set('About', '介绍');
        mapSettings.set('Favorite Tags', '喜欢的标签');
        mapSettings.set('Theme', '主题');
        mapSettings.set('Old Password', '旧密码');
        mapSettings.set('New Password', '新密码');
        mapSettings.set('Confirm', '确认密码');
        content.querySelectorAll('.form-group > label').forEach(item => {
            if (mapSettings.has(item.textContent)) {
                item.textContent = mapSettings.get(item.textContent);
            }
        });

        id_username.placeholder = '用户名';
        id_email.placeholder = '邮箱(可选)';
        content.querySelector('.form-control-avatar > label').lastChild.textContent = '删除头像';
        id_theme.childNodes[0].textContent = '浅色';
        id_theme.childNodes[1].textContent = '蓝色';
        id_theme.childNodes[2].textContent = '黑色';
        content.querySelector('p').textContent = '如果要更改密码，请输入旧密码和新密码。';
        id_old_password.placeholder = '旧密码';
        id_new_password1.placeholder = '新密码';
        id_new_password2.placeholder = '确认密码';
        content.querySelector('.btn-primary').textContent = '保存设置';
        content.querySelector('.btn-secondary').textContent = '删除账号';
        var message = messages.querySelector('.message');
        if (message)
            message.textContent = '您的用户设置已更新';
    }
    //删除账号
    else if (document.URL.startsWith('https://nhentai.net/users/') && document.URL.endsWith('/delete')) {
        content.querySelector('h2').textContent = '删除我的账号';
        var p = content.querySelector('p');
        p.childNodes[0].textContent = '即将删除账户，';
        p.childNodes[1].textContent = '此操作无法撤销';
        p.childNodes[2].textContent = '。';
        content.querySelector('.control-label').textContent = '输入您的用户名';
        content.querySelector('.btn-primary').textContent = '取消操作';
        content.querySelector('.btn-secondary').textContent = '删除账号';
    }
    //屏蔽的标签
    else if (document.URL.startsWith('https://nhentai.net/users/') && document.URL.endsWith('/blacklist')) {
        content.querySelector('h1').lastChild.textContent = '屏蔽的标签';
        content.querySelectorAll('div.tag-container').forEach(item => {
            var tagHeader = item.firstChild;
            var tagHeaderText = tagHeader.textContent.trim();
            if (mapTagHeaders.has(tagHeaderText)) {
                tagHeader.textContent = mapTagHeaders.get(tagHeaderText);
            }
        });
        content.querySelector('.btn-primary').textContent = '保存';
    }
    //用户页面
    else if (document.URL.startsWith("https://nhentai.net/users/")) {

        content.querySelector('b').textContent = '注册日期:';
        var timeElement = content.querySelector('time');
        var timeText = new Date(timeElement.dateTime).toLocaleString('zh-cn', { dateStyle: 'medium', timeStyle: 'medium' });
        timeElement.replaceWith(timeText);

        var userInfoUI = content.querySelector(".user-info > div");
        if (userInfoUI) {
            userInfoUI.childNodes[0].childNodes[1].textContent = ' 收藏夹';
            userInfoUI.childNodes[1].childNodes[1].textContent = ' 设置';
            userInfoUI.childNodes[2].childNodes[1].textContent = ' 屏蔽的标签';
        }

        content.querySelector('#recent-favorites-container > h2').lastChild.textContent = ' 最近收藏';
        content.querySelector('.fa-comments').parentNode.lastChild.textContent = ' 最近评论';
    }
    //注销页面
    else if (document.URL.startsWith('https://nhentai.net/logout/')) {
        content.querySelector('form').childNodes[2].textContent = '真的要注销吗？';
        content.querySelector('.button-wide').childNodes[1].textContent = '注销';
        content.childNodes[7].firstChild.textContent = '不，';
        content.childNodes[7].lastChild.textContent = '回到之前的页面。';
    }
    //登录页面
    else if (document.URL.startsWith('https://nhentai.net/login/')) {
        content.querySelector('.lead').firstChild.textContent = '放弃一切希望，进入这里';
        id_username_or_email.placeholder = '用户名(或邮箱)';
        id_password.placeholder = '密码';
        content.querySelector('.button-wide').lastChild.textContent = '登录';
        content.childNodes[9].firstChild.textContent = '没有账号？';
        content.childNodes[9].lastChild.textContent = '注册';
        content.childNodes[11].firstChild.textContent = '忘记密码？';
        content.childNodes[11].lastChild.textContent = '重置密码';
    }
    //注册页面
    else if (document.URL.startsWith('https://nhentai.net/register/')) {
        content.querySelector('.lead').firstChild.textContent = '放弃一切希望，进入这里';
        id_username.placeholder = '用户名';
        id_password1.placeholder = '密码';
        id_password2.placeholder = '确认密码';
        id_email.placeholder = '邮箱(可选)';
        content.querySelector('.button-wide').lastChild.textContent = '注册';
        content.childNodes[9].firstChild.textContent = '已有账号？';
        content.childNodes[9].lastChild.textContent = '登录';
    }
    //重置密码
    else if (document.URL.startsWith('https://nhentai.net/reset/')) {
        content.querySelector('.lead').firstChild.textContent = '放弃一切希望，进入这里';
        id_username_or_email.placeholder = '用户名(或邮箱)';
        content.querySelector('.button-wide').lastChild.textContent = '发送';
        content.childNodes[9].firstChild.textContent = '记得密码？';
        content.childNodes[9].lastChild.textContent = '登录';
    }
    //作品页
    else if (document.URL.startsWith('https://nhentai.net/parody/')) {
        content.querySelector('.type').textContent = '作品:';
        var item = content.querySelector('span.name');
        if (parody[item.textContent]) {
            item.textContent = parody[item.textContent]['name'];
        }
        translateSort();
    }
    //角色页
    else if (document.URL.startsWith('https://nhentai.net/character/')) {
        content.querySelector('.type').textContent = '角色:';
        var item = content.querySelector('span.name');
        if (character[item.textContent]) {
            item.textContent = character[item.textContent]['name'];
        }
        translateSort();
    }
    //标签页
    else if (document.URL.startsWith('https://nhentai.net/tag/')) {
        content.querySelector('.type').textContent = '标签:';
        var tagName = content.querySelector('span.name');
        if (mapTags.has(tagName.textContent)) {
            tagName.textContent = mapTags.get(tagName.textContent);
        }
        translateSort();
    }
    //作者页
    else if (document.URL.startsWith('https://nhentai.net/artist/')) {
        content.querySelector('.type').textContent = '作者:';
        var item = content.querySelector('span.name');
        if (artist[item.textContent]) {
            item.textContent = artist[item.textContent]['name'];
        }
        translateSort();
    }
    //社团页
    else if (document.URL.startsWith('https://nhentai.net/group/')) {
        content.querySelector('.type').textContent = '社团:';
        var item = content.querySelector('span.name');
        if (group[item.textContent]) {
            item.textContent = group[item.textContent]['name'];
        }
        translateSort();
    }
    //语言页
    else if (document.URL.startsWith('https://nhentai.net/language/')) {
        content.querySelector('.type').textContent = '语言:';
        var languageName = content.querySelector('span.name');
        if (languageName.textContent === 'translated') {
            languageName.textContent = '翻译版';
        }
        else if (languageName.textContent === 'chinese') {
            languageName.textContent = '中文';
        }
        else if (languageName.textContent === 'japanese') {
            languageName.textContent = '日文';
        }
        else if (languageName.textContent === 'english') {
            languageName.textContent = '英文';
        }
        translateSort();
    }
    //类别页
    else if (document.URL.startsWith('https://nhentai.net/category/')) {
        content.querySelector('.type').textContent = '类别:';
        var languageName = content.querySelector('span.name');
        if (languageName.textContent === 'doujinshi') {
            languageName.textContent = '同人志';
        }
        translateSort();
    }
    //搜索页
    else if (document.URL.startsWith('https://nhentai.net/search/')) {
        var results = content.querySelector('h1').lastChild;
        var resultsCount = parseInt(results.textContent.slice(1, -8).replaceAll(',', ''));
        if (resultsCount === 0) {
            content.querySelector('h2').textContent = '没有找到结果';
            content.querySelector('p').textContent = '如果您将标签列入黑名单，它们就不会出现在搜索结果中。';
        }
        else {
            results.textContent = ` ${resultsCount} 个结果`;
        }
        translateSort();
    }
    //标签页
    else if (document.URL.startsWith('https://nhentai.net/tags/')) {
        content.querySelectorAll('span.name').forEach(item => {
            if (mapTags.has(item.textContent)) {
                item.textContent = mapTags.get(item.textContent);
            }
        });
    }
    //作品页
    else if (document.URL.startsWith('https://nhentai.net/parodies/')) {
        content.querySelectorAll('span.name').forEach(item => {
            if (parody[item.textContent]) {
                item.textContent = parody[item.textContent]['name'];
            }
        });
    }
    //角色页
    else if (document.URL.startsWith('https://nhentai.net/characters/')) {
        content.querySelectorAll('span.name').forEach(item => {
            if (character[item.textContent]) {
                item.textContent = character[item.textContent]['name'];
            }
        });
    }
    //社团页
    else if (document.URL.startsWith('https://nhentai.net/groups/')) {
        content.querySelectorAll('span.name').forEach(item => {
            if (group[item.textContent]) {
                item.textContent = group[item.textContent]['name'];
            }
        });
    }
    //作者页
    else if (document.URL.startsWith('https://nhentai.net/artists/')) {
        content.querySelectorAll('span.name').forEach(item => {
            if (artist[item.textContent]) {
                item.textContent = artist[item.textContent]['name'];
            }
        });
    }
    //介绍信息页
    else if (document.URL.startsWith('https://nhentai.net/info/')) {
        var Features = document.querySelector('#info-container').childNodes[0];
        var Accounts = document.querySelector('#info-container').childNodes[1];
        var Search = document.querySelector('#info-container').childNodes[2];
        var touch = document.querySelector('#info-container').childNodes[3];

        Features.childNodes[0].textContent = '功能';
        Features.childNodes[1].childNodes[0].textContent = '我们永远不会添加论坛。';
        Features.childNodes[1].childNodes[1].textContent = '您很快就可以上传和编辑图库了。';

        Accounts.childNodes[0].textContent = '账号';
        Accounts.childNodes[1].childNodes[0].textContent = '无限的收藏夹';
        Accounts.childNodes[1].childNodes[1].textContent = '标签黑名单';
        Accounts.childNodes[1].childNodes[2].textContent = '三个华丽的主题：浅色、蓝色和黑色。';

        Search.childNodes[0].textContent = '搜索';
        var searchItem = Search.childNodes[1].childNodes;
        searchItem[0].childNodes[0].textContent = '您可以同时搜索多个词条，以下内容将仅返回包含这两个词条的图库。例如：';
        searchItem[0].childNodes[2].textContent = '寻找所有图库，其中同时包含了';
        searchItem[0].childNodes[4].textContent = '和';
        searchItem[0].childNodes[6].textContent = '。';

        searchItem[1].childNodes[0].textContent = '您可以排除词条，通过在词条前加上前缀';
        searchItem[1].childNodes[2].textContent = '。例如：';
        searchItem[1].childNodes[4].textContent = '寻找所有图库，其中同时包含了';
        searchItem[1].childNodes[6].textContent = '和';
        searchItem[1].childNodes[8].textContent = '但是不包含';

        searchItem[2].childNodes[0].textContent = '可以通过将词条添加双引号来进行精确搜索。例如：';
        searchItem[2].childNodes[2].textContent = '仅匹配标题或标签中某处具有“big breasts”的图库';

        searchItem[3].childNodes[0].textContent = '词条可以与标记命名空间结合使用，以便更好地控制查询：';

        searchItem[4].childNodes[0].textContent = '您可以搜索具有特定页数的图库';
        searchItem[4].childNodes[2].textContent = '或特定的页数范围：';

        searchItem[5].childNodes[0].textContent = '您可以使用以下方法搜索在某个时间范围内上传的图库';
        searchItem[5].childNodes[2].textContent = '有效单位为';
        searchItem[5].childNodes[12].textContent = '。你也可以指定一个范围';
        searchItem[5].childNodes[14].textContent = '。';

        touch.childNodes[0].textContent = '想与我们联系？';
        touch.childNodes[1].childNodes[0].childNodes[0].textContent = '邮箱：';
        touch.childNodes[1].childNodes[0].childNodes[2].textContent = '（如果您遇到技术问题，请包含您的操作系统和浏览器信息以及版本号）';

        thanks.childNodes[0].textContent = '感谢您对网站的支持！';
    }

})();