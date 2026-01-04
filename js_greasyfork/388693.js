// ==UserScript==
// @name         wanbentxt
// @namespace    http://tampermonkey.net/
// @version      0.63
// @description  https://m.wanbentxt.com/ 的小说下载
// @author       You
// @match        https://m.wanbentxt.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388693/wanbentxt.user.js
// @updateURL https://update.greasyfork.org/scripts/388693/wanbentxt.meta.js
// ==/UserScript==

 
(function ( ) {
    'use strict';


    var DivInited = false;
    var WCContent, WCWords, WCQuit, WCSave, WCContinue;
    var pagenum = 0, chapternum = 0;
    var title, Id, authior, desc;
    var listpage = [];
    var oldurl = 'null';

    function initDiv() {
        console.log("initDiv");
        if (DivInited) return;
        DivInited = true;
        var content = document.createElement("div");
        document.body.appendChild(content);
        content.outerHTML = `
      <div id="CWDownContent" >
        <div style="width:360px;height:100px;position:fixed;left:50%;top:50%;margin-top:-50px;margin-left:-180px;z-index:100000;background-color:#ffffff;border:1px solid #afb3b6;opacity:0.95;filter:alpha(opacity=95);box-shadow:5px 5px 20px 0px#000;">
          <div id="CWDownWords" style="font-size:12px;position:absolute;width:290px;height:90px;padding: 8px;border-radius: 10px;float: left;">
          </div>
          <div style="float: right;">
            <div id="CWDownSave" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 5px 5px 3px 3px;">
              <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">保存</span>
            </div>
            <div id="CWDownQuit" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 3px;">
              <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">取消</span>
            </div>
            <div id="CWCContinue" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 3px;">
            <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">繼續</span>
          </div>
          </div>
        </div>
      </div>
      `;

        WCContent = document.querySelector("#CWDownContent");
        WCWords = document.querySelector("#CWDownWords");
        WCQuit = document.querySelector("#CWDownQuit");
        WCSave = document.querySelector("#CWDownSave");
        WCContinue = document.querySelector("#CWCContinue");
        WCContinue.style.display = "none";

        WCQuit.onclick = function () {
            DivInited = false;
            WCContent.style.display = "none";
            WCWords.innerHTML = '';
            WCContent.parentNode.removeChild(WCContent);
        };
        WCContinue.onclick = function () {
        };
        WCSave.onclick = function () {
            SaveText();
        };
    }

    function ShowWords(value) {
        WCWords.innerHTML = (title ? title + '<br>' : '') + value;
    }

    function inits() {
        var content = document.createElement("div");
        document.body.appendChild(content);
        content.outerHTML = `
        <div id="initsContent">
        <div style="width:40px;height:25px;position:fixed;left:10PX;top:10PX;z-index:100000;/*! background-color:#ffffff; *//*! border:1px solid #afb3b6; *//*! opacity:0.95; */filter:alpha(opacity=95);">
          <div id="initsSave" style="/*! width:43px; *//*! height:26px; */cursor: pointer;background-color:#3169da;/*! margin: 2px 5px 3px 10px; */">
            <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size: 10px;">下载</span>
          </div>
        </div>
        </div>
`;

        var initsSave = document.querySelector("#initsSave");

        initsSave.onclick = function () {
            initDiv();
            run();
        }
    }

    function getElementRootText(element) {
        let ret = "";
        for (const i of element.childNodes) {
            if (i.nodeType === i.TEXT_NODE || i.nodeName == 'T') {
                ret += i.nodeValue + '\r\n';
            }
        }
        return ret.replace(/^\s+|\s+$/g, "");
    }

    async function gethtml(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest(
                {
                    url: url,
                    method: "GET",
                    onload: function (response) {
                        resolve(response.responseText);
                    }
                });
        });
    }

    async function getonepage(pageurl, text) {
        if (!text) text = '';
        let str = await gethtml(pageurl);
        let doc = $('<html></html>');
        doc.html(str);
        let title = doc.find('.readerTop h3').text();
        if (!title) {
            title = $(lista[i]).text();
        }
        let content = doc.find('.raderCon');
        if (content.length > 0) {
            let value = content.html();
            value = textchange(value);
            text = text + '\r\n' + value;
        }
        let retext = text;
        let next = doc.find('.page > a:nth-child(3)');
        if (next.length > 0) {
            console.log(next.text());
            if (next.text() == '下一页') {
                let href = next.attr('href');
                console.log(href);
                if (href)
                    retext = retext + await getonepage('https://m.wanbentxt.com' + href, text)
            }
        }

        return retext;
    }


    async function getpage(pageurl) {
        if (!pageurl) return;
        pagenum++;
        let pagestr = await gethtml(pageurl);
        let pagedoc = $('<html></html>');
        pagedoc.html(pagestr);
        var lista = pagedoc.find('.chapterList > ul>a');
        console.log(lista);

        for (let i = 0; i < lista.length; i++) {
            chapternum++;
            ShowWords(`正在下载<br>第${pagenum}页<br>第${chapternum}章节`)
            let url = lista[i].href;
            console.log(url);
            let str = await gethtml(url);
            let doc = $('<html></html>');
            doc.html(str);
            let title = doc.find('.readerTop h3').text();
            if (!title) {
                title = $(lista[i]).text();
            }

            let value;

            let content = doc.find('.raderCon');
            if (content.length > 0) {
                value = content.html();
            }

            let next = doc.find('.page > a:nth-child(3)');
            if (next.length > 0) {
                if (next.text() == '下一页') {
                    value = await getonepage(url)
                }
            }




            value = textchange(value);
            if (value) {
                listpage.push({ title: title, content: value });
            } else {
                listpage.push({ title: title, content: '下載失敗' });
            }

        }

        var next = pagedoc.find('.page > a:nth-child(3)');
        if (next.length > 0) {
            let nexturl = 'https://m.wanbentxt.com' + next.attr('href');
            if (oldurl != nexturl) {
                oldurl = nexturl;
                console.log(nexturl);
                await getpage(nexturl);
            } else {
                console.log('end');
                console.log(listpage);
            }
        }

    }



    async function gettitle() {
        var m = /m\.wanbentxt\.com\/(\d+)/.exec(location.href);
        //console.log(m);
        if (m) {
            Id = m[1];
            let Idurl = 'https://m.wanbentxt.com/' + Id + '/';
            let Idstr = await gethtml(Idurl);
            let Iddoc = $('<html></html>');
            Iddoc.html(Idstr);
            desc = Iddoc.find('.bookInfo').text();
            if (!desc)
                desc = desc.replace(/（?www.wanbentxt.com\)?/, '');
            authior = Iddoc.find('.bookPhrMid p:nth-child(1)').text();
            title = Iddoc.find('.bookPhr h2').text();
            return 'https://m.wanbentxt.com/' + Id + '/all.html'
        }
        return null;
    }


    async function run() {

        let t = /m\.wanbentxt\.com\/(\d+)\/(\d+)/.exec(location.href);
        console.log(t);

        if (!t || t.length == 0) {
            console.log('null');
            extendRule(rulereplace);
            let reurl = await gettitle();
            await getpage(reurl);
            console.log('end');
            SaveText();

        }
        else {
            console.log('not null');

            let text = await getonepage(location.href);
            if (text) {
                text = textchange(text);
                let t = $('.header h2');
                if (t.length > 0)
                    t = t.text();
                if (!t)
                    t = document.title;
                let t1 = $('.readerTop');
                if (t1.length > 0)
                    t1 = t1.text();
                ShowWords(`已下载完成<br> ${t} `)
                var blob = new Blob([t, "\r\n", t1, "\r\n\r\n", text], { type: "text/plain;charset=utf-8" });
                saveAs(blob, t + '.txt');

            }

        }
    }

    function SaveText() {
        if (!listpage || listpage.length == 0) return;

        let save = [];
        $.each(listpage, function (index, value) {
            save.push(value.title + '\r\n' + value.content + '\r\n\r\n');
        });
        ShowWords(`已下载完成<br>共${pagenum}页<br>共${chapternum}章节`)
        var blob = new Blob([title, "\r\n", authior, "\r\n", desc, "\r\n\r\n", save.join('\r\n')], { type: "text/plain;charset=utf-8" });
        saveAs(blob, title + '.txt');
    }

    inits();










    function textchange(value) {
        value = value.replace(/<br>/g, "\r\n");

        var onenum = value.indexOf("\r\n")
        var onerow = value.substring(0, onenum).trim();

        while (!onerow) {
            onenum = value.indexOf("\r\n", onenum + 1)
            onerow = value.substring(0, onenum).trim();
        }
        if (onerow) {
            if (onerow.indexOf('wanbentxt') > 0 || onerow.indexOf('完本神站') > 0 || /完[\s\S]{0,12}本[\s\S]{0,12}神[\s\S]{0,12}站/.test(onerow))
                value = value.substring(onenum);
        }

        var lastnum = value.lastIndexOf("\r\n")
        var lastrow = value.substring(lastnum).trim();
        while (!lastrow) {
            lastnum = value.lastIndexOf("\r\n", lastnum - 1)
            lastrow = value.substring(lastnum).trim();
        }

        if (lastrow) {
            if (lastrow.indexOf('wanbentxt') > 0 || lastrow.indexOf('完本神站') > 0 || /完[\s\S]{0,12}本[\s\S]{0,12}神[\s\S]{0,12}站/.test(lastrow))
                value = value.substring(0, lastnum);
        }

        value = textreplace(value);
        textselect(value);

        value = value.replace(/一秒记住.*?wanbentxt\.com/i, '');
        value = value.replace(/一秒记住.*?Wanbentxt\.coΜ/i, '');
        value = value.replace(/一秒记住.*?找不到书请留言！?/g, '');
        value = value.replace(/支持.*?找不到书请留言！?/g, '');
        value = value.replace(/支持.*?你们的宣传支持就是最的动力!?/g, '');
        value = value.replace(/支持.*?你们的支持就是大大的动力！?/g, '');
        value = value.replace(/支持.*?分享给你们的好友！?/g, '');
        value = value.replace(/支持.*?你的小伙伴吧！?/g, '');
        value = value.replace(/搜一下就能找到.*?分享！?/g, '');



        value = value.replace(/【完本神站】.*?永不丢失！?/g, '');
        value = value.replace(/【完本神站】.*?想看的书！?/g, '');
        value = value.replace(/喜欢神站.*?书友们?！?/, '');
        value = value.replace(/喜欢神站.*?朋友们?！?/, '');
        value = value.replace(/更多[\u4e00-\u9fa5].?好书[\u4e00-\u9fa5].?/g, '');
        value = value.replace(/[\u4e00-\u9fa5].?入娄约木货是复读机[\u4e00-\u9fa5].?/g, '');


        value = value.replace(/[\u4e00-\u9fa5]?本神站[\u4e00-\u9fa5]?/, '');

        value = value.replace(/www.Wanbentxt.com/ig, '');

        value = value.replace('.. :', '');
        value = value.replace('+分', '十分');
        value = value.replace(/-/, '一');
        value = value.replace('.. .', '一');

        value = value.replace(/&amp;/g, "&");
        value = value.replace(/&lt;/g, "<");
        value = value.replace(/&gt;/g, ">");
        value = value.replace(/&nbsp;/g, " ");
        value = value.replace(/&quot/g, "'");

        value = value.replace(/<[^<>]+?>/g, '');

        value = value.replace(/[（=\\ \/]*完[（=\\ \/]*[\s\S]{0,12}[（=\\ \/]*本[（=\\ \/]*[\s\S]{0,12}[（=\\ \/]*神[（=\\ \/]*[\s\S]{0,12}[（=\\ \/]*站[（=\\ \/]*/, '');
        value = value.replace("\r\n\r\n", "\r\n");

        return value;
    }


    // ===== 小说拼音字、屏蔽字修复 =====
    // 运行在未替换 <br> 之前，.* 可能会造成全部替换
    const rulereplace = {
        // ===格式整理===
        // "\\(|\\[|\\{|（|【|｛":"（",
        // "\\)|\\]|\\}|）|】|｝":"）",

        // 需要？
        ",": "，",
        // ":": "：", "\\?":"？",  // 会造成起点的图片无法替换

        "\\*|＊": "*",
        "[wWｗＷ]{3}": "www",
        "w{3}(\u3001|\u3002)": "www.",
        "[cCｃＣ][oOｏＯ][mMｍＭ]": "com",
        "[nNｎＮ][eｅEＥ][tｔTＴ]": "net",
        "[cCｃＣ][nNｎＮ]": "cn",
        "(\\.|\u3001|\u3002)com": ".com",
        "(\\.|\u3001|\u3002)net": ".net",
        "(\\.|\u3001|\u3002)cn": ".cn",
        "[pPｐＰ][sSｓＳ][:：]": "ps:",
        "。{5,7}": "……", "~{2,50}": "——", "…{3,40}": "……", "－{3,20}": "——",
        //"。(,|，|。)": "。",
        // "？(,|，)": "？",
        //"”(,|，|。)": "”",
        "@{3,}": "",

        // === 段末的多余的r ===
        "\\\\r<br>": "<br>",

        // === 一些特殊的替换 ===
        "\\[+CP.*(http://file.*\\.jpg)\\]+": "<img src='$1'>",
        "『(.)』": "$1",  // "『色』": "色",

        // === 去广告 ===
        "\\[搜索最新更新尽在[a-z\\.]+\\]": "",
        "<a>手机用户请到m.qidian.com阅读。</a>": "",
        ".{2,4}中文网欢迎广大书友": "",
        "访问下载txt小说|◎雲來閣免费万本m.yunlaige.com◎": "",
        "〖∷更新快∷无弹窗∷纯文字∷.*?〗": "",
        '超快稳定更新小说[,，]': '', "本文由　。。　首发": "",
        '”小说“小说章节更新最快': '',
        '如果觉得好看，请把本站网址推荐给您的朋友吧！': '',
        '本站手机网址：&nbsp;&nbsp;请互相通知向您QQ群【微博/微信】论坛贴吧推荐宣传介绍!': '',
        "fqXSw\\.com": "", "\\.5ｄｕ|\\.５du５\\.": "",
        "\\[\\]": "",
        "如果您觉得网不错就多多分享本站谢谢各位读者的支持": "",
        "全文字无广告|\\(看书窝&nbsp;看书窝&nbsp;无弹窗全文阅读\\)": "",
        "。。+[\\s　]*看最新最全小说": "",
        "水印广告测试": "",
        "\\(平南文学网\\)": "", "讀蕶蕶尐說網": "",
        "比奇提示：如何快速搜自己要找的书籍": "", "《百度书名\\+比奇》即可快速直达": "",
        "~无~错~小~说": "",

        "\\(一秒记住小说界\\）|\\*一秒记住\\*": "",
        "uutxt\\.org|3vbook\\.cn|www\\.qbwx\\.com|WWw\\.YaNkuai\\.com|www\\.btzw\\.com|www\\.23uS\\.com": "",
        "txt53712/": "",
        "\xa0{4,12}": "\xa0\xa0\xa0\xa0\xa0\xa0\xa0",

        // === 通用去广告
        "[wｗＷ]{1,3}[．\\.]２３ｕＳ[．\\.](?:ｃｏＭ|com)": "",

        // === 星号屏蔽字还原 ===
        // === 八九 ===
        "十有(\\*{2})": "十有八九",
        "十有bā'九": "十有八九",
        "(\\*{2})不离十": "八九不离十",
        "(\\*{2})点": "八九点",
        "(\\*{2})个": "八九个",
        "(\\*{2})岁": "八九岁",
        "(\\*{2})成": "八九成",
        "(\\*{2})年": "八九年",
        "一八(\\*{2})": "一八八九",

        // === SM ===
        "G(\\*{2})": "GSM",

        // === 情色 ===
        "感(\\*{2})彩": "感情色彩",

        // === 大法 ===
        "强(\\*{2})u5B9D": "强大法宝",
        "强(\\*{2})宝": "强大法宝",
        "种魔(\\*{2})": "种魔大法",
        "巨(\\*{2})": "巨大法",
        "强(\\*{2})术": "强大法术",
        "(\\*{2})师": "大法师",

        // === 肉体 ===
        "(\\*{2})凡胎": "肉体凡胎",
        "夺取她的(\\*{2})": "夺取她的肉体",
        "夺取他的(\\*{2})": "夺取他的肉体",
        "(\\*{2})与精神": "肉体与精神",
        "(\\*{2})素材": "肉体素材",
        "(\\*{2})材料": "肉体材料",
        "在(\\*{2})上": "在肉体上",

        // === 赤裸 ===
        "(\\*{4})着": "赤裸着",
        "(\\*{2})裸": "赤裸裸",
        "浑身(\\*{2})": "浑身赤裸",

        // === 射 ===
        "枪(\\*{4})": "枪发射",
        "(\\*{4})而出": "喷射而出",
        "光(\\*{2})": "光四射",

        // === 鱼水 ===
        "(\\*{2})之欢": "鱼水之欢",

        // === 国军 ===
        "(\\*{2})队": "国军队",
        "(\\*{2})舰": "国军舰",
        "(\\*{2})方": "国军方",

        // === 露阴 ===
        "暴(\\*{2})谋": "暴露阴谋",

        // === 欲望 ===
        "的(\\*{2})是无止境的": "的欲望是无止境的",
        "邪恶的(\\*{2})": "邪恶的欲望",
        "被(\\*{2})支配": "被欲望支配",
        "掀桌的(\\*{2})": "掀桌的欲望",
        "控制不住(\\*{2})": "控制不住欲望",
        "求生的(\\*{2})": "求生的欲望",
        "求生(\\*{2})": "求生欲望",
        "购买(\\*{2})": "购买欲望",
        "永无止境的(\\*{2})": "永无止境的欲望",
        "(\\*{2})的发泄": "欲望的发泄",
        "发泄(\\*{2})": "发泄欲望",
        "杀戮(\\*{2})": "杀戮欲望",
        "(\\*{2})和本能": "欲望和本能",

        // === 呻吟 ===
        "不堪重负的(\\*{2})": "不堪重负的呻吟",
        "(\\*{2})声": "呻吟声",
        "颤抖(\\*{2})": "颤抖呻吟",
        "(\\*{2})颤抖": "呻吟颤抖",

        // === 独立 ===
        "宣布(\\*{2})": "宣布独立",
        "(\\*{2})空间": "独立空间",

        // === 荡漾 ===
        "波纹(\\*{2})": "波纹荡漾",

        // === 喘息 ===
        "(\\*{2})之机": "喘息之机",

        // === 大波 ===
        "一(\\*{2})": "一大波",

        // === 上供 ===
        "(\\*{2})奉": "上供奉",

        // === 奸淫 ===
        "(\\*{2})掳掠": "奸淫掳掠",

        // === 失身 ===
        "有(\\*{2})份": "有失身份",

        // === 六合 ===
        "(\\*{2})八荒": "六合八荒",

        // === 人祸 ===
        "天灾(\\*{2})": "天灾人祸",

        // === 轮红 ===
        "一(\\*{2})日": "一轮红日",

        // === 西藏 ===
        "东躲(\\*{2})": "东躲西藏",

        // === 被操 ===
        "(\\*{2})纵": "被操纵",

        // === 穷屌 ===
        "(\\*{2})丝": "穷屌丝",

        // === 销魂 ===
        "(\\*{2})滋味": "销魂滋味",

        // === 色水 ===
        "血(\\*{2})晶": "血色水晶",

        // === 偷用 ===
        "偷(\\*{2})": "偷偷用",

        // === 乳交 ===
        "水(\\*{2})融": "水乳交融",


        // === 多字替换 ===
        "cao之过急": "操之过急", "chunguang大泄": "春光大泄",
        "大公无si": "大公无私",
        "fu道人家": "妇道人家", "放sōng'xià来": "放松下来",
        "奸yin掳掠": "奸淫掳掠",
        "空dangdang": "空荡荡",
        "突发qing况": "突发情况",
        "yin奉阳违": "阴奉阳违", "一yin一阳": "一阴一阳",

        // === 双字替换 ===
        "暧m[eè][iì]": "暧昧",
        "bàn\\s*fǎ": "办法", "bucuo": "不错", "不liáng": "不良", "b[ěe]i(\\s|&nbsp;)*j[īi]ng": "北京", "bǐ\\s*shǒu": "匕首", "半shen": "半身", "b[ìi]j[ìi]ng": "毕竟", "报(了?)jing": "报$1警", "bèi'pò": "被迫", "包yǎng": "包养", "(?:biǎo|婊\\\\?)子": "婊子", "biǎo\\s*xiàn\\s*": "表现",
        "chifan": "吃饭", "ch[oō]ngd[oò]ng": "冲动", "chong物": "宠物", "cao(练|作)": "操$1", "出gui": "出轨", "chu\\s*xian": "出现", "缠mian": "缠绵", "成shu": "成熟", "(?:赤|chi)\\s*lu[oǒ]": "赤裸", "春guang": "春光", "chun风": "春风", "chuang伴": "床伴", "沉mi": "沉迷", "沉lun": "沉沦", "刺ji": "刺激", "chao红": "潮红", "初chun": "初春", "＂ｃｈｉ\\s*ｌｕｏ＂": "赤裸", "cí\\s*zhí": "辞职",
        "dān\\s*xīn": "当心", "dang校": "党校", "da子": "鞑子", "大tui": "大腿", "dǎ\\s*suàn": "打算", "dá\\s*àn": "答案", "dài\\s*lǐ": "代理", "dengdai": "等待", "电huà": "电话", "diàn\\s*huà": "电话", "diàn\\s*yǐng": "电影", "diao丝": "屌丝", "d[úu](?:\\s|&nbsp;|<br/>)*l[ìi]": "独立", "d[uú]\\s{0,2}c[áa]i": "独裁", "d?[iì]f[āa]ng": "地方", "d[ìi]\\s*d[ūu]": "帝都", "di国|帝guo": "帝国", "du[oò]落": "堕落", "坠luò": "坠落",
        "f[ǎa]ngf[óo]": "仿佛", "fei踢": "飞踢", "fēi\\s*wén": "飞吻", "feng流": "风流", "风liu": "风流", "f[èe]nn[ùu]": "愤怒", "fǎn\\s*yīng": "反应", "fú\\s*wù": "服务", "fù\\s*chóu": "复仇",
        "gao潮": "高潮", "高氵朝": "高潮", "gāo\\s*xìng\\s*": "高兴", "干chai": "干柴", "勾yin": "勾引", "gu[oò]ch[ée]ng": "过程", "gu[āa]n\\s*x[iì]": "关系", "官\\s*fāng": "官方", "g[ǎa]nji[àa]o": "感觉", "国wu院": "国务院", "gù\\s*yì\\s*": "故意", "guofen": "过分", "guān\\s*fāng": "官方",
        "hā\\s*hā\\s*": "哈哈", "h[aǎ]ode": "好的", "hù士": "护士", "火qiang": "火枪", "huó\\s*dòng": "活动", "há'guó": "韩国", "han住": "含住", "hai洛因": "海洛因", "红fen": "红粉", "火yao": "火药", "h[ǎa]oxi[àa]ng": "好像", "hu[áa]ngs[èe]": "黄色", "皇d[ìi]": "皇帝", "昏昏yu睡": "昏昏欲睡", "回dang": "回荡", "huí\\s*qù\\s*": "回去", "hé\\s*shì\\s*": "合适", "hàn\\s*jiān": "汉奸",
        "jian(臣|细)": "奸$1", "奸yin": "奸淫", "jiànmiàn": "见面", "jian货": "贱货", "jing察": "警察", "jǐng\\s*chá": "警察", "j[ìi]nháng": "进行", "jīng\\s*guò": "经过", "ji烈": "激烈", "j[iì](nv|女)": "妓女", "jirou": "鸡肉", "ji者": "记者", "jì\\s*xù\\s*": "继续", "ju花": "菊花", "j[īi]动": "激动", "jili[èe]": "激烈", "肌r[òo]u": "肌肉", "ji射": "激射", "ji[ēe]ch[uù]": "接触", "jiù\\s*shì": "就是", "j[ùu]li[èe]": "剧烈", "jǐng惕": "警惕", "节cao": "节操", "浸yin": "浸淫", "jù\\s*jué\\s*": "拒绝", "jue色": "角色",
        "k[ěe]n[ée]ng": "可能", "开bao": "开苞", "k[àa]o近": "靠近", "口wen": "口吻", "kankan": "看看",
        "ling辱": "凌辱", "luan蛋": "卵蛋", "脸sè": "脸色", "lu出": "露出", "流máng": "流氓", "lun理": "伦理", "lì\\s*qì": "力气", "lán\\s*jié": "拦截", "lìng\\s*lèi": "另类", "lè\\s*suǒ": "勒索", "lòudòng": "漏洞",
        "m[ǎa]ny[ìi]": "满意", "m[ǎa]sh[àa]ng": "马上", "m[ée]iy[oǒ]u": "没有", "mei国": "美国", "měi\\s*nǚ": "美女", "mèi\\s*mèi": "妹妹", "m[íi]ngb[áa]i": "明白", "迷huan": "迷幻", "mi茫": "迷茫", "mó\\s*yàng": "模样", "m[íi]n\\s{0,2}zh[ǔu]": "民主", "迷jian": "迷奸", "mimi糊糊": "迷迷糊糊", "mì\\s*shū": "秘书", "末(?:\\s|<br/?>)*ì": "末日", "面se": "面色", "mengmeng": "蒙蒙", "màn\\s*huà": "漫画",
        "nàme": "那么", "n[ǎa]o\\s*d[àa]i": "脑袋", "n[ée]ngg[oò]u": "能够", "nán\\s{0,2}hǎi": "那会", "内jian": "内奸", "[内內]y[iī]": "内衣", "内ku": "内裤",
        "pi[áa]o客": "嫖客", "p[áa]ngbi[āa]n": "旁边",
        "q[íi]gu[àa]i": "奇怪", "qì\\s*chē": "汽车", "qing\\s*(ren|人)": "情人", "qin兽": "禽兽", "q[iī]ngch[uǔ]": "清楚", "què\\s*dìng": "确定", "球mi": "球迷", "青chun": "青春", "青lou": "青楼", "qingkuang": "情况", "qiang[　\\s]*jian": "强奸",
        "re\\s*nao": "热闹", "r[úu]gu[oǒ]": "如果", "r[oó]ngy[ìi]": "容易", "ru(房|白色)": "乳$1", "rén员": "人员", "rén形": "人形", "人chao": "人潮", "renmen": "人名", "ruǎn\\s*jiàn": "软件", "rì\\s*běn": "日本", "日\\s*běn": "日本",
        "shàng\\s*mén": "上门", "上jiang": "上将", "she(门|术|手|程|击)": "射$1", "sudu": "速度", "shú\\s*nǚ": "熟女", "shuijue": "睡觉", "shide": "是的", "sh[iì]ji[eè]": "世界", "sh[ií]ji[aā]n": "时间", "sh[ií]h[oò]u": "时候", "sh[ií]me": "什么", "si人": "私人", "shi女": "侍女", "shi身": "失身", "sh[ūu]j[ìi]": "书记", "shu女": "熟女", "shu[　\\s]?xiong": "酥胸", "(?:上|shang)chuang": "上床", "shǒu\\s*jī": "手机", "呻y[íi]n": "呻吟", "sh[ēe]ngzh[íi]": "生殖", "深gu": "深谷", "双xiu": "双修", "生r[ìi]": "生日", "si盐": "私盐", "shi卫": "侍卫", "si下": "私下", "sao扰": "骚扰", "ｓｈｕａｎｇ\\s*ｆｅｎｇ": "双峰", "shǎo\\s*fù": "少妇", "shì\\s*pín": "视频", "shè\\s*xiàng": "摄像",
        "t[uū]r[áa]n": "突然", "tiaojiao": "调教", "tí\\s*gòng": "提供", "偷qing": "偷情", "推dao": "推倒", "脱guang": "脱光", "t[èe]bi[ée]": "特别", "t[ōo]nggu[òo]": "通过", "同ju": "同居", "tian来tian去": "舔来舔去",
        "w[ēe]ixi[ée]": "威胁", "wèizh[ìi]": "位置", "wei员": "委员", "w[èe]nti": "问题", "wèi\\s*dào\\s*": "味道", "wú\\s*nài": "无奈", "wǔ\\s*qì": "武器", "weilai": "未来",
        "xiu长": "修长", "亵du": "亵渎", "xing福": "幸福", "xìng\\s*yùn": "幸运", "小bo": "小波", "小niū": "小妞", "xiong([^a-z])": "胸$1", "小tui": "小腿", "xiang港": "香港", "xiàohuà": "笑话", "xiāo\\s*shòu": "销售", "xiàn\\'zhì": "限制", "xiàn\\s*jīn": "现金", "xiāng\\s*zǐ": "箱子", "xiōng\\s*dì": "兄弟", "选zé": "选择", "xìn\\s*hào": "信号", "xìng\\s*gǎn": "性感", "xiǎo\\s*jiě": "小姐", "xìn\\s*hào": "信号", "xià\\s*zhù": "下注",
        "yì\\s*wài\\s*": "意外", "yin(冷|暗|谋|险|沉|沟|癸派|后)": "阴$1", "y[iī]y[àa]ng": "一样", "y[īi]di[ǎa]n": "一点", "yī\\s*zhèn": "一阵", "y[ǐi]j[īi]ng": "已经", "疑huo": "疑惑", "yí\\s*huò": "疑惑", "影mi": "影迷", "yin荡": "淫荡", "yin贼": "淫贼", "阳w[ěe]i": "阳痿", "yao头": "摇头", "yaotou": "摇头", "摇tou": "摇头", "yezhan": "野战", "you饵": "诱饵", "(?:you|诱)(?:惑|huo)": "诱惑", "you导": "诱导", "引you": "引诱", "you人": "诱人", "youshi": "有事", "you\\s*xiu": "优秀", "御yòng": "御用", "旖ni": "旖旎", "yu念": "欲念", "you敌深入": "诱敌深入", "影she": "影射", "牙qian": "牙签", "一yè情": "一夜情", "yīng\\s*yǔ": "英语",
        "z[iì]j[iǐ]": "自己", "z[ìi](?:\\s|<br/?>|&nbsp;)*y[oó]u": "自由", "zh[iī]d?[àa]u?o": "知道", "zixin": "自信", "zhì'fú": "制服", "zhì\\s*fú": "制服", "zha药": "炸药", "zhan有": "占有", "zhào\\s*piàn": "照片", "zhè\\s*gè": "这个", "政f[ǔu]|zheng府": "政府", "zh[èe]ng\\s{0,2}f[uǔ]": "政府", "zong理": "总理", "zh[ōo]ngy[āa]ng": "中央", "中yang": "中央", "zu[oǒ]\\s*y[oò]u": "左右", "zhǔ\\s*dòng": "主动", "zh[oō]uw[ée]i": "周围", "zhōu\\s*nián": "周年", "中nan海": "中南海", "中j委": "中纪委", "中zu部": "中组部", "政zhi局": "政治局", "(昨|一|时|余)(?:<br/?>|&nbsp;|\\s)*ì": "$1日", "照she": "照射", "zhǔn\\s*bèi\\s*": "准备", "zhu义": "主义",

        "</p>\\n<p>\\s*ì": "日",

        '曹艹': '曹操',
        'JI昂': '激昂',
        '□□无暇': '自顾无暇',
        '法律/界': '法律界',
        '人/类': '人类',
        '恐怖/主义': '恐怖主义',
        '颠/覆': '颠覆',
        '民.事.司.法.裁.判': '民事司法裁判',
        '南海/问题': '南海问题',
        '圈圈/功': '法轮功',
        '镇/压': '镇压',
        '赤.裸': '赤裸',
        '欲·望': '欲望',
        'nv真': '女真',
        '土gai': '土改',
        '狗·屎': '狗屎',
        'du立': '独立',
        '发sao': '发骚',
        '奸/夫/淫/妇': '奸夫淫妇',
        '爱qing': '爱情',
        '抚mo': '抚摸',
        '神qing': '神情',
        '公~务~员': '公务员',
        '原着': '原著',
        '□□部分': '高潮部分',
        '角□□面': '角色情面',
        '艹': '操',
        '淫/靡/香/艳': '淫靡香艳',
        '毒丨药': '毒药',
        '登6': '登陆',
        '天□□美': '天性爱美',
        '双丨飞': '双飞',
        '高chao': '高潮',
        'pi股': '屁股',
        '情/趣': '情趣',
        '情/欲': '情欲',
        '炸/弹': '炸弹',
        '赤/身': '赤身',
        '果/体': '裸体',
        'zhong国': '中国',
        '帝国#主义': '帝国主义',
        '形形□□': '形形色色',
        'yuwang': '欲望',
        'shuangtui': '双腿',
        '城／管': '城管',
        '调丨教': '调教',
        '银/行/卡': '银行卡',
        '裸/体': '裸体',
        '光/裸': '光裸',
        '嫩/女': '嫩女',
        '维/谷': '维谷',
        '开□□谈': '开始交谈',
        '破碎的□□': '破碎的呻吟',
        'pi霜': '砒霜',
        'ma醉': '麻醉',
        '麻zui': '麻醉',
        'nue杀': '虐杀',
        '后gong': '后宫',
        '林荫dao': '林荫道',
        '分/身': '分身',
        '克/隆': '克隆',
        '性/需要': '性需要',
        '黑/帮': '黑帮',
        '政-府': '政府',
        '八/九': '八九',
        '不～着~寸～缕': '不着寸缕',
        '肉~体': '肉体',
        '蹲□子': '蹲下身子',
        'ji情': '激情',
        'xie恶': '邪恶',
        'Z国': '中国',
        '创/世': '创世',
        '紫jin城': '紫禁城',
        '□□在外': '裸露在外',
        '光怪6离': '光怪陆离',
        '邪/教': '邪教',
        '粗bao': '粗暴',
        'yin邪': '淫邪',
        '小biao砸': '小婊砸',

        '牛1b': '牛b', '微1博': '微博', '内1衣': '内衣',
    };

    const replaceAll = [
        // 长文字替换
        // 排序代码：newArr = arr.sort((a, b) => { var diff = a.charCodeAt(1) - b.charCodeAt(1); if (diff == 0) return b.length - a.length; return diff; })
        '＼^完^本^神^站^＼分类精确、支持神站请多多分享给你的小伙伴吧！',
        '喜欢神站记得收藏、多多推荐给你的书友！',
        '搜一下就能找到，喜欢就收藏，喜欢就多多分享！',
        '做一个你值得收藏的阅读站！请多多分享给与我们最大的支持动力。',
        '希望书友们多多宣传给还不知道的伙伴们，一起见证神站的成长！',
        '请多多分享给你的小伙伴！你的分享就是神站的动力。',
        '喜欢本站的伙伴们，请多多分享给你的小伙伴！支持就是动力。',
        '支持本站请多多分享出去，让我们一起做得更好！',
        '支持神站请多多分享给其他书友，支持就是动力！',
        '请多多分享给爱看书的朋友，支持就是动力！',
        '喜欢神站的小伙伴帮忙多多宣传，神站需要更大的动力！',
        '喜欢神站记得收藏、多多推荐给更多爱看书的人',
        '做一个阅读好站，需要书友们多多宣传，多多分享！',
        '喜欢神站记得收藏、多多推荐给你的书友',


        `\/`,
        '更多免费精品好书请搜',
        '更多好书免费看搜',
        '更多好书尽在',
        '更多免费精品好书请搜',
        '看好书，找好书搜',
        '看好书就搜',
        '看好书，尽在↓',
        '看好书，找好书请搜',
        '书荒就搜',
        '更多好书请搜',
        '更多好书 请搜',
        '免费看精品好书请搜',
        '精品热门小说免费看请搜',
        '免费看精品好书请搜',
        '看更多好文请搜',

        '本站域名已经更换为，老域名已经停用，请大家重新收藏，并使用新域名访问。',
        "\\(跪求订阅、打赏、催更票、月票、鲜花的支持!\\)",
        "\\(?未完待续请搜索飄天文學，小说更好更新更快!",
        "\\(跪求订阅、打赏、催更票、月票、鲜花的支持!",
        "\\(看小说到网\\)",
        "\\(未完待续。\\)",
        "\\(本章完\\)",
        "16977小游戏每天更新好玩的小游戏，等你来发现！",
        "（800小说网 www.800Book.net 提供Txt免费下载）最新章节全文阅读-..-",
        "（800小说网 www.800Book.net 提供Txt免费下载）",
        "\\[800\\]\\[站页面清爽，广告少，",
        "\\[看本书最新章节请到求书 .\\]",
        "（\\s*君子聚义堂）",
        "readx;",
        "txt电子书下载/",
        "txt全集下载",
        "txt小说下载",
        "\\|优\\|优\\|小\\|说\\|更\\|新\\|最\\|快\\|www.uuxs.cc\\|",
        "\\|每两个看言情的人当中，就有一个注册过可°乐°小°说°网的账号。",
        "思ˊ路ˋ客，更新最快的！",
        "恋上你看书网 630bookla ，最快更新.*",
        "，举报后维护人员会在两分钟内校正章节内容，请耐心等待，并刷新页面。",
        "追书必备",
        "-优－优－小－说－更－新－最－快-www.ＵＵＸＳ.ＣＣ-",
        "-优－优－小－说－更－新－最－快x",
        "来可乐网看小说",
        "纯文字在线阅读本站域名手机同步阅读请访问",
        "本文由　　首发",
        "樂文小说",
        '最快更新无错小说阅读，请访问 请收藏本站阅读最新小说!',
        "最新章节全文阅读看书神器\\.yankuai\\.",
        "最新章节全文阅读（..首发）",
        "最新章节全文阅读【首发】",
        "最新章节全文阅读",
        "看本书最新章节请到800小说网（www.800book.net）",
        "（本章未完，请翻页）",
        "手机用户请浏览m.biqugezw.com阅读，更优质的阅读体验。",
        "手机用户请浏览阅读，更优质的阅读体验。",
        "阅读，更优质的阅读体验。",
        "手机最省流量无广告的站点。",
        "手机看小说哪家强手机阅",
        "如果你喜欢本站[〖]?一定要记住[】]?(?:网址|地址)哦",
        "看清爽的小说就到",
        "请用搜索引擎(?:搜索关键词)?.*?完美破防盗章节，各种小说任你观看",
        "完美破防盗章节，请用搜索引擎各种小说任你观看",
        "破防盗章节，请用搜索引擎各种小说任你观看",
        "(?:搜索引擎)?各种小说任你观看，破防盗章节",
        "章节错误，点此举报\\(免注册\\)",
        "热门小说最新章节全文阅读.。 更新好快。",
        "【阅读本书最新章节，请搜索800】",
        "亲，百度搜索眼&amp;快，大量小说免费看。",
        "亲，眼&快，大量小说免费看。",
        '下载免费阅读器!!',
        '笔趣阁&nbsp;.，最快更新.*最新章节！',
        '请大家搜索（书迷楼）看最全！更新最快的小说',
        '更新快无广告。',
        '【鳳.{1,2}凰.{1,2}小说网 更新快 无弹窗 请搜索f.h.xiao.shuo.c.o.m】',
        '【可换源APP看书软件：书掌柜APP或直接访问官方网站shuzh.net】',
        '[●★▲]手机下载APP看书神器.*',
        "m.?手机最省流量的站点。",
        'm.?手机最省流量.无广告的站点。',
        '底部字链推广位',
        'us最快',
        'APPapp',
        '久看中文网首发',
        '顶点小说 ２３ＵＳ．com更新最快',

        // 复杂规则的替换
        '(看小说到|爱玩爱看就来|就爱上|喜欢)?(\\s|<|>|&| |[+@＠=:;｀`%？》《〈︾-])?[乐樂](\\s|&lt;|&gt;|&amp;|&nbsp;|[+@＠=:;｀`%？》《〈︾-])?[文].*?[说說][网]?[|]?(.*(3w|[ｗωＷw]{1,3}|[Ｍm]).*[ｍＭm])?[}。\\s]?(乐文小说)?',
        '(本文由|小说)?(\\s| )?((3w|[wＷｗ]{1,3}|[Ｍm]).)?\\s?[lしｌL][ｗωＷw][ｘχＸx][ｓＳs][５5][２2][０0].*[ｍＭm][|\\s]?(首发(哦亲)?)?',
        '([『【↑△↓＠︾]+[\u4E00-\u9FA5]){2,6}[】|]',

        // 包含 \P 的替换
        '\\P{1,2}[顶頂].{1,3}[点小].*?o?[mw，]',
        '\\P.?长.{1,2}风.{1,2}文.{1,2}学.*?[tx]',
        '\\P无.错.*?[cＣ][oＯ][mＭ]',
        '[;\\(]顶.{0,2}点.小说',
        '2长2风2文2学，w￠＄',
        '》长>风》',

        // 包含 .* 的，可能有多余的替换
        '看无防盗章节的小说，请用搜索引擎搜索关键词.*',
        '(?:完美)?破防盗章节，请用搜索引擎搜索关键词.*',
        '搜索引擎搜索关键词，各种任你观看，破防盗章节',
        '破防盗完美章节，请用搜索引擎.*各种小说任你观看',
        '如您已(?:閱讀|阅读)到此章节.*?敬请记住我们新的网址\\s*。',
        '↗百度搜：.*?直达网址.*?↖',
        "[:《〈｜~∨∟∑]{1,2}长.{1,2}风.*?et",
        '\\[限时抢购\\].*',
        '支持网站发展.逛淘宝买东西就从这里进.*',
        'ps[：:]想听到更多你们的声音，想收到更多你们的建议，现在就搜索微信公众号“qdread”并加关注，给.*?更多支持！',
        '(?:ps[:：])?看《.*?》背后的独家故事.*?告诉我吧！',
        '（?天上掉馅饼的好活动.*?微信公众号！）?',
        '（微信添加.*qdread微信公众号！）',
        'jiemei如您已阅读到此章节，请移步到.*?\\[ads:本站换新网址啦，速记方法：，.\\]',
        '先给自己定个小目标：比如收藏笔趣阁.*',
        '请记住本书首发域名.*',
        '记住手机版网址.*',
        '.*关注微信公众号.*',
        '一秒记住.*',

        // 短文字替换
        '\\[txt全集下载\\]',
        '\\[\\s*超多好看小说\\]',
        '⊙四⊙五⊙中⊙文☆→',
        '\\[ads:本站换新网址啦，速记方法：.*?\\]',
        '[》《｜～]无(?:.|&gt;)错(?:.|&gt;)小说',
        '`无`错`小说`www.``com', '＋无＋错＋小说＋3w＋＋',
        '\\|优\\|优\\|小\\|说\\|更\\|新\\|最\\|快Ｘ',
        '▲∴', '8，ww←',
        /www.23＋?[Ｗw][Ｘx].[Ｃc]om/ig,
        /热门推荐:、+/g,
        /h2&gt;/g,
        '[《〈》>\\+｜～［\\]]无\\1错\\1', '》无>错》',

        '女凤免费小说抢先看', '女凤小说网全文字 无广告',
        '乐文小说网?', '《乐〈文《小说', '乐文移动网', '頂点小说', '頂點小說',
        '追小说哪里快去眼快',
        '\\[书库\\].\\[774\\]\\[buy\\].kuai',
        'www.938xs.com',
        '小說，.biquge5200.',

        /'ads_wz_txt;',|百度搜索|无弹窗小说网|更新快无弹窗纯文字|高品质更新|小说章节更新最快|\(百度搜.\)|全文字手打|“”&nbsp;看|无.弹.窗.小.说.网|追书网|〖∷∷无弹窗∷纯文字∷ 〗/g,
    ];

    // import _ from 'underscore'

    // 单字替换，可能会误替换，所以需要特殊处理
    var oneWordReplace = {
        "b[āà]ng": "棒", "bào": "爆", "bà": "吧", "bī": "逼", "bō": "波", "biàn": "便",
        "cāo": "操", "cǎo": "草", "cào": "操", "chāng": "娼", "chang": "娼", "cháo": "潮", "chā": "插", "chéng": "成", "chōu": "抽", "chuáng": "床", "chún": "唇", "chūn": "春", "cuō": "搓", "cū": "粗",
        "dǎng": "党", "dàng": "荡", "dāo": "刀", "dòng": "洞", "diao": "屌", "diǎn": "点",
        "fǎ": "法", "féi": "肥", "fù": "妇",
        "guān": "官",
        "hán": "含", "hóu": "喉", "hòu": "后", "h(u)?ā": "花", "huá": "华", "huì": "会", "huò": "惑", "hùn": "混", "hún": "魂",
        "jiǔ": "九", "j[īi]ng": "精", "jìn": "禁", "jǐng": "警", "jiāng": "江", "jiān": "奸", "jiāo": "交", "jūn": "军", "jū": "拘", "jú": "局", "jī": "激", "激ān": "奸",
        "kù": "裤", "kàn": "看",
        "[1l]àng": "浪", "liáo": "撩", "liú": "流", "lì": "莉", "liè": "烈", "[1l]uàn": "乱", "lún": "伦", "luǒ": "裸", "lòu": "露", "[l1]ù": "露", "lǜ": "绿", "liàn": "练",
        "mǎi": "买", "mài": "卖", "máo": "毛", "mā": "妈", "méng": "蒙", "mén": "门", "miè": "灭", "mí": "迷", "mì": "蜜", "mō": "摸", "miàn": "面",
        "nǎi": "奶", "nèn": "嫩", "niào": "尿", "niē": "捏", "nòng": "弄", "nǚ": "女",
        "pào": "炮", "piàn": "片", "pò": "破",
        "qi[āa]ng": "枪", "qíng": "情", "qīn": "亲", "qiú": "求", "quán": "全", "qù": "去",
        "rén": "人", "r[ìi]": "日", "rǔ": "乳",

        // s
        "sǎ": "洒", "sāo": "骚", "sǎo": "骚", "sè": "色", "se": "色", "shā": "杀",
        "shēn": "身", "shēn": "呻",   // 2个重复的，误替换且是单字怎么办
        "shén": "神", "shè": "射", "shǐ": "屎", "shì": "侍", "sǐ": "死", "sī": "私", "shǔn": "吮", "sǔn": "吮", "sū": "酥", "shào": "绍",

        "tān": "贪", "tiǎn": "舔", "t[ǐi]ng": "挺", "tǐ": "体", "tǒng": "捅", "tōu": "偷", "tou": "偷", "tuǐ": "腿", "tūn": "吞", "tún": "臀", "tiáo": "调", "tài": "态", "tào": "套",
        "wēn": "温", "wěn": "吻",
        "xiǎo": "小", "xiào": "笑", "xìng": "性", "xing": "性", "xiōng": "胸", "xī": "吸", "xí": "习", "xì": "系", "xìn": "信", "xué": "穴", "xuè": "穴", "xùe": "穴", "xuan": "宣", "xiàng": "象",
        "yāng": "央", "yàn": "艳", "yīn": "阴", "yào": "药", "yé": "爷", "yòu": "诱", "zàng": "脏", "y[ùu]": "欲", "yín": "淫", "yì": "意", "yà": "讶",
        "zhēn": "针", "zēn": "针", "zhà": "炸", "zhèng": "政", "zǒu": "走", "zuì": "罪", "zuò": "做", "zhōng": "中",
    };

    var replaceFix = {
        // ===误替换还原===
        "碧欲": "碧玉", "美欲": "美玉", "欲石": "玉石", "惜欲": "惜玉", "宝欲": "宝玉",
        "品性": "品行", "德性": "德行",
        "波ok": "book", "波SS": "BOSS",

        // ===其他修正===
        "弥俩": "你俩",
        "妳": "你",
        // "圞|垩|卝|龘":"",
        "大6": "大陆",
    };

    function textselect(text) {
        var pr = /^[\u0020\u3000\t\n\r]*(?:(《[^\n\r]+》)|(序|序[\u0020\u3000\t]*章|序[\u0020\u3000\t]*言|前[\u0020\u3000\t]*言|引[\u0020\u3000\t]*言|引[\u0020\u3000\t]*子|摘[\u0020\u3000\t]*要|楔[\u0020\u3000\t]*子|背景简介|内容简介)|((?:第[\u0020\u3000\t]*)?(?:(?:[0-9]+(?:.[0-9]+)?)|(?:[〇零一壹二贰三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万亿萬億廿卅卌]+))[\u0020\u3000\t]*([章节回卷折篇幕集])(?:[\u0020\u3000\t][^\n\r]{1,20}[^\n\r\u0020\u3000\t])?)|(后[\u0020\u3000\t]*记|附[\u0020\u3000\t]*言|结[\u0020\t]*语)|([^\n\r]+))(?=[\u0020\u3000\t]*[\n\r]+)/;
        var p = pr.exec(text);
        //console.log(p);
    }
    function extendRule(replaceRule) {
        $.each(oneWordReplace, function (value, key) {
            // 这个替换会把 yùn 替换为 yù
            // replace['\\b' + key + '(?:\\b|\\s*)'] = value;

            // 这个不会替换 rén： shā rén偿命 => 杀 rén偿命
            // replaceRule['([^a-z\\s])' + key + '(?![a-z])'] = '$1' + value;
            replaceRule['\\b' + key + '(?![a-z])'] = value;
        });
        $.extend(replaceRule, replaceFix);
    }

    function textreplace(text) {
        for (var key in rulereplace) {
            text = text.replace(new RegExp(key, "ig"), rulereplace[key]);

        }
        for (var key in replaceAll) {
            text = text.replace(replaceAll[key], '');
        }
        return text;
    }








})( );