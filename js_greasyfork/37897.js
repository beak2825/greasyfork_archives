
// ==UserScript==
// @name         deepin forum block
// @namespace    https://greasyfork.org/scripts/37897-deepin-forum-block
// @version      0.15.50
// @description  deepin forum block script
// @author       iamhyc65
// @match        https://bbs.deepin.org/
// @match        *://bbs.deepin.org/*
// @downloadURL https://update.greasyfork.org/scripts/37897/deepin%20forum%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/37897/deepin%20forum%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let nastyname = "&nbsp;";
    let blacklist = [
        //the maintainer
        'iamhyc65', 
        //block list
        'MMDMM', 'lineme', 'geisj', 'isunny', 'duanyao', 'comzhong', 'ritter', 'patinecec', 'squarefong', 'javim',
        'mohistman',  'cscxk', 'ruclinux', 'gaoshou', 'sonichy', 'iminto', 'mianyz', 'gaopin', 'tankwoks', 'netzx',
        'csuZipple', 'berners', 'kinggu',  'lenke', 'wonchong', 'fxbszj', 'yievtln', 'senjane', 'champ', 'Lyvnee',
        'moriwuhen', 'ihaibo', 'Tzeng', 'JadeLiu', 'kogca', 'devming', 'xutong', 'huys', 'oocool', 'mxdlzg', 
        'herdde', 'longxiang', 'Feelup', 'ztjzxf', 'lupan', 'shenweiyan', 'freeor', 'fears', 'milu', 'erge',
        'deii', 'i3ekr', 'helloyong', 'freelyhx', 'l0rraine', 'jzjbyq', 'xinyonghu', 'yuanmeng', 'senkawu', 'uitb',
        'deepIgood', 'anny', 'o0o0o', 'anjinbao', 'muzilee', 'sinan', 'russrao', 'yjhiiiigu', 'geange', 'diebian',
        'sxdtzl', 'jrsamfl', 'deepinbaby', 'zjzvvv', 'shenhai', 'wzhjcj', 'chnyang', 'honghust', 'fwinac', 'kunun',
        'markson', 'xiaojia', 'marsruc', 'applefang', 'haohaohao', 'arlly', 'cidkey', 'leanhorse', 'bababava',
        'ifango', 'chinwz', 'zjzvvv',  'lulinux', 'chaojun56', 'zhyi23', 'thisuan', 'oldfeel', 'neutront', 'l17es',
        'muye', 'hodge', 'denjay', 'lixiaobai', 'ktvsp1', 'wolfblood', 'canmei', 'sjxhyanhao', 'wangc', 'cppddz',
        'ailing', 'xayah', 'deano0o7', 'tobecxbii', 'rocket', 'limo2', 'icelee', 'sdrlf', 'kuake', 'jarvan', 'jack',
        'xymanwh', 'valerian', 'mydream', 'linbin0o0', 'zfdllh', 'daloyanf', 'snsmqing', 'ywxt', 'solarup', 'bsidb',
        'gmaso', 'wffger', 'gregory', 'oldcathb', 'fangling', 'shilongcn', 'hykjfc',  'qutudou', 'alisleepy', 
        'aksss', 'xiongce', 'dzuiuabi', 'chaojimp3', 'zijinyise', 'ahyanglf', 'fant', 'snowx', 'senlin', 'lyerbird',
        'jusorlee', 'DPsenlin', 'gongsong', 'yping', 'jzhq1', 'juanda', 'wenjian', 'dxushe', 'joeng4', 'TONG2',
        'cnnbwhq', 'steelyguo', 'linyg', 'imgradeone', 'licardo', 'gtjmaster', 'fungleo', 'yech', 'angusdp', 'ishq',
        'carlose', 'SYSqq', 'geekrainy', 'vampires', 'suoniao',  'wzkjzx', 'moxin', 'madness', 'maopudafei', 'sfes',
        'bainian', 'lssg', 'zqsadm', 'keke', 'margetts99', 'frankpian', 'gongfudog', 'ventus', 'courier', 'drane',
        'ramboshen', 'flyrose25', 'longma', 'jiao', 'swotpp', 'cdooow', 'Pachelble', 'castle', 'macro', 'fozei',
        'dyedust', 'kangbaba', 'zyol', 'mockan', 'Aladding', 'xeepoo', 'ifuleni', 'hyikesong', 'kiontly', 'sirw',
        'timcui', 'ventus', 'mingyea', 'yyqdata', 'xiaobo', 'zzwxs', 'taishou', 'echophil', 'wildgoose', 'zhouguo',
        'iuuniang', 'fanf6g', 'dzhy', 'fangxing', 'yjlcgw', 'stevenkang', 'hswddan', 'mikerust', 'youngswan',
        'wangmj', 'windstore', 'bpmf', 'bkkkd', 'lucifer69', 'sjtlqy', 'rogemcy', 'bingmao', 'steelchen', 'n0name',
        'baikol', 'lxflhy', 'ncayan', 'kongdao', 'wangseaii', 'alevain', 'gyang', 'winterd', 'tinglin', 'redskywei',
        'jerry79', 'mjchow', 'guyusong', 'woopng', 'bonzer', 'ybbfpe', 'qurrer', 'ckurobac', 'ganrui', 'goodway',
        'liuxuango', 'JJRDC', 'maxiaoan', 'jiangzm', 'zhanj', 'joecy', 'abnertan', 'zgsabi', 'mqqdg', 'maggch',
        'zhongqian', 'itwuhu', 'chunxin', 'dio99', 'idylist', 'phillipqu', 'auke', 'lianzhu', 'qtvbwfn', 'dameng',
        'MCredbear', 'hudaxiao', 'vivvonylf', 'ieayoio', 'leozhou99', 'soupin', 'twoer', 'iammsf', 'yida', 'syydlr',
        'hwycdxd', 'DrMolotov', 'concord', 'willxue', 'luyouxi', 'frankdeep', 'caiden', 'gundamX', 'leochen', 'pota',
        'doitsexy', 'huanmm', 'zhtengw', 'scruom', 'DzJan', 'ijessie', 'xycc', 'monvay', 'lukumavs', 'xjjfp', 'zlmx',
        'didida', 'qinoq', 'aistard', 'Lfxmaple', 'junstr', 'rogerdjq', 'klistchko', 'mlooo', 'kenshin', 'lxingshan',
        'realgm', 'jtcsboy', 'mrdoubleu', 'Kingtous', 'toni', 'allenyang', 'lxingshan', 'zxmzzg', 'huanglm', 'Aiden',
        'tairan', 'jidongg', 'exqlnet', 'fisherb13', 'chungbin', 'ashakii', 'niecho', 'nhnhwsnh', 'yimaokang',
        'wazg', 'pkvszf', 'y9z8q7', 'pmzdeepin', 'uonuoyaya', 'aocn', 'yorun', 'machine', 'jzhliming', 'mkq01',
        'yzxpp8', 'siyucn', 'jroam', 'dakzeon', 'yeser', 'ocloh', 'arst', 'YonChun', 'Blogghete', 'liuyujian',
        'linefeed', 'panpanpdj', 'BingBling', 'muqiu', 'pychen', 'wilsin', 'mideaos', 'wuxinvip', 'hucj', 'deadpool',
        'lanceadd', 'traiyi', 'keysliu', 'kenyg', 'jamezyq', 'kaliliu', 'juzisang', 'doraemon', 'huyou95', 'Flyaut',
        'deepinaaa', 'ichampion', 'imever', 'wikia', 'iVampireSP', 'pengsuhao', 'iwanan', 'mindful', 'xiaodao',
        'leshuity', 'weiweiwei', 'woden', 'wxldpj', 'maxin', 'raysong', 'kieyongh', 'childhood', 'lobyinser',
        'caoying', 'fantasys', 'qdlyg', 'HarryZhao', 'heqi', 'zarnest', 'yhdd', 'pdyang', 'sunset', 'inmlau',
        'mayerllm', 'meetshawn', 'moolee', 'bingeneral', 'juji', 'gardnerzhao', 'cliche', 'pavilion', 'kkkzt',
        'mojp', 'bnboy', 'rzbtss', 'plinux', 'olove6', 'jiocao', 'kaikai', 'rmbma', 'ggfish', 'xzayuqq', 'sjycool',
        'Cogent', 'aboutyou', 'linuxbook', 'ifeng', 'diplor', 'kjskbh', 'fshui8', 'sicauleon', 'mitt', 'summerboy',
        'mobansou', 'beili', 'ktwap', 'qcrane', 'aurthur', 'xlxz', 'pholance', 'sagan', 'dengpan', 'wuqing',
        'ywancord', 'jakevin', 'wunian', 'aifish', 'daveshawn', 'suyao', 'deepblue', 'zhuhbgood', 'icon', 'zyret',
        'nakelesi', 'huangqy', 'uccs', 'liangbr', 'RSTM008', 'howfar', 'duboy', 'rkinux', 'xsky', 'leoisaac',
        'longshao', 'sumcn', 'shantong', 'skysuo', 'xunewman', 'menial', 'siyucao', 'soenter', 'youngkind', 'ymls',
        'GoldZ', 'shaonan', 'tigerye', 'howechen', 'livince', 'linuxops', 'chinanjlb', 'jxtcn', 'zachive', 'fudada',
        'williamts', 'chendenan', 'dsfsdff', 'wuyabbs', 'pcww', 'sugermax', 'switch', 'chysilent', 'snailboy',
        'flybibi', 'OnRoad', 'myccloves', 'deeson', 'JAVAVWV1', 'liao33xin', 'sunyb3', 'qfslyhk', 'zhl2liuli',
        'jtortoise', 'wslfriend', 'bfzldh', 'mulandd', 'txfleo', 'Jackie', 'znncly', 'wangshua', 'goupengzi',
        'xaoye', 'sdsxga', 'kiritoyui', 'v6i6v', 'twtysssy', 'syberia', 'lwjiei', 'xkill', 'lanhu', 'ufwhyygy',
        'timmi', 'arise', 'owish', 'snake', 'wujingzi', 'puck', 'mach50', 'zqcfish', 'ttlankss', 'xks1lc', 'arfield',
        'ldsink', 'buffallos', 'lvzhu', 'drennen', 'mzname', 'fuiter', 'qianshui', 'luolanxin', 'xndmzxh', 'coyote',
        'ztmdcda', 'lijienaa', 'lodan', 'ifocke', 'emmm', 'shenjing', 'daxiga', 'lupipi', 'laputa', 'haiy', 'snipe',
        'aaluba', 'chatop', 'cangfeng', 'kaito95', 'bibigo', 'cclong', 'yxiang', 'qiushao', 'sysop', 'mingbai',
        'lvyunpeng', 'markyin', 'dundhil', 'hitecyu', 'kangdei', 'nero28', 'tasuo', 'anysoft', 'ljyls', 'fatefl1',
        'robindov', 'cjydayang', 'yepchain', 'zealot', 'sulongfei', 'serenity', 'haowa13', 'mjchen', 'ssjun',
        'hongqt', 'zsxhui', 'likeolive', 'ljbaaa', 'hzshida', 'nianfouyi', 'svfeng', 'guolimin', 'deshitong',
        'chensure', 'gbinb', 'drepr', 'hearin', 'bibiuc', 'nerosong', 'URjr', 'javanli', 'amitabh', 'tianwuhao',
        'qiyebb', 'xysemies', 'nagaran', 'dfergfla', 'ccdalao', 'amerysong', 'Orzogc', 'securite', 'joybely',
        'ngfchl', 'rzhli', 'yehai', 'zawhyx', 'eremiter', 'wuying', 'rolllong', 'mztogon', 'mhlan', 'shooke',
        'baozaili', 'yubing', 'ydelusion'
    ];

    let num_regex = new RegExp("[0-9]{3,}"); //contain too many numbers

    function check(user_name) {
        if (user_name.length<4 || user_name.length>=10) {
            return true;
        }
        if (num_regex.test(user_name) || user_name.search("_")>0 || user_name.search("-")>0) {
            return true;
        }
        if (blacklist.includes(user_name)) {
            return true;
        }
        
        return false;
    }

    let items = [];

    //threadlist check
    let thread_list = document.getElementById('threadlist');
    if (thread_list != null) {
        console.warn('thread_list check here.');
        thread_list = thread_list.getElementsByClassName('bm_c')[0].getElementsByTagName('table')[0].children;

        for(let thread of thread_list) {
            let author, reply;
            try {
                author = thread.getElementsByClassName('author')[0].children[0].children[0].innerText;
                reply = thread.getElementsByClassName('last-reply')[0].children[1].children[0].children[0];
            } catch (e) {
                continue;
            }
            if (check(author)) {
                console.log(author, 'removed in thread');
                items.push(thread);
            }
            else if (check(reply.innerText.trim())){
                reply.outerHTML = nastyname;
            }
        }
        for(let item of items) {
            item.remove();
        }
    }

    //posts check
    items = [];
    let posts = document.getElementById('postlist');
    if (posts != null) {
        console.warn('posts check here.');
        posts = posts.children;
        let post_len = posts.length - 1;

        for (let i = 0; i < post_len; i++) {
            let author;
            try {
                author = posts[i].getElementsByClassName('author')[0].children[0].innerText;
            } catch (e) {
                continue;
            }
            if (check(author)) {
                console.log(author, 'removed in post');
                items.push(posts[i]);
            }
        }
        for(let item of items) {
            item.remove();
        }
    }

    //psta check
    items = [];
    let psta = document.getElementsByClassName('psta');
    if (psta) {
        console.warn('psta check here.');

        for (let item of psta) {
            for (let user of blacklist) {
                if (item.innerText.search(user) > 0) {
                    console.log(user, 'removed in psta');
                    items.push(item.parentElement);
                    break;
                }
            }
        }
        for(let item of items) {
            item.remove();
        }
    }
    //end
})();