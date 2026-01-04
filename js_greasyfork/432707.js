// ==UserScript==
// @name                Bandai Internationalization
// @name:zh-CN          日魂汉化插件
// @version             4.3
// @namespace           https://github.com/liyuhaolol/BandaiJS
// @description         Translate p-bandai.jp
// @description:zh      日魂汉化插件
// @description:zh-CN   日魂汉化插件
// @author              菜狗子
// @match               *://p-bandai.jp/*
// @match               *://search.p-bandai.jp/*
// @match               *://tamashiiweb.com/*
// @match               *://support.bandaispirits.co.jp/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://cdn.jsdelivr.net/gh/liyuhaolol/BandaiTranslate/bandai.json?v=20231218
// @require             https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon                https://tamashiiweb.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432707/Bandai%20Internationalization.user.js
// @updateURL https://update.greasyfork.org/scripts/432707/Bandai%20Internationalization.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const SUPPORT_LANG = ["zh-CN"];//设置语言为简体中文
    const lang = (navigator.language || navigator.userLanguage);
    const locales = getLocales(lang)
    //一些正则表达式
    var patt1 = /発送/;
    var patt2 = /発送商品/;
    var patt3 = /円\s?（税込）$/;
    var patt4 = /歳～$/;
    var patt5 = /^お一人様\d{1,}個まで$/;
    var patt6 = /^\d{1,}注文につき\d{1,}個まで$/;
    var patt7 = /円$/;
    var patt8 = /同時購入数は\d{1,}個までとなっております。/;
    var patt9 = /円\s?\(税込\)$/;
    var patt10 = /機動戦士ガンダム/;
    var patt11 = /逆襲のシャア/;
    var patt12 = /サンダーボルト/;
    var patt13 = /閃光のハサウェイ/;
    var patt14 = /第０８ＭＳ小隊/;
    var patt15 = /ポケットの中の戦争/;
    var patt16 = /鉄血のオルフェンズ/;
    var patt17 = /ユニコーン/;
    var patt18 = /仮面ライダー/;
    var patt19 = /鬼滅の刃/;
    var patt20 = /ストライクガンダム/;
    var patt21 = /エールストライカー/;
    var patt22 = /聖闘士聖衣神話/;
    var patt23 = /エヴァンゲリオン/;
    var patt24 = /予約開始$/;
    var patt25 = /抽選販売/;
    var patt26 = /発送分/;
    var patt27 = /開催記念商品/;
    var patt28 = /イベント開催記念物販/;
    var patt29 = /ストライクフリーダムガンダム/;
    var patt30 = /デスティニーガンダム/;
    var patt31 = /発送予定/;
    var patt32 = /締切/;
    var patt33 = /ページ/;
    var patt34 = /特別販売/;
    var patt35 = /ローエングリンランチャー/;
    var patt36 = /ストライクルージュ/;
    var patt37 = /グランドスラム装備型/;
    var patt38 = /オオトリ装備/;
    var patt39 = /カレトヴルッフ/;
    var patt40 = /オプションセット/;
    var patt41 = /アストレイドライグヘッド/;
    var patt42 = /フライトユニット/;
    var patt43 = /オルタナティブストライクVer./;
    var patt44 = /ガンダムアストレイ/;
    var patt45 = /レッドドラゴニクス/;
    var patt46 = /スナイパーパック/;
    var patt47 = /ブルーフレームセカンドリバイ/;
    var patt48 = /インフィニットジャスティスガンダム/;
    var patt49 = /魂ウェブ商店/;
    var patt50 = /プレミアムバンダイ/;
    var patt51 = /バンダイナムコグループ公式通販サイト/;
    var patt52 = /フィギュア/;
    var patt53 = /プラモデル/;
    var patt54 = /プラキット/;
    var patt55 = /シリーズ/;
    var patt56 = /その他/;
    var patt57 = /ガンダムシリーズ/;//需特殊优先处理
    var patt58 = /水星の魔女/;
    var patt59 = /発送月から探す/;
    var patt60 = /ドラゴンボール/;
    var patt61 = /ブランドから探す/;
    var patt62 = /キャラクターから探す/;
    var patt63 = /締切間近/;
    var patt64 = /プロヴィデンスガンダム/;
    var patt65 = /プロヴィデンスガンダム/;
    var patt66 = /時/;
    var patt67 = /オルタナティブストライク Ver./;
    var patt68 = /ゴールドフレーム/;
    var patt69 = /ディバインストライカー/;
    var patt70 = /CTM抽選/;
    var patt71 = /フリーダムガンダム/;
    var patt72 = /ライトニングストライカー/;
    var patt73 = /ストライクノワールガンダム/;
    var patt74 = /事後販売/;
    var patt75 = /ランチャーストライカー/;
    var patt76 = /ソードストライカー/;
    var patt77 = /ヘリオポリス ロールアウト/;
    var patt78 = /ジャスティスガンダム/;
    var patt79 = /天ミナ/;
    var patt80 = /天空の皇女/;
    var patt81 = /光の翼/;
    var patt82 = /事前販売/;
    var patt83 = /天ハナ/;
    var patt84 = /バージョン華/;
    var patt85 = /レッドフレーム/;
    var patt86 = /オルタナティブストライク/;
    var patt87 = /受注販売/;
    var patt88 = /ガンバレルストライカー/;
    var patt89 = /エールストライクガンダム/;
    var patt90 = /パワードレッド/;
    var patt91 = /ガーベラ・ストレート/;
    var patt92 = /パワー/;
    var patt93 = /タクティカルアームズ/;
    var patt94 = /タイガーピアス/;
    var patt95 = /ブルーフレーム/;
    var patt96 = /フル・ウェポン装備/;
    var patt97 = /フルパッケージ/;
    var patt98 = /ハイネ機/;
    var patt99 = /天空の宣言/;
    var patt100 = /フライト・ユニット/;
    var patt101 = /プリズムコート/;
    var patt102 = /発売/;
    var patt103 = /税10%込/;
    var patt104 = /税抜/;
    var patt105 = /才以上/;
    var patt106 = /円/;
    var patt107 = /再販/;
    var patt108 = /発売予定/;
    var patt109 = /キーワード/;
    var patt110 = /での検索結果/;
    var patt111 = /前へ/;
    var patt112 = /次へ/;
    var patt113 = /表示順/;
    var patt114 = /絞り込み/;
    var patt115 = /なし/;
    var patt116 = /リリース順/;
    var patt117 = /発売日の新しい順/;
    var patt118 = /発売日の古い順/;
    var patt119 = /価格の安い順/;
    var patt120 = /価格の高い順/;
    var patt121 = /一般店頭商品/;
    var patt122 = /魂ウェブ商店商品/;
    var patt123 = /その他限定商品/;
    var patt124 = /魂ストア 限定商品/;
    var patt125 = /魂ストア イベント商品/;
    var patt126 = /シリーズの/;
    var patt127 = /予約受付終了/;
    var patt128 = /ネオ/;
    var patt129 = /機/;
    var patt130 = /専用武装セット/;
    var patt131 = /ガンダムエクシア/;
    var patt132 = /ガンダムデヴァイズエクシア/;
    var patt133 = /エクシア/;
    var patt134 = /リペア/;
    var patt135 = /トランザム/;
    var patt136 = /トランザムライザー/;
    var patt137 = /トランザムVer./;
    var patt138 = /ダブルオーガンダム/;
    var patt139 = /ダブルオーライザー/;
    var patt140 = /セブンソード/;
    var patt141 = /ガンダムアヴァランチエクシア/;
    var patt142 = /ウェポンプラスパック/;
    var patt143 = /オプションパーツセット/;
    var patt144 = /デザイナーズブルー/;
    var patt145 = /ダブルオークアンタ/;
    var patt146 = /GNソード/;
    var patt147 = /ブラスター/;
    var patt148 = /ガンダムデュナメス＆デヴァイズデュナメス/;
    var patt149 = /ガンダムデュナメス/;
    var patt150 = /ガンダムアストレア/;
    var patt151 = /アヴァラングダッシュ/;
    var patt152 = /OPセット/;
    var patt153 = /GN HEAVY WEAPON SET/;
    var patt154 = /プロトGNハイメガランチャー/;
    var patt155 = /高機動試験装備/;
    var patt156 = /ガンダムアストレアTYPE-Xフィンスターニス/;
    var patt157 = /GNアームズ TYPE-E/;
    var patt158 = /プロトザンユニット/;
    var patt159 = /オオトリ/;
    var patt160 = /GNアームズ TYPE-D/;
    var patt161 = /コード/;
    var patt162 = /取扱説明書/;
    var patt163 = /マイティーストライクフリーダムガンダム/;
    var patt164 = /会員/;
    var patt165 = /ガンダムデュナメスサーガ/;
    var patt166 = /弐式/;
    var patt167 = /プラウドディフェンダー/;
    var patt168 = /エフェクトパーツセット/;
    var patt169 = /SpecII/;
    var patt170 = /インパルスガンダム/;
    var patt171 = /フォース/;
    var patt172 = /専用光の翼/;
    var patt173 = /ゼウスシルエット/;
    var patt174 = /アカツキ/;
    var patt175 = /アカツキガンダム/;
    var patt176 = /シラヌイ装備/;
    var patt177 = /オオワシ装備/;
    var patt178 = /ライジングフリーダムガンダム/;
    var patt179 = /イモータルジャスティスガンダム/;
    var patt180 = /フルセイバー/;




    translateTitle();//开始翻译标题
    traverseElement(document.body);//开始翻译网页
    watchUpdate();//监控网页内容变化

    //读取本地翻译文件
    function getLocales(lang) {
        if (lang.startsWith("zh")) { // zh
            lang = "zh-CN";
        }
        if (SUPPORT_LANG.includes(lang)) {
            return JSON.parse(GM_getResourceText(lang));
        }
        //如果读取文件失败了，返回一个默认结构
        return {
            //css: [],
            dict: {}
        };
    }

    //进行网页翻译
    function traverseElement(el) {
        if (el.nodeType === Node.TEXT_NODE) {
            //如果是文字节点，直接翻译
            translateElement(el);
        } else {
            for (const child of el.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    //如果是文字节点，继续翻译
                    translateElement(child);
                }
                else if (child.nodeType === Node.ELEMENT_NODE) {
                    //如果是元素节点
                    if (child.tagName === "INPUT") {
                        translateElement(child);//是个input进行元素翻译
                    } else {
                        traverseElement(child);
                    }
                } else {
                    // pass
                }
            }
        }
    }

    //进行页面标题翻译
    function translateTitle() {
        var pageTitle = document.title;
        document.title = beginTranslate(pageTitle);
    }

    //翻译元素内容
    function translateElement(el) {
        // Get the text field name
        let k;
        if (el.tagName === "INPUT") {
            if (el.type === 'button' || el.type === 'submit') {
                k = 'value';
            } else {
                k = 'placeholder';
            }
        } else {
            k = 'data';
        }

        const txtSrc = el[k].trim();
        const key = txtSrc
            .replace(/\xa0/g, ' ') // replace '&nbsp;'
            .replace(/\s{2,}/g, ' ')
            .replace(/[\r\n]/g, '');

        var value = beginTranslate(key);
        el[k] = el[k].replace(txtSrc, value)
    }

    function beginTranslate(key) {
        var value = key;
        if (locales.dict[key]) {
            value = locales.dict[key];
        } else {

            //翻译筛选条件
            if (patt116.test(key)) {
                value = value.replace('リリース順', '发布顺序')
            }
            if (patt117.test(key)) {
                value = value.replace('発売日の新しい順', '最新发布日期')
            }
            if (patt118.test(key)) {
                value = value.replace('発売日の古い順', '最早发布日期')
            }
            if (patt119.test(key)) {
                value = value.replace('価格の安い順', '最低价格排序')
            }
            if (patt120.test(key)) {
                value = value.replace('価格の高い順', '最高价格排序')
            }
            if (patt121.test(key)) {
                value = value.replace('一般店頭商品', '普通店铺商品')
            }
            if (patt122.test(key)) {
                value = value.replace('魂ウェブ商店商品', '魂网商店商品')
            }
            if (patt123.test(key)) {
                value = value.replace('その他限定商品', '其他限定商品')
            }
            if (patt124.test(key)) {
                value = value.replace('魂ストア 限定商品', '魂商店限定商品')
            }
            if (patt125.test(key)) {
                value = value.replace('魂ストア イベント商品', '魂商店活动商品')
            }
            if (patt113.test(key)) {
                value = value.replace('表示順', '显示顺序')
            }
            //主要用来翻译带有发货字样的文本
            if (patt59.test(key)) {
                value = value.replace('発送月から探す', '按发货月份搜索')
            } else if (patt2.test(key)) {
                value = value.replace('発送商品', '发货商品');
            } else if (patt26.test(key)) {
                value = value.replace('発送分', '发货')
            } else if (patt31.test(key)) {
                value = value.replace('発送予定', '预定发货')
            } else if (patt108.test(key)) {
                value = value.replace('発売予定', '预定发布')
            } else if (patt1.test(key)) {
                value = value.replace('発送', '发货')
            } else if (patt102.test(key)) {
                value = value.replace('発売', '发布')
            }
            //主要用来翻译一些杂项
            if (patt57.test(key)) {
                value = value.replace('ガンダムシリーズ', '高达系列')
            } else if (patt3.test(key)) {
                value = value.replace('円（税込）', '日元（含税）')
                value = value.replace('円 （税込）', '日元（含税）')
            } else if (patt4.test(key)) {
                value = value.replace('歳～', '岁以上')
            } else if (patt5.test(key)) {
                value = value.replace('お一人様', '每人最多购买')
                value = value.replace('個まで', '个')
            } else if (patt6.test(key)) {
                value = value.replace('注文につき', '单最多购买')
                value = value.replace('個まで', '个')
            } else if (patt7.test(key)) {
                value = value.replace('円', '日元')
            } else if (patt8.test(key)) {
                value = value.replace('同時購入数は', '最多可同时购买')
                value = value.replace('個までとなっております。', '件物品。')
            } else if (patt9.test(key)) {
                value = value.replace('円(税込)', '日元(含税)')
                value = value.replace('円 (税込)', '日元(含税)')
            } else if (patt24.test(key)) {
                value = value.replace('予約開始', '开始预订')
            } else if (patt33.test(key)) {
                value = value.replace('ページ', '页')
            } else if (patt126.test(key)) {
                value = value.replace('シリーズの', '系列的')
            } else if (patt55.test(key)) {
                value = value.replace('シリーズ', '系列')
            } else if (patt56.test(key)) {
                value = value.replace('その他', '其他')
            } else if (patt61.test(key)) {
                value = value.replace('ブランドから探す', '按品牌搜索')
            } else if (patt62.test(key)) {
                value = value.replace('キャラクターから探す', '按关键字搜索')
            } else if (patt63.test(key)) {
                value = value.replace('締切間近', '近期截止')
            } else if (patt32.test(key)) {
                value = value.replace('締切', '截止')
            } else if (patt103.test(key)) {
                value = value.replace('税10%込', '含10%税')
            } else if (patt105.test(key)) {
                value = value.replace('才以上', '岁以上')
            } else if (patt107.test(key)) {
                value = value.replace('再販', '再贩')
            } else if (patt109.test(key)) {
                value = value.replace('キーワード', '关键字')
            } else if (patt111.test(key)) {
                value = value.replace('前へ', '上一页')
            } else if (patt112.test(key)) {
                value = value.replace('次へ', '下一页')
            } else if (patt128.test(key)) {
                value = value.replace('ネオ', '新')
            } else if (patt164.test(key)) {
                value = value.replace('会員', '会员')
            }
            //主要用来翻译一些杂项2
            if (patt104.test(key)) {
                value = value.replace('税抜', '不含税')
            } else if (patt110.test(key)) {
                value = value.replace('での検索結果', '的搜索结果')
            } else if (patt114.test(key)) {
                value = value.replace('絞り込み', '过滤器')
            }
            //主要用来翻译一些杂项3
            if (patt106.test(key)) {
                value = value.replace('円', '日元')
            } else if (patt115.test(key)) {
                value = value.replace('なし', '无')
            }
            //主要用来翻译一些杂项4
            if (patt106.test(key)) {
                value = value.replace('円', '日元')
            }
            //翻译一些标题内容
            if (patt49.test(key)) {
                value = value.replace('魂ウェブ商店', '魂网商店')//忘了为什么会有这个选项，翻译文本已有此文本
            }
            if (patt50.test(key)) {
                value = value.replace('プレミアムバンダイ', 'Premium Bandai')
            }
            if (patt51.test(key)) {
                value = value.replace('バンダイナムコグループ公式通販サイト', '万代南梦宫集团官方线上销售网站')
            }
            if (patt52.test(key)) {
                value = value.replace('フィギュア', '手办')
            }
            if (patt53.test(key)) {
                value = value.replace('プラモデル', '塑料模型')
            }
            if (patt66.test(key)) {
                value = value.replace('時', '时')
            }
            //翻译一些作品名
            if (patt10.test(key)) {
                value = value.replace('機動戦士ガンダム', '机动战士高达')
                if (patt11.test(key)) {
                    value = value.replace('逆襲のシャア', '逆袭的夏亚')
                } else if (patt12.test(key)) {
                    value = value.replace('サンダーボルト', '雷霆宙域')
                } else if (patt13.test(key)) {
                    value = value.replace('閃光のハサウェイ', '闪光的哈萨维')
                } else if (patt14.test(key)) {
                    value = value.replace('第０８ＭＳ小隊', '第08MS小队')
                } else if (patt15.test(key)) {
                    value = value.replace('ポケットの中の戦争', '口袋里的战争')
                } else if (patt16.test(key)) {
                    value = value.replace('鉄血のオルフェンズ', '铁血的奥尔芬斯')
                } else if (patt17.test(key)) {
                    value = value.replace('ユニコーン', '独角兽')
                } else if (patt58.test(key)) {
                    value = value.replace('水星の魔女', '水星的魔女')
                }
            } else if (patt18.test(key)) {
                value = value.replace('仮面ライダー', '假面骑士')
            } else if (patt19.test(key)) {
                value = value.replace('鬼滅の刃', '鬼灭之刃')
            } else if (patt22.test(key)) {
                value = value.replace('聖闘士聖衣神話', '圣斗士圣衣神话')
            } else if (patt23.test(key)) {
                value = value.replace('エヴァンゲリオン', '新世纪福音战士')
            } else if (patt60.test(key)) {
                value = value.replace('ドラゴンボール', '龙珠')
            }
            //翻译一些SEED名称主词条
            if (patt163.test(key)) {
                value = value.replace('マイティーストライクフリーダムガンダム', '非凡强袭自由高达')
            } else if (patt178.test(key)) {
                value = value.replace('ライジングフリーダムガンダム', '飞升自由高达')
            } else if (patt179.test(key)) {
                value = value.replace('イモータルジャスティスガンダム', '不朽正义高达')
            } else if (patt89.test(key)) {
                value = value.replace('エールストライクガンダム', '翔翼型强袭高达')
            } else if (patt20.test(key)) {
                value = value.replace('ストライクガンダム', '强袭高达')
            } else if (patt21.test(key)) {
                value = value.replace('エールストライカー', '翔翼型强袭装备')
            } else if (patt29.test(key)) {
                value = value.replace('ストライクフリーダムガンダム', '强袭自由高达')
            } else if (patt30.test(key)) {
                value = value.replace('デスティニーガンダム', '命运高达')
            } else if (patt35.test(key)) {
                value = value.replace('ローエングリンランチャー', '阳电子炮')
            } else if (patt36.test(key)) {
                value = value.replace('ストライクルージュ', '嫣红强袭高达')
            } else if (patt39.test(key)) {
                value = value.replace('カレトヴルッフ', '王者之剑')
            } else if (patt41.test(key)) {
                value = value.replace('アストレイドライグヘッド', '异端高达红色机红龙形态配件包')
            } else if (patt42.test(key)) {
                value = value.replace('フライトユニット', '飞行背包')
            } else if (patt100.test(key)) {
                value = value.replace('フライト・ユニット', '飞行背包')
            } else if (patt44.test(key)) {
                value = value.replace('ガンダムアストレイ', '异端高达')
            } else if (patt46.test(key)) {
                value = value.replace('スナイパーパック', '狙击背包')
            } else if (patt48.test(key)) {
                value = value.replace('インフィニットジャスティスガンダム', '无限正义高达')
            } else if (patt64.test(key)) {
                value = value.replace('プロヴィデンスガンダム', '神意高达')
            } else if (patt69.test(key)) {
                value = value.replace('ディバインストライカー', '神兵型强袭装备')
            } else if (patt71.test(key)) {
                value = value.replace('フリーダムガンダム', '自由高达')
            } else if (patt72.test(key)) {
                value = value.replace('ライトニングストライカー', '闪电强袭装备')
            } else if (patt73.test(key)) {
                value = value.replace('ストライクノワールガンダム', '漆黑强袭高达')
            } else if (patt75.test(key)) {
                value = value.replace('ランチャーストライカー', '重炮型强袭装备')
            } else if (patt76.test(key)) {
                value = value.replace('ソードストライカー', '重剑型强袭装备')
            } else if (patt78.test(key)) {
                value = value.replace('ジャスティスガンダム', '正义高达')
            } else if (patt88.test(key)) {
                value = value.replace('ガンバレルストライカー', '有线诱导型强袭装备')
            } else if (patt90.test(key)) {
                value = value.replace('パワードレッド', '强力型')
            } else if (patt93.test(key)) {
                value = value.replace('タクティカルアームズ', '战术复合兵装')
            } else if (patt159.test(key)) {
                value = value.replace('オオトリ', '凤型强袭装备')
            } else if (patt167.test(key)) {
                value = value.replace('プラウドディフェンダー', '荣耀捍卫者')
            } else if (patt170.test(key)) {
                value = value.replace('インパルスガンダム', '脉冲高达')
            } else if (patt175.test(key)) {
                value = value.replace('アカツキガンダム', '拂晓高达')
            } else if (patt174.test(key)) {
                value = value.replace('アカツキ', '拂晓')
            }
            //翻译一些SEED名称附词条
            if (patt37.test(key)) {
                value = value.replace('グランドスラム装備型', '斩舰刀装备型')
            } else if (patt38.test(key)) {
                value = value.replace('オオトリ装備', '凤装备型')
            } else if (patt40.test(key)) {
                value = value.replace('オプションセット', 'OPTION套装')
            } else if (patt45.test(key)) {
                value = value.replace('レッドドラゴニクス', '红龙改形态')
            } else if (patt47.test(key)) {
                value = value.replace('ブルーフレームセカンドリバイ', '蓝色机二型改')
            } else if (patt68.test(key)) {
                value = value.replace('ゴールドフレーム', '金色机')
            } else if (patt77.test(key)) {
                value = value.replace('ヘリオポリス ロールアウト', '离开希奈波利斯')
            } else if (patt85.test(key)) {
                value = value.replace('レッドフレーム', '红色机')
            } else if (patt95.test(key)) {
                value = value.replace('ブルーフレーム', '蓝色机')
            } else if (patt97.test(key)) {
                value = value.replace('フルパッケージ', '套装')
            } else if (patt98.test(key)) {
                value = value.replace('ハイネ機', '海涅机型')
            } else if (patt101.test(key)) {
                value = value.replace('プリズムコート', '棱镜涂层')
            } else if (patt166.test(key)) {
                value = value.replace('弐式', '二式')
            } else if (patt171.test(key)) {
                value = value.replace('フォース', '强攻型')
            } else if (patt173.test(key)) {
                value = value.replace('ゼウスシルエット', '宙斯魅影')
            } else if (patt176.test(key)) {
                value = value.replace('シラヌイ装備', '不知火装备')
            } else if (patt177.test(key)) {
                value = value.replace('オオワシ装備', '大鹫装备')
            }
            //翻译一些SEED名称三级词条
            if (patt43.test(key)) {
                value = value.replace('オルタナティブストライクVer.', 'AS Ver.')
            } else if (patt67.test(key)) {
                value = value.replace('オルタナティブストライク Ver.', 'AS Ver.')
            } else if (patt79.test(key)) {
                value = value.replace('天ミナ', '天蜜娜')
            } else if (patt83.test(key)) {
                value = value.replace('天ハナ', '天哈娜')
            } else if (patt86.test(key)) {
                value = value.replace('オルタナティブストライク', 'Alternative Strike')
            } else if (patt91.test(key)) {
                value = value.replace('ガーベラ・ストレート', '菊一文字')
            } else if (patt94.test(key)) {
                value = value.replace('タイガーピアス', '虎彻')
            } else if (patt96.test(key)) {
                value = value.replace('フル・ウェポン装備', '全装备版')
            } else if (patt172.test(key)) {
                value = value.replace('専用光の翼', '专用光之翼')
            } else if (patt81.test(key)) {
                value = value.replace('光の翼', '光之翼')
            } else if (patt168.test(key)) {
                value = value.replace('エフェクトパーツセット', '特效件套装')
            }
            //翻译一些SEED名称四级词条
            if (patt80.test(key)) {
                value = value.replace('天空の皇女', '天空的皇女')
            } else if (patt84.test(key)) {
                value = value.replace('バージョン華', 'Ver.华')
            } else if (patt92.test(key)) {
                value = value.replace('パワー', 'POWER')
            } else if (patt99.test(key)) {
                value = value.replace('天空の宣言', '天空的宣言')
            } else if (patt169.test(key)) {
                value = value.replace('SpecII', '规格II')
            }
            //翻译一些00名称主词条
            if (patt165.test(key)) {
                value = value.replace('ガンダムデュナメスサーガ', '力天使高达传奇')
            } else if (patt141.test(key)) {
                value = value.replace('ガンダムアヴァランチエクシア', '雪崩能天使高达')
            } else if (patt131.test(key)) {
                value = value.replace('ガンダムエクシア', '能天使高达')
            } else if (patt132.test(key)) {
                value = value.replace('ガンダムデヴァイズエクシア', '能天使高达概念型')
            } else if (patt138.test(key)) {
                value = value.replace('ダブルオーガンダム', '00高达')
            } else if (patt139.test(key)) {
                value = value.replace('ダブルオーライザー', '00 RAISER')
            } else if (patt145.test(key)) {
                value = value.replace('ダブルオークアンタ', '00Q高达')
            } else if (patt146.test(key)) {
                value = value.replace('GNソード', 'GN剑')
            } else if (patt148.test(key)) {
                value = value.replace('ガンダムデュナメス＆デヴァイズデュナメス', '力天使高达概念型')
            } else if (patt149.test(key)) {
                value = value.replace('ガンダムデュナメス', '力天使高达')
            } else if (patt156.test(key)) {
                value = value.replace('ガンダムアストレアTYPE-Xフィンスターニス', '黑正义女神高达TYPE-X')
            } else if (patt150.test(key)) {
                value = value.replace('ガンダムアストレア', '正义女神高达')
            } else if (patt157.test(key)) {
                value = value.replace('GNアームズ TYPE-E', 'GN武装战机 TYPE-E')
            } else if (patt158.test(key)) {
                value = value.replace('プロトザンユニット', '原型XN组件')
            } else if (patt160.test(key)) {
                value = value.replace('GNアームズ TYPE-D', 'GN武装战机 TYPE-D')
            }
            //翻译一些00名称附词条
            if (patt133.test(key)) {
                value = value.replace('エクシア', '能天使')
            }
            if (patt136.test(key)) {
                value = value.replace('トランザムライザー', 'TRANS-AM RAISER')
            } else if (patt140.test(key)) {
                value = value.replace('セブンソード', '七剑型')
            } else if (patt142.test(key)) {
                value = value.replace('ウェポンプラスパック', '武器套装')
            } else if (patt143.test(key)) {
                value = value.replace('オプションパーツセット', '武器配件')
            } else if (patt144.test(key)) {
                value = value.replace('デザイナーズブルー', '海老川蓝色')
            } else if (patt147.test(key)) {
                value = value.replace('ブラスター', '爆裂步枪')
            } else if (patt151.test(key)) {
                value = value.replace('アヴァラングダッシュ', '雪崩')
            } else if (patt153.test(key)) {
                value = value.replace('GN HEAVY WEAPON SET', 'GN重武装型')
            } else if (patt154.test(key)) {
                value = value.replace('プロトGNハイメガランチャー', '原型GN粒子米加发射器')
            } else if (patt155.test(key)) {
                value = value.replace('高機動試験装備', '高机动试验装备')
            } else if (patt180.test(key)) {
                value = value.replace('フルセイバー', '全刃式')
            }
            //翻译一些00名称三级词条
            if (patt134.test(key)) {
                value = value.replace('リペア', '修复型')
            } else if (patt137.test(key)) {
                value = value.replace('トランザムVer.', 'TRANS-AM Ver.')
            } else if (patt135.test(key)) {
                value = value.replace('トランザム', 'TRANS-AM')
            } else if (patt152.test(key)) {
                value = value.replace('OPセット', 'OPTION套装')
            }
            //翻译销售类型
            if (patt25.test(key)) {
                value = value.replace('抽選販売', '抽选销售')
            }
            if (patt27.test(key)) {
                value = value.replace('開催記念商品', '纪念商品')
            }
            if (patt28.test(key)) {
                value = value.replace('イベント開催記念物販', '活动纪念特卖品')
            }
            if (patt34.test(key)) {
                value = value.replace('特別販売', '特别销售')
            }
            if (patt70.test(key)) {
                value = value.replace('CTM抽選', 'CTM抽选')
            }
            if (patt74.test(key)) {
                value = value.replace('事後販売', '事后销售')
            }
            if (patt82.test(key)) {
                value = value.replace('事前販売', '事前销售')
            }
            if (patt87.test(key)) {
                value = value.replace('受注販売', '预订销售')
            }
            if (patt127.test(key)) {
                value = value.replace('予約受付終了', '预约结束')
            }
            //这里进行EVA的翻译，其实就是翻译个“機”
            if (patt129.test(key)) {
                value = value.replace('機', '机')
            }
            if (patt129.test(key)) {
                value = value.replace('機', '机')
            }
            if (patt130.test(key)) {
                value = value.replace('専用武装セット', '专用武器套装')
            }

            //这里写的是说明书网站的翻译
            if (patt161.test(key)) {
                value = value.replace('コード', '代码')
            }
            if (patt162.test(key)) {
                value = value.replace('取扱説明書', '使用说明书')
            }
        }
        return value;
    }

    //监控网页的内容变化
    function watchUpdate() {
        const m = window.MutationObserver || window.WebKitMutationObserver;
        const observer = new m(function (mutations, observer) {
            for (let mutationRecord of mutations) {
                for (let node of mutationRecord.addedNodes) {
                    traverseElement(node);//网页内容发生变化去翻译
                }
            }
        });

        observer.observe(document.body, {
            subtree: true,
            characterData: true,
            childList: true,
        });
    }
})();
