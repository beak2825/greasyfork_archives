// ==UserScript==
// @name        Bangumi外部連結
// @namespace    waecy
// @version      99.1.8.0.2
// @description  自動獲取搜尋頁/動畫日文名 跳轉AniDB/MyAnimeList/ANN/TMDB /BT站/線上播放站一鍵跳轉
// @namespace    https://greasyfork.org/zh-CN/scripts/405283
// @author       waecy
//require＠ 輸入 https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js     
// @include      *://bangumi.tv/*
// @include      *://bgm.tv/*
// @include      *://chii.in/*
// @icon         https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @icon64       https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/536476/Bangumi%E5%A4%96%E9%83%A8%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/536476/Bangumi%E5%A4%96%E9%83%A8%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==
/*
  前提:
  本人之所以寫這個腳本的初衷,是因為每次補番並收藏時,有習慣尋找動畫的日文名/英文名/中文名,其中英文名最為重要
  只要有了英文名,無論去動畫花園,還是國內外各大BT/論壇等尋找資源都會很方便,因為多數人發布資源,都喜歡加英文名
  以前為了收集英文名,每次都得同時打開幾個網站,Ctrl + C,然後Ctrl + V黏貼,步驟比較繁瑣,這才下定決心寫個腳本
  方便自己,快速切換,不用每次重複輸入動畫名...如果大家也需要方便跳轉的,我寫的這個腳本能滿足你們的需求

    2022年5月18日14:31:53新增【同時打開詳情頁/AniDB】和【同時打開詳情頁/AniDB/Hanime1】
 */
// 2020年6月18日 新增字幕分類
// 2020年8月7日新增同時多標籤打開詳情頁和AniDB
// 2020年10月5日20:07:27修復標籤頁/收藏頁 跳轉動畫年鑑 和 字幕共享計劃 正常跳轉
// 2020年10月6日12:06:06判斷如果滾動位置大於頁面頭部,再進行固定,否則上方導航欄會擋住,無法正常點擊
// 2020年10月10日19:36:05新增AniList跳轉
// 2020年10月10日22:29:19新增動畫年鑑 新站跳轉
// 2020年10月11日18:26:11新增跳轉syoboi(日本)搜尋頁 和 KITSU(需手動輸入英文名)
// 2020年10月13日0:24:12新增【同人誌】分類及相關跳轉網站
// 2020年10月13日1:13:51新增【裏番線上】分類及相關跳轉網站
// 2020年10月14日18:14:52新增KITSU跳轉頁
// 2020年10月14日22:43:23新增風車動畫 和 櫻花動畫跳轉
// 2020年10月15日22:34:19新增嗨電影 跳轉
// 2020年10月20日13:36:24新增名優館 跳轉
// 2020年10月22日18:06:54新增Voiux 動畫 跳轉
// 1.6.8改9.9.9版本
// 2020年11月13日20:56:40新增 漫畫分類和 galgame分類
// 2020年11月26日19:19:41新增EroCool和Ahentai
// 2020年11月28日21:08:29更改AGE動畫域名tv為net
// 2020年11月29日2:20:11新增炮漫畫(PAO)
// 2020年12月2日20:05:30新增動畫領域(磁力)
// 2020年12月2日20:27:47新增跳轉Bangumi Moe 和AniRena搜尋頁
// 2020年12月10日19:13:28新增奇漫屋 和 漫畫粉
// 2020年12月14日19:04:06 裏番類新增 虎哥電影網 和 Small color分享手沖快樂
// 2020年12月14日19:15:09漫畫類新增 最漫畫/看漫畫 ,注釋漫畫唄/漫畫粉
// 2020年12月21日19:26:31新增Anime-Planet
// 2021年2月17日20:07:00新增【顯示/隱藏列表】按鈕
// 2021年2月19日13:52:44新增判斷,修復部分連同評分標籤隱藏問題
// 2021年2月20日20:42:20新增【點擊重設(目前列表共0條)】按鈕
// 2021年2月20日21:31:57【點擊重設(目前列表共0條)】按鈕點擊兩個自動同步數
// 2021年2月20日21:47:06更新了Ctrl + V時新增""雙引號,精準搜尋
// 2021年2月20日22:08:26修復Ctrl + V點擊搜尋按鈕後,第二次按Enter 鍵失效
// 2021年2月20日22:52:21更換滑鼠按下事件 和 黏貼時自動跳轉搜尋頁面
// 2021年3月10日19:24:25 BT下載分類新增JoJoDL 搜尋頁
// 2021年3月10日19:33:54 同人誌類新增JoyHentai(下拉看/讀取略慢)搜尋頁
// 2021年3月14日22:50:28 url新增作品頁
// 2021年4月28日19:39:18新增A4k字幕網
// 2021年6月4日10:25:54 BT下載類 新增跳轉 靈夢御所(裏番)
// 2021年6月4日11:08:12裏番線上類 刪除嗨電影,一本道影片http://www.flying2008.com/ 刪除名優館,M號房,JAV2020,愛玖玖
// 2021年6月4日11:09:32字幕下載類 新增VCB-S分享論壇(備份)
// 2021年6月4日12:26:22同人之類 刪除PeroPero, Ehentai無限制紳士
// 2021年6月4日13:05:49漫畫類 隱藏漫畫聯合國https://www.comicun.com/,已被牆,刪除漫畫牛https://www.manhuaniu.com,
// 2021年6月4日13:25:27galgame類 隱藏天使二次元,已屏蔽大陸,隱藏喵窩 刪除憂鬱的loli(補丁)
// 2021年6月4日15:10:43 BT類新增萌部落(裏番) / CXC星宮BT
// 2021年6月4日15:29:51 線上播放類 刪除失效跳轉網站 Qinmei / 五彈幕,新增天使動畫(備份)
// 2021年6月4日16:02:04新增判斷,搜尋頁為【點擊重設(目前列表共xxx條)】按鈕,收藏頁為【點擊重設(目前列表共xxx條 / 標籤數共xxx條)】按鈕
// 2021年6月4日18:30:37收藏頁預設,展開全部標籤
// 2021年6月29日23:15:34 BT下載類新增 零度動畫下載站 和 Shana Project 跳轉
// 2021年7月5日19:52:49 字幕下載類新增 ubtitles catalogue(國外/需登入/英文名搜尋)  / 'Subscene(國外/英文名搜尋) / AnimeSub.info(國外/英文名搜尋)
// 2021年7月21日12:56:20國外查詢類新增 ACDB(英文) 跳轉
// 2021年7月27日1:27:32 字幕下載區 新增 字幕天堂(日文名搜尋) 和 字幕天堂(中文名搜尋)
// 2021年7月31日13:32:51一鍵批次打開 判斷自動讀取下一頁尾本並正常批次打開詳情頁,並【Shift + Z】自動一鍵批次打開
// 2021年7月31日13:36:12 更改按下【Shift + R】列表數,配合 自動讀取下一頁尾本使用
// 2021年7月31日20:37:55 成功實現 自動讀取下一頁尾本, 【Shift + R】自動一鍵批次打開 ,並給新增列表新增跳轉列表
// 2021年7月31日22:15:29 完美成功實現 自動讀取下一頁尾本 新增跳轉按鈕
// 2021年8月17日22:44:59國外查詢類 新增 Fandom(日文名/建議英文名搜尋) 跳轉
// 2021年10月15日19:22:55線上播放類 新增 Myself 動漫(表番/裏番/日文搜) 和 Myself 動漫(表番/Google搜尋)
// 2022年3月27日16:49:19更改搜尋裏番,刪除The Animation多餘字元
// 2022年3月31日0:45:18 國外查詢類新增MoeLoad(裏番遊戲/中日文名搜尋)
// 2022年4月11日0:06:22如果裏番包含-The Motion Anime- 和The Motion Anime刪除
// 2022年5月18日14:31:53新增【同時打開詳情頁/AniDB】和【同時打開詳情頁/AniDB/Hanime1】
// 2023年07月04日 10:21:22 【國外查詢類】新增【Anison搜尋(日文名搜尋)】,【LiveChart搜尋(日文名搜尋)】,【PinkPineapple搜尋(裏番日文查詢,可看無碼預覽圖)】
// 2023年07月05日 22:01:44【裏番線上】類新增【跳轉正太的倉庫(跳轉搜尋頁/需最新版瀏覽器內核/不自動讀取外掛字幕)】
// 2023年11月16日 20:44:00更新「松鼠症倉庫」和「Small color」失效連結
// 2023年11月20日 18:39:31判斷點擊【同時打開詳情頁/Baka-Updates漫畫/MAL漫畫】,如果沒有日文名,預設中文名或者本身就日文名,英文名

$(function() {
    // (function() {
    // 循環遍歷li,新增跳轉a標籤
    $('.item.clearit .inner').each(function(index, ele) {
            // 獲取番/日文名
            var animeNames = $(ele).find('.grey').html();
            // 獲取番/中文名
            var scAnimeNames = $(ele).find('h3 a').html();
            // 獲取目前時間
            var selfDate = $(ele).find('.info.tip').html();
            // 保存日期對象
            var animeDateObj = {};
            // 判斷是否目前頁面時標籤頁,是否包含/anime/
            if (window.location.pathname.indexOf('/anime/') != -1) {
                // 聲明遍歷保存日期索引
                var getDataIndex = '';
                // 判斷是否有總集數,有的話進入判斷
                if (selfDate.indexOf(' / ') != -1 && selfDate.indexOf('話') != -1) {
                    // 獲取新的
                    animeDateObj = selfDate.substr(selfDate.indexOf(' / ') + 3, selfDate.length - 1).replace(/\s+/g, "");
                }
            } else {
                animeDateObj = selfDate.replace(/\s+/g, "");
            }
            // 保存日期對象
            animeDateObj = getListDate(animeDateObj, true);
            // 保存年
            var animeYear = animeDateObj.year;
            // 保存年
            var animeMonth = animeDateObj.month;
            // 保存年
            var animeDay = animeDateObj.day;
            // 如果搜尋頁沒有第二個日文名,預設用第一個搜尋
            if (!animeNames) {
                animeNames = scAnimeNames;
            }


            // 如果裏番包含The Animation.刪除
            if (animeNames.indexOf('The Animation') != -1) {
              // 刪除The Animation重新賦值
              animeNames = animeNames.slice('The Animation', animeNames.indexOf('The Animation'));
            } else if (animeNames.indexOf('THE ANIMATION') != -1) {
               // 刪除The Animation重新賦值
              animeNames = animeNames.slice('THE ANIMATION', animeNames.indexOf('THE ANIMATION'));
            }


            if (scAnimeNames.indexOf('The Animation') != -1)  {
              // 刪除The Animation重新賦值
              scAnimeNames = scAnimeNames.slice('The Animation', scAnimeNames.indexOf('The Animation'));
            } else if (scAnimeNames.indexOf('THE ANIMATION') != -1) {
               // 刪除The Animation重新賦值
              scAnimeNames = scAnimeNames.slice('THE ANIMATION', scAnimeNames.indexOf('THE ANIMATION'));
            }

             // 如果裏番包含-The Motion Anime- 和The Motion Anime刪除
            if (animeNames.indexOf('-The Motion Anime-') != -1)  {
              // 刪除The Animation重新賦值
              animeNames = animeNames.slice('-The Motion Anime-', animeNames.indexOf('-The Motion Anime-'));
            } else if (scAnimeNames.indexOf('The Motion Anime') != -1) {
               // 刪除The Animation重新賦值
              animeNames = animeNames.slice('The Motion Anime', animeNames.indexOf('The Motion Anime'));
            }

            if (scAnimeNames.indexOf('-The Motion Anime-') != -1)  {
              // 刪除The Animation重新賦值
              scAnimeNames = scAnimeNames.slice('-The Motion Anime-', scAnimeNames.indexOf('-The Motion Anime-'));
            } else if (scAnimeNames.indexOf('The Motion Anime') != -1) {
               // 刪除The Animation重新賦值
              scAnimeNames = scAnimeNames.slice('The Motion Anime', scAnimeNames.indexOf('The Motion Anime'));
            }

            /* ================ 外連至【資源下載】網站Start ================*/
            $(ele).append('<div class="box"><p class="domesticClass">' + '<label>' + '<input type="checkbox" name="domesticSearch" class="domesticSearch" value="資源下載">' + '資源下載: ' + '</label>' +
                /* ========= 外連至 南+(需登入/線上+下載) 搜尋頁 =========*/
                addEle('a', '南+(需登入/線上+下載)', animeNames, 'https://bbs.imoutolove.me/search.php?keyword=') +
	/* ========= 外連至'Eyny搜尋頁 =========*/
                addEle('a', 'Eyny(Google搜尋)', animeNames, 'https://www.google.com/search?newwindow=1&source=hp&q=', 'site:eyny.com') + '</p>');
            /* ================ 外連至【資源下載】網站End ================*/

            /* ================ 外連至【國外查詢】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" checked name="abroadSearch" class="abroadSearch" value="國外查詢類">' + '國外查詢類: ' + '</label>' +
                /* ========= 外連至AniDB搜尋頁 =========*/
                addEle('a', 'AniDB', animeNames, 'http://anidb.net/perl-bin/animedb.pl?adb.search=', '&show=animelist') +
                /* ========= 外連至MyAnimeList搜尋頁 =========*/
                addEle('a', 'MAL', animeNames, 'https://myanimelist.net/anime.php?q=') +
                addEle('a', 'MAL(全部搜)', animeNames ,
                  'https://myanimelist.net/search/all?q=', "&cat=all") +
                /* ========= 外連至Anime News Network搜尋頁 =========*/
                addEle('a', 'ANN', animeNames, 'https://www.animenewsnetwork.com/encyclopedia/search/name?q=') +
                /* ========= 外連至TMDB搜尋頁 =========*/
                addEle('a', 'TMDB', animeNames, 'https://www.themoviedb.org/search?language=zh-CN&query=') +
                /* ========= 外連至TMDB搜尋頁 =========*/
                addEle('a', 'TVDB', animeNames, 'https://www.thetvdb.com/search?query=') +
                /* ========= 外連至Anikore(日本)搜尋頁 =========*/
                addEle('a', 'Anikore(日本)', animeNames, 'https://www.anikore.jp/anime_title/') +
                /* ========= 外連至SATI(日本)搜尋頁 =========*/
                addEle('a', 'SATI(日本)', animeNames, 'https://www.animesachi.com/visitor/search.php?key=', '&image.x=23&image.y=7') +
                /* ========= 外連至syoboi(日本)搜尋頁 =========*/
                addEle('a', 'syoboi(日本)', animeNames, 'http://cal.syoboi.jp/find?sd=0&kw=', '&st=&cm=&r=0&rd=&v=0') +
                /* ========= 外連至 Fanart 搜尋頁 =========*/
                addEle('a', 'Fanart(有英文名時用)', animeNames, 'https://fanart.tv/?sect=all&s=') +
                /* ========= 外連至 IMDb 搜尋頁 =========*/
                addEle('a', 'IMDb', animeNames, 'https://www.imdb.com/find?q=', '&ref_=nv_sr_sm') +
                /* ========= 外連至 AniList 搜尋頁 =========*/
                addEle('a', 'AniList', animeNames, 'https://anilist.co/search/anime?search=') +
                /* ========= 外連至 KITSU 搜尋頁 =========*/
                addEle('a', 'KITSU', animeNames,
                    // 'https://anilist.co/search/anime?search=') +
                    'https://kitsu.io/anime?text=') +
                /* ========= 外連至 Anime-Planet 搜尋頁 =========*/
                addEle('a', 'Anime-Planet', animeNames, 'https://www.anime-planet.com/anime/all?name=') +
                /* ========= 外連至 V2Anime 搜尋頁 =========*/
                addEle('a', 'V2Anime', scAnimeNames, 'https://www.v2anime.com/search/?q=') +
                /* ========= 外連至 維基百科 搜尋頁 =========*/
                addEle('a', '維基百科(中文)', scAnimeNames, 'https://zh.wikipedia.org/zh-cn/') +
                /*addEle('a', '維基百科(中文)', scAnimeNames ,
                  'https://zh.jinzhao.wiki/wiki/') +*/
                /* ========= 外連至 維基百科 搜尋頁 =========*/
                addEle('a', '維基百科(日文)', animeNames, 'https://ja.wikipedia.org/wiki/') +
                /*addEle('a', '維基百科(日文)', animeNames ,
                  'https://ja.jinzhao.wiki/wiki/') +*/
                /* ========= ACDB(英文) =========*/
                addEle('a', 'ACDB(英文)', animeNames, 'https://www.animecharactersdatabase.com/searchall.php?searchin=c&sq=') +
                /* ========= ACDB(英文/按標題搜) =========*/
                addEle('a', 'ACDB(英文/按標題搜)', animeNames, 'https://www.animecharactersdatabase.com/searchall.php?in=titles&sq=') +
                /* ========= Fandom(日文名/建議英文名搜尋) =========*/
                addEle('a', 'Fandom(日文名/建議英文名搜尋)', animeNames, 'https://community.fandom.com/zh/wiki/Special:搜尋?query=') +

                /* ========= MoeLoad(裏番/中文名搜尋) =========*/
                addEle('a', 'MoeLoad(裏番/中文名搜尋)', scAnimeNames ,
                  'https://moeload.com/search/?q=', "&sdate=0,0,0000&edate=0,0,0000&t=0&c=0&g=0&art=hentai_movie&sort=title") +
                /* ========= MoeLoad(裏番/中文名搜尋) =========*/
                addEle('a', 'MoeLoad(裏番/日文名搜尋)', animeNames ,
                  'https://moeload.com/search/?q=', "&sdate=0,0,0000&edate=0,0,0000&t=0&c=0&g=0&art=hentai_movie&sort=title") +

                /* ========= MoeLoad(遊戲/中文名搜尋) =========*/
                addEle('a', 'MoeLoad(遊戲/中文名搜尋)', scAnimeNames ,
                  'https://moeload.com/search/?q=', "&sdate=0,0,0000&edate=0,0,0000&g=0&art=hentai_game&sort=title") +
                /* ========= MoeLoad(遊戲/中文名搜尋) =========*/
                addEle('a', 'MoeLoad(遊戲/日文名搜尋)', animeNames ,
                  'https://moeload.com/search/?q=', "&sdate=0,0,0000&edate=0,0,0000&g=0&art=hentai_game&sort=title") +

                 /* ========= Anison搜尋(日文名搜尋 =========*/
                addEle('a', 'Anison搜尋(日文名搜尋)', animeNames ,
                  'http://anison.info/data/n.php?m=pro&q=') +

                 /* ========= LiveChart搜尋(日文名搜尋) =========*/
                addEle('a', 'LiveChart搜尋(日文名搜尋)', animeNames ,
                  'https://www.livechart.me/search?q=') +

                 /* ========= PinkPineapple搜尋(裏番日文查詢,可看無碼預覽圖) =========*/
                addEle('a', 'PinkPineapple搜尋(裏番日文查詢,可看無碼預覽圖)', animeNames ,
                  'https://www.pinkpineapple.co.jp/list.php?s_cid=1&keywords=') +

                '</p>');
            /* ================ 外連至【國外查詢】網站End ================*/
            /* ================ 外連至【BT下載】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="btDownload" class="btDownload" value="BT下載">' + 'BT下載: ' + '</label>' +
                /* ========= 外連至動畫花園搜尋頁 =========*/
                addEle('a', '動畫花園', scAnimeNames, 'https://share.dmhy.org/topics/list?keyword=') +
                /* ========= 外連至U2動畫花園搜尋頁 =========*/
                addEle('a', 'U2動畫花園(有帳號的用)', animeNames, 'https://u2.dmhy.org/torrents.php?&spstate=0&inclbookmarked=0&search=', '&search_area=0&search_mode=0') +
                /* ========= 外連至Nyaa表站備份 搜尋頁 =========*/
                addEle('a', 'Nyaa表站', animeNames, 'http://nyaa.si/?f=0&c=1_4&q=') +
                addEle('a', 'Nyaa表站', animeNames, 'http://nyaa.iss.one/?f=0&c=1_4&q=') +
                /* ========= 外連至Nyaa裡站備份 搜尋頁 =========*/
                addEle('a', 'Nyaa裡站', animeNames, 'https://sukebei.nyaa.si/?f=0&c=1_1&q=') +
                /* ========= 外連至BT之家搜尋頁 =========*/
                addEle('a', 'BT之家', scAnimeNames, 'http://btbtt15.com/search-index-fid-981-orderby-timedesc-daterange-0-keyword-', '.htm') +
                /* ========= 外連至蜜柑計劃 搜尋頁 =========*/
                addEle('a', '蜜柑計劃', scAnimeNames, 'https://mikanime.tv/Home/Search?searchstr=') +
                /* ========= 外連至VCB-Studio搜尋頁 =========*/
                addEle('a', 'VCB-Studio', scAnimeNames, 'https://vcb-s.com/?s=', '&submit=') +
                /* ========= 外連至末日動漫資源庫搜尋頁 =========*/
                addEle('a', '末日動漫資源庫', scAnimeNames, 'https://share.acgnx.net/search.php?sort_id=0&keyword=') + addEle('a', 'AniX.Moe', scAnimeNames, 'https://www.anix.moe/search.php?sort_id=0&keyword=') +
                /* ========= 外連至簡單動畫 搜尋頁 =========*/
                addEle('a', '簡單動畫', scAnimeNames, 'https://www.36dm.club/search.php?keyword=') +
                /* ========= 外連至acg.rip 搜尋頁 =========*/
                addEle('a', 'acg.rip', scAnimeNames, 'https://acg.rip/?term=') +
                /* ========= 外連至旋風動畫 搜尋頁 =========*/
                addEle('a', '旋風動畫', scAnimeNames, 'http://share.xfapi.top:88/search.php?keyword=') +
                /* ========= 外連至 ACG狗狗 搜尋頁 =========*/
                addEle('a', ' ACG狗狗', scAnimeNames, 'http://bt.acg.gg/search.php?keyword=') +
                /* ========= 外連至 MioBT 搜尋頁 =========*/
                addEle('a', ' MioBT', scAnimeNames, 'http://miobt.com/search.php?keyword=') +
                /* ========= 外連至 愛戀動畫BT 搜尋頁 =========*/
                addEle('a', ' 愛戀BT', scAnimeNames, 'http://www.kisssub.org/search.php?keyword=') +
                /* ========= 外連至 漫貓動畫BT 搜尋頁 =========*/
                addEle('a', ' 漫貓BT', scAnimeNames, 'http://www.comicat.org/search.php?keyword=') +
                /* ========= 外連至 維基動畫BT 搜尋頁 =========*/
                addEle('a', '維基動畫BT', scAnimeNames, 'http://www.wikibt.com/search/?type=&search=', '&page=1') +
                /* ========= 外連至扶她動畫 搜尋頁 =========*/
                addEle('a', '扶她動畫BT站', scAnimeNames, 'https://futaacg.com/search/q_') +
                /* ========= 外連至漏勺網 搜尋頁 =========*/
                addEle('a', '漏勺網', scAnimeNames, 'http://www.loushao.net/search?text=') +
                /* ========= 外連至天空動畫 搜尋頁 =========*/
                addEle('a', '天空動畫', scAnimeNames, 'https://www.tkdm.xyz/?s=') +
                /* ========= 外連至零度動畫下載站 搜尋頁 =========*/
                addEle('a', '零度動畫下載站', scAnimeNames, 'https://bt.acgzero.com/?keyword=') +
                /* ========= 外連至嘀哩嘀哩BT站 搜尋頁 =========*/
                addEle('a', '嘀哩嘀哩BT站', scAnimeNames, 'https://www.dilidm.com/search-_', '.htm') +
                /* ========= Tokyo Toshokan搜尋頁 =========*/
                addEle('a', '東京圖書館', animeNames, 'https://www.tokyotosho.info/search.php?terms=', '&type=1&searchName=true&searchComment=true&size_min=&size_max=&username=') +
                /* ========= 外連至動畫領域(磁力) 搜尋頁 =========*/
                addEle('a', '動畫領域(磁力)', scAnimeNames, 'https://dmly.me/?cat=0&s=') +
                /* ========= 外連至Bangumi Moe 搜尋頁 =========*/
                addEle('a', 'Bangumi Moe', scAnimeNames, 'https://bgm.ptr.moe/search?query=') +
                /* ========= 外連至AniRena(英文)搜尋頁 =========*/
                addEle('a', 'AniRena(英文)', animeNames, 'https://www.anirena.com/?s=') +
                /* ========= 外連至Shana Project搜尋頁 =========*/
                addEle('a', 'Shana Project', animeNames, 'https://www.shanaproject.com/search/?title=') +
                /* ========= 外連至琉璃神社(裏番) 搜尋頁 =========*/
                addEle('a', '琉璃神社(裏番)', animeNames, 'https://www.hacg.lv/wp/?s=') +
                /* ========= 外連至靈夢御所(裏番) 密碼:⑨搜尋頁 =========*/
                addEle('a', '靈夢御所(裏番) 密碼:⑨', animeNames, 'https://blog.reimu.net/search/') +
                /* ========= 外連至二次元下午茶(裏番) 搜尋頁 =========*/
                addEle('a', '二次元下午茶(裏番)', animeNames, 'https://www.teannn.com/?s=') +
                /* ========= 外連至萌部落(裏番) 搜尋頁 =========*/
                addEle('a', '萌部落(裏番)', animeNames, 'https://lf.moe.pm/search/') +
                /* ========= 外連至次元計劃 搜尋頁 =========*/
                addEle('a', '次元計劃(裏番)', animeNames, 'https://acg02.net/?cat=0&s=') +
                /* ========= 外連至CXC星宮BT 搜尋頁 =========*/
                addEle('a', 'CXC星宮BT(裏番)', animeNames, 'https://bt.cosxcos.cc/search/') +
                /* ========= 外連至JoJoDL(裏番) 搜尋頁 =========*/
                addEle('a', 'JoJoDL(裏番)', animeNames, 'https://jojodl.com/zh/search/ac0/s_') +
                /* ========= 外連至JZooqle(英文名搜/需英文名搜尋)搜尋頁 =========*/
                addEle('a', 'Zooqle(英文名搜/需英文名搜尋)', scAnimeNames, 'https://zooqle.com/search?q=') +
                /* ========= 外連至JZooqle(日文搜/需英文名搜尋)搜尋頁 =========*/
                addEle('a', 'Zooqle(日文搜/需英文名搜尋)', animeNames, 'https://zooqle.com/search?q=') + '</p>');
            /* ================ 外連至【BT下載】網站End ================*/
            /* ================ 外連至【論壇下載】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="bbsDownload" class="bbsDownload" value="論壇下載">' + '論壇下載: ' + '</label>' +
                /* ========= 天使動畫論壇搜尋頁 =========*/
                addEle('a', '天使動畫論壇(需登入)', scAnimeNames, 'https://www.tsdm39.com/plugin.php?id=Kahrpba:search&query=') +
                /* ========= 緋月論壇搜尋頁 =========*/
                addEle('a', '緋月論壇(需登入)', scAnimeNames, 'https://kf.miaola.work/thread.php?fid=92&page=8&keyword=') + '</p>');
            /* ================ 外連至【論壇下載】網站End ================*/
            /* ================ 外連至【字幕下載】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox"  name="subDownload" class="subDownload" value="線上播放">' + '字幕下載: ' + '</label>' +
                /* ========= 外連至U2動畫花園搜尋頁 =========*/
                addEle('a', 'U2動畫花園(有帳號的用)', animeNames, 'https://u2.dmhy.org/subtitles.php?search=') +
                /* ========= 外連至VCB-S分享論壇搜尋頁 =========*/
                addEle('a', 'VCB-S分享論壇', animeNames, 'https://bbs.acgrip.com/search.php?mod=forum&adv=yes&srchtxt=') +
                /* ========= 外連至VCB-S分享論壇(備份)搜尋頁 =========*/
                addEle('a', 'VCB-S分享論壇(備份)', animeNames, 'https://404.website/search.php?mod=forum&adv=yes&srchtxt=') +
                /* ========= 外連至射手網(偽)搜尋頁 =========*/
                addEle('a', '射手網(偽)', animeNames, 'http://assrt.net/sub/?searchword=') +
                /* ========= 外連至字幕庫搜尋頁 =========*/
                addEle('a', '字幕庫', animeNames, 'http://zimuku.org/search?q=') +
                /* ========= 外連至SubHD搜尋頁 =========*/
                addEle('a', 'SubHD', animeNames, 'https://subhd.tv/search/') +
                /* ========= 外連至SubHD搜尋頁 =========*/
                addEle('a', 'SubHD(簡體)', animeNames, 'https://subhd.tv/search/') + addEle('a', 'SubHDTW(繁體)', animeNames, 'https://subhdtw.com/search/') +
                /* ========= 外連至A4k字幕網搜尋頁 =========*/
                addEle('a', 'A4k字幕網', animeNames, 'https://www.a4k.net/search?term=') +
                /* ========= 外連至動畫年鑑 日期頁 =========*/
                addEle('a', '動畫年鑑(日期版/只能看)', animeNames + '&animeYear=' + animeYear + '&animeMonth=' + animeMonth + '&animeDay=' + animeDay, 'https://animeannals.xido.workers.dev/0:/', 1, 'AnimeYearbooks') +
                /* ========= 外連至動畫年鑑 搜尋頁 =========*/
                addEle('a', '動畫年鑑(搜尋版/只能看)', scAnimeNames, 'https://animeannals.xido.workers.dev/0:search?q=') +
                /* ========= 動畫城(日期版/TV頁跳轉) 搜尋頁 =========*/
                addEle('a', '動畫城(日期版/TV頁跳轉)', animeNames + '&animeYear=' + animeYear + '&animeMonth=' + animeMonth + '&animeDay=' + animeDay, 'https://animeannals.xido.workers.dev/0:/', 1, 'cartoonCityTV') +
                /* ========= 動畫城(日期版/劇場版頁跳轉) 搜尋頁 =========*/
                addEle('a', '動畫城(日期版/劇場版頁跳轉)', scAnimeNames + '&animeYear=' + animeYear + '&animeMonth=' + animeMonth + '&animeDay=' + animeDay, 'https://animeannals.xido.workers.dev/0:/', 1, 'cartoonCityTheaterVersion') +
                /* ========= 外連至動畫城(日文) 搜尋頁 =========*/
                addEle('a', '動畫城(日文)', scAnimeNames, 'https://misty-lake-695d.animedi2.workers.dev/0:search?q=') +
                /* ========= 外連至動畫城(中文) 搜尋頁 =========*/
                addEle('a', '動畫城(中文)', animeNames, 'https://misty-lake-695d.animedi2.workers.dev/0:search?q=') +
                /* ========= 外連至sub_share: 字幕共享計劃 頁 =========*/
                addEle('a', '字幕共享計劃(GitHub)', animeNames + '&animeYear=' + animeYear + '&animeMonth=' + animeMonth + '&animeDay=' + animeDay, 'https://github.com/foxofice/sub_share/tree/master/subs_list/animation?animeNames=', 1, 'AnimeSubShare') +
                /* ========= 外連至字幕天堂(日文名搜尋)搜尋頁 =========*/
                addEle('a', '字幕天堂(日文名搜尋)', animeNames, 'https://www.zimutiantang.com/search/?q=') +
                /* ========= 外連至字幕天堂(中文名搜尋)搜尋頁 =========*/
                addEle('a', '字幕天堂(中文名搜尋)', scAnimeNames, 'https://www.zimutiantang.com/search/?q=') +
                /* ========= 外連至OpenSubtitles搜尋頁 =========*/
                addEle('a', 'OpenSubtitles(有英文名時用)', scAnimeNames, 'https://www.opensubtitles.org/zh/search2/sublanguageid-all/moviebytesize-78771737/moviename-') +
                /* ========= 外連至Subtitles catalogue(國外/需登入/英文名搜尋)搜尋頁 =========*/
                addEle('a', 'Subtitles catalogue(國外/需登入/英文名搜尋)', animeNames, 'http://subs.com.ru/index.php?e=search&sq=') +
                /* ========= 外連至Subscene(國外/需登入/英文名搜尋)搜尋頁 =========*/
                addEle('a', 'Subscene(國外/英文名搜尋)', scAnimeNames, 'https://subscene.com/subtitles/searchbytitle?keyword=') +
                /* ========= 外連至AnimeSub.info(國外/需登入/英文名搜尋)搜尋頁 =========*/
                addEle('a', 'AnimeSub.info(國外/英文名搜尋)', animeNames, 'http://animesub.info/szukaj.php?szukane=') + '</p>');
            /* ================ 外連至【字幕下載】網站End ================*/
            /* ================ 外連至【線上播放】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="watchOnline" class="watchOnline" value="線上播放">' + '線上播放: ' + '</label>' +
                    /* ========= 外連至A站搜尋頁 =========*/
                addEle('a', 'AcFun(A站)', scAnimeNames,
                  'https://www.acfun.cn/search?keyword=') +


                /* ========= 外連至B站搜尋頁 =========*/
                addEle('a', 'bilibili(B站', scAnimeNames,
                  'https://search.bilibili.com/all?keyword=') +

                 /* ========= 外連至C站搜尋頁 =========*/
                 addEle('a', 'tucao(C站', scAnimeNames,
                  'https://www.tucao.cam/index.php?m=content&c=search&a=init&catid=24&dosubmit=1&orderby=a.id+DESC&info%5Btitle%5D=') +


                /* ========= NyaFun(彈幕播放器+自動播放下一集, 字幕組的源) =========*/
                 addEle('a', 'NyaFun(彈幕播放器+自動播放下一集, 字幕組的源)', scAnimeNames,
                  'https://www.nyafun.net/search.html?wd=') +


                 /* ========= 外連至M站(嗶咪嗶咪)搜尋頁 =========*/
                 addEle('a', '嗶咪嗶咪(M站)', scAnimeNames,
                  'http://www.bimiacg4.net/vod/search/wd/') +

                /* ========= 外連至zzzfun搜尋頁 =========*/
                addEle('a', 'zzzfun(Z站)', scAnimeNames,
                  'http://www.zzzfun.one/vod_search.html?wd=') +

                /* ========= 外連至嘶哩嘶哩(S站)搜尋頁 =========*/
                addEle('a', '嘶哩嘶哩(S站)', scAnimeNames,
                  'https://www.silisilifun.com/vodsearch') +

                /* ========= 外連至風車動畫(doubao) 搜尋頁 =========*/
                /* addEle('a', '風車動畫(doubao)', scAnimeNames,
                  'http://www.doubao.cc/search.asp?searchword=') +
*/
                 /* ========= 外連至風車動畫(dm190) 搜尋頁 =========*/
                 /*addEle('a', '風車動畫(dm190)', scAnimeNames,
                  'http://www.dm190.com/search.asp?searchword=') +
*/

                 /* ========= 外連至櫻花動畫(yhdm) 搜尋頁 =========*/
                 addEle('a', '櫻花動畫(yhdm)', scAnimeNames,
                  'http://www.yhdm.io/search/') +

                /* ========= 外連至天使動畫(天樂動畫)  搜尋頁 =========*/
                /* addEle('a', '天使動畫(天樂動畫) ', scAnimeNames,
                  'http://www.kudm.net/search.asp?searchword=') +*/

                 /* ========= 外連至天使動畫(備份)  搜尋頁 =========*/
                /* addEle('a', '天使動畫(備份)', scAnimeNames,
                  'http://www.txdm.net/search.asp?searchword=') +*/

                 /* ========= 外連至AGE動畫 搜尋頁 =========*/
                 addEle('a', 'AGE動畫', scAnimeNames,
                  'https://www.agemys.org/search?query=',
                  '&page=') +

                  /* ========= 外連至妮可動畫 搜尋頁 =========*/
                    addEle('a', '妮可動畫', scAnimeNames,
                      'http://www.nicotv.vip/video/search/',
                      '.html') +

                 /* ========= 外連至飛極速線上 搜尋頁 =========*/
                 addEle('a', '飛極速線上', scAnimeNames,
                  'http://feijisu21.com/search/') +

                /* ========= 外連至 Myself 動漫(表番/裏番/日文搜) =========*/
                  addEle('a', 'Myself 動漫(表番/裏番/日文搜)', animeNames,
                  'https://myself-bbs.com/search.php?keyword=') +

                 /* ========= 外連至 Myself 動漫(表番/Google搜尋) 搜尋頁 =========*/
                 addEle('a', ' Myself 動漫(表番/Google搜尋)', scAnimeNames ,
                  'https://www.google.com/search?newwindow=1&source=hp&q=',
                  ' site:myself-bbs.com') +

                /* ========= 外連至 巴哈姆特動畫瘋 搜尋頁 =========*/
                addEle('a', '動畫瘋', animeNames,
                  'https://ani.gamer.com.tw/search.php?kw=') +
                     '</p>')


                /* ================ 外連至【線上播放】網站End ================*/
                /* ================ 外連至【裏番線上】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="watchOnline" class="watchOnline" value="裏番線上">' + '裏番線上: ' + '</label>' +
                                   /* ========= 外連至  Small color分享手沖快樂(少/html5播放) 搜尋頁 =========*/
                addEle('a', 'Small color分享手沖快樂(少/html5播放)', animeNames,
                  'http://www.smallcolor.link/search/', '/') +

                  /* ========= 外連至 18AV影片區 搜尋頁 =========*/
                  addEle('a', '18AV影片區(清晰/較快)', animeNames,
                  'https://a2a6a12.com/serch/18av_serch.html?keyword=') +

                  addEle('a', '18AV影片區(備份2/域名常變動)', animeNames,
                   'https://maa1820.com/serch/18av_serch.html?keyword=') +

                /* ========= 外連至 Hanime1 搜尋頁 =========*/
                addEle('a', 'Hanime1(清晰)', animeNames,
                  'https://hanime1.me/search?query=') +

                /* ========= 外連至 YINGAV 搜尋頁 =========*/
                addEle('a', 'YINGAV(清晰/較快)', animeNames,
                  'https://yingav1.com/search/', '/') +

                addEle('a', 'YINGAV(備份2/yingav8)', animeNames,
                  'https://yingav8.com/search/', '/') +

                addEle('a', 'YINGAV(備份3/yingav20)', animeNames,
                  'https://yingav20.com/search/', '/') +

              /*  addEle('a', 'YINGAV(備份4/yingav2)', animeNames,
                  'https://yingav2.com/search/', '/') +

                addEle('a', 'YINGAV(備份5/yingav9)', animeNames,
                  'https://yingav9.com/search/', '/') + */

                   /* ========= 外連至正太的倉庫(跳轉搜尋頁/需最新版瀏覽器內核/不自動讀取外掛字幕) =========*/
                  addEle('a', '正太的倉庫(跳轉搜尋頁/需最新版瀏覽器內核/不自動讀取外掛字幕)', animeNames,
                  'https://ztxdjj.eu.org/0:search?q=') +

                  /* ========= 外連至hanime1.online搜尋頁 =========*/
                  addEle('a', 'hanime1.online', animeNames,
                  'https://hanime1.online/?s=') +

                    /* ========= 外連至 ExPornToons(日文&英文搜尋/JW Player播放) 搜尋頁 =========*/
                    addEle('a', ' ExPornToons(日文&英文搜尋/JW Player播放)', animeNames,
                      'https://hot.exporntoons.net/video/') +

                    /* ========= 外連至 第一動畫 搜尋頁 =========
                         原http://vip.1anime.me
                    */
                    addEle('a', '第一動畫(原1anime)(需登入/自動播放下一集)', animeNames, 'https://1anime.me/vodsearch/-------------.html?wd=') +
                    /* ========= 外連至 久久熱影片 搜尋頁 =========*/
                addEle('a', '久久熱影片(需登入積分看/清晰/較快)', animeNames,
                  'https://www.99pp70.com/search/', '/') +


                /* ========= 外連至 松鼠症倉庫 搜尋頁 =========*/
                addEle('a', '松鼠症倉庫(快取慢)', animeNames,
                  'http://2022-11-06v.cfd/index.php?route=animation%2Flist&search=') +
                    /* ========= 外連至 迪圖電影網 搜尋頁 =========*/
                    addEle('a', '迪圖電影網(快取慢)', animeNames, 'http://www.ditudy.com/vod-search-wd-', '.html') +
                    /* ========= 外連至 她的電影網 搜尋頁 =========*/
                    addEle('a', '她的電影網(快取慢)', animeNames, 'http://www.tadedy.com/search.php?searchword=') +
                    /* ========= 外連至 惡魔島 搜尋頁 =========*/
                    addEle('a', '惡魔島(不全/快取快)', animeNames, 'https://www.emddmw.com/search.php?searchword=') +
                    /* ========= 外連至 虎哥電影網 搜尋頁 =========*/
                    addEle('a', '虎哥電影網', animeNames, 'http://www.hugedy.com/search.php?searchword=') +
                    /* ========= 外連至  99影視網(不全/快取快) 搜尋頁 =========*/
                    addEle('a', ' 99影視網(不全/快取快)', animeNames, 'https://www.movie699.com/vod/search.html?wd=') +
                    /* ========= 外連至 AVbebe(線上) 搜尋頁 =========*/
                    addEle('a', 'AVbebe(快取慢)', animeNames, 'https://avbebe.com/?s=') +
                    /* 104.21.91.233 avbebe.com
                     172.67.181.159 avbebe.com*/
                    /* ========= 外連至 ACG動畫花園 搜尋頁 =========*/
                    addEle('a', 'ACG動畫花園(快取慢)', animeNames, 'https://v.acgnhy.com/vodsearch/-------------/?wd=') +
                    /* ========= 外連至 韓漫 搜尋頁 =========*/
                    /*addEle('a', '韓漫(快取快)', animeNames,
                      'https://www.han-man.xyz/search?search=') +*/
                    /* ========= 外連至 hentaidude 搜尋頁 =========*/
                    addEle('a', 'hentaidude(建議手動輸英文名)', animeNames, 'https://hentaidude.com/?s=') +
                    /* ========= 外連至 HentaiAnimeZone 搜尋頁 =========*/
                    addEle('a', 'HentaiAnimeZone(需手動輸入英文名)', animeNames, 'https://hentaianimezone.com/?s=') +
                    /* ========= 外連至 Google搜尋頁 =========*/
                    addEle('a', 'Google搜尋頁)', animeNames, 'https://fanqiang.yanke.info/search?source=hp&ei=nGw7X4-CPdbP0PEPw9uL2Ac&q=', '+%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE&btnK=Google+%E6%90%9C%E7%B4%A2') +
                    /* ========= 外連至 Google搜尋頁 =========*/
                    addEle('a', 'Google+限目搜尋頁)', animeNames, 'https://www.google.com/search?newwindow=1&source=hp&q=正在播放：', '+限目') + '</p>')
                /* ================ 外連至【裏番線上】網站End ================*/
                /* ================ 外連至【同人誌】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="ComicOnline" class="btDownload" value="同人誌">' + '同人誌: ' + '</label>' +
                    /* ========= 外連至The Doujinshi & Manga Lexicon(這個同人誌 & 漫畫詞典)搜尋頁 =========*/
                    /*已關站*/
                    //addEle('a', ' The Doujinshi & Manga Lexicon(查詢)', animeNames, 'https://www.doujinshi.org/search/simple/?T=objects&sn=') +
                    /* ========= 外連至 松鼠症倉庫 搜尋頁 =========*/
                    addEle('a', '松鼠症倉庫(讀取快/下拉)', animeNames, 'http://2023-07-25suqbcgrmwwc.top/index.php?route=comic/comicList&search=') +
                /* ========= 外連至 Ahentai.to 搜尋頁 =========*/
                addEle('a', 'caitlin.top(讀取快/下拉)', animeNames,
                  'https://caitlin.top/index.php?route=comic/list&search_key=') +

                /* 104.21.53.7 caitlin.top apt.caitlin.top ap2.caitlin.top
                #172.67.206.203 caitlin.top apt.caitlin.top ap2.caitlin.top*/

                    /* ========= 外連至 EroCool搜尋頁 =========*/
                    addEle('a', 'EroCool(讀取略慢/下拉)', animeNames, 'https://zha.erocool.me/search/q_', '%20') +

                    /* ========= 外連至 JoyHentai(下拉看/讀取略慢)搜尋頁 =========*/
                    addEle('a', 'JoyHentai(讀取略慢/下拉)', animeNames, 'https://zh.joyhentai.fun/search/q_', ' ') +
                    /* ========= 外連至 紳士表站 搜尋頁 =========*/
                    addEle('a', 'e-hentai', animeNames, 'https://e-hentai.org/?f_search=', '+') +
                    /* ========= 外連至 EX裡站 搜尋頁 =========*/
                    addEle('a', 'exhentai', animeNames, 'https://exhentai.org/?f_search=', '+') +
                    /* ========= 外連至 紳士漫畫 搜尋頁 =========*/
                    addEle('a', '紳士漫畫(翻頁)', animeNames, 'https://www.wnacg.com/search/?q=') +
                    /*
                      104.26.10.177 www.wnacg.org forum.wnacg.org img3.wnacg.com
                      #104.26.11.177 www.wnacg.org forum.wnacg.org img3.wnacg.com
                      #172.67.71.248 www.wnacg.org forum.wnacg.org img3.wnacg.com

                      104.21.42.104 www.wnacg.com forum.wnacg.com img3.wnacg.com
                      #172.67.161.59 www.wnacg.com forum.wnacg.com img3.wnacg.com

                      #104.21.83.204 www.wnacg.net forum.wnacg.net img3.wnacg.com
                      172.67.181.75 www.wnacg.net forum.wnacg.net img3.wnacg.com
                     */
                    /* ========= 外連至 禁漫天堂 搜尋頁 =========*/
                    /* ========= 外連至 禁漫天堂 搜尋頁 =========*/
                addEle('a', '禁漫天堂(略慢)', animeNames,
                  'https://jmcomic1.cc/search/photos?search_query=') +
                 addEle('a', '禁漫天堂2(略慢)', animeNames,
                  'https://18comic2.art/search/photos?search_query=') +

                    /* ========= 外連至 喵紳士(NyaHentai) 搜尋頁 =========*/
                    addEle('a', '喵紳士(NyaHentai)略慢', animeNames, 'https://zh.yyhentai.com/search/q_', '%20') +
                    /* ========= 外連至 台灣(twhentai) 搜尋頁 =========*/
                    addEle('a', '台灣(twhentai)翻頁', animeNames, 'https://twhentai.com/search/', '中/') +
                    /* ========= 外連至 H-Comic 搜尋頁 =========*/
                    addEle('a', 'H-Comic(下拉看)', animeNames, 'https://h-comic.com/?q=') +
                    /* ========= 外連至 AVbebe(線上) 搜尋頁 =========*/
                    addEle('a', 'AVbebe(下拉看)', animeNames, 'https://avbebe.com/?s=') +
                    /* ========= 外連至 炮漫畫(PAO) 搜尋頁 =========*/
                   /* addEle('a', '炮漫畫(PAO)', animeNames, 'http://paomh.pw/search?keyword=') +*/
                    /* ========= 外連至 北+(需登入/線上+下載) 搜尋頁 =========*/
                    addEle('a', '北+(需登入/線上+下載)', animeNames, 'https://bbs.imoutolove.me/search.php?keyword=') + '</p>')
                /* ================ 外連至【同人誌】網站End ================*/
                /* ================ 外連至【漫畫類】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="Manga" class="btDownload Manga" value="漫畫相關">' + '漫畫類: ' + '</label>' +
                    /* ========= 外連至 Baka-Updates Manga(查詢漫畫情報) 搜尋頁 =========*/
                    addEle('a', 'Baka-Updates Manga(查詢漫畫情報)', animeNames, 'https://www.mangaupdates.com/index.html?keyword=') +
                    addEle('a', 'BUM(查詢漫畫情報/代理)', animeNames, 'http://tasen.byethost5.com/p/index.php?url=yE1i1tyZyB1O1B18yC1ryY1jyMymyhydyUyz141i1Hyd0Kyj17yL1x1z17&keyword=') +

                    addEle('a', 'BUM(MetaGer 檢索)', animeNames, 'https://metager.de/meta/meta.ger3?eingabe=', '+site%3Awww.mangaupdates.com&submit-query=&focus=web&s=&f=&ff=&ft=&m=') +
                    /* ========= 外連至 動畫之家(線上) 搜尋頁 =========*/
                    addEle('a', '動畫之家(線上)', scAnimeNames, 'http://manhua.dmzj.com/tags/search.shtml?s=') +
                    /* ========= 外連至 看漫畫/漫畫櫃(線上) 搜尋頁 =========*/
                    addEle('a', '看漫畫/漫畫櫃(線上)', scAnimeNames, 'https://www.mhgui.com/s/', '.html') +
                    /* ========= 奇漫屋(下拉看) 搜尋頁 =========*/
                    addEle('a', '奇漫屋(下拉看)', scAnimeNames, 'http://www.qiman6.com/search.php?keyword=') +
                    /* ========= 最漫畫(下拉看) 搜尋頁 =========*/
                    addEle('a', '最漫畫(下拉看)', scAnimeNames, 'https://www.zuimh.com/search/?keywords=') +
                    /* ========= 看漫畫(下拉看) 搜尋頁 =========*/
                    addEle('a', '看漫畫(下拉看)', scAnimeNames, ' https://www.kanman.com/sort/#') +
                    /* ========= 外連至 久久漫畫(線上) 搜尋頁 =========*/
                    addEle('a', '久久漫畫(線上)', scAnimeNames, 'http://99.hhxxee.com/search/s.aspx?search_keyword=') +
                    /* ========= 外連至 動畫屋(線上) 搜尋頁 =========*/
                    addEle('a', '動畫屋(線上)', scAnimeNames, 'http://www.dm5.com/search?title=') +
                    /* ========= 外連至 漫畫聯合國(被牆/線上) 搜尋頁 =========*/
                    /*addEle('a', '漫畫聯合國(被牆/線上)', scAnimeNames,
                  'https://www.comicun.com/search-index?entry=', '&ie=gbk&q=' + scAnimeNames) +
*/
                    /* ========= 外連至 90漫畫網(線上) 搜尋頁 =========*/
                    addEle('a', '90漫畫網(線上/被牆)', scAnimeNames, 'http://www.90mh.com/search/?keywords=') +
                    /* ========= 外連至 98漫畫網(線上) 搜尋頁 =========*/
                    addEle('a', '98漫畫網(線上)', scAnimeNames, 'http://www.90mh.com/search/?keywords=') +
                    /* ========= 外連至 36漫畫網(線上) 搜尋頁 =========*/
                    addEle('a', '36漫畫網(線上)', scAnimeNames, 'https://www.98mh.com/statics/search.aspx?key=') +
                    /* ========= 外連至 COCO漫畫(線上) 搜尋頁 =========*/
                    addEle('a', 'COCO漫畫(線上)', scAnimeNames, 'https://www.cocomanhua.com/search?searchString=') +
                    /* ========= 外連至 xmanhua(F12下拉看)搜尋頁 =========*/
                    addEle('a', 'xmanhua(F12下拉看)', scAnimeNames, 'https://xmanhua.com/search?title=') +
                    /* ========= 外連至mangabz(F12下拉看) 搜尋頁 =========*/
                    addEle('a', 'mangabz(F12下拉看)', scAnimeNames, 'http://www.mangabz.com/search?title=') +
                    /* ========= 外連至 ol.moe(中文搜/線上+下載) 搜尋頁 =========*/
                    addEle('a', 'Vol.moe(中文搜/需登入下載)', scAnimeNames, 'https://volmoe.com/list.php?s=') +
                    /* ========= 外連至 zero搬運網(線上+下載) 搜尋頁 =========*/
                    addEle('a', 'zero搬運網論壇(線上+下載)', scAnimeNames, 'https://www.zerobywssd.com/plugin.php?id=jameson_manhua&a=search&c=index&keyword=') +
                    /* ========= 外連至 漫畫補檔(需登入/線上+下載) 搜尋頁 =========*/
                    addEle('a', '漫畫補檔論壇(需登入/線上+下載)', scAnimeNames, 'https://www.manhuabudang.com/?keyword=') +
                    /* ========= 外連至 漫畫補檔(線上+下載) 搜尋頁 =========*/
                    addEle('a', '萌享(MoeShar)論壇(需登入/線上+下載)', scAnimeNames, 'https://moeshare.cc/?keyword=') +
                    /* ========= 13DL.NET(國外/下載) 搜尋頁 =========*/
                    addEle('a', '13DL.NET(國外/下載)', animeNames, 'http://13dl.net/?s=') +
                    /* ========= Book Share ZIP(國外/下載) 搜尋頁 =========*/
                    addEle('a', 'Book Share ZIP(國外/下載)', animeNames, 'https://bszip.com/?s=') +
                    /* ========= CMCZIP(國外/下載) 搜尋頁 =========*/
                    addEle('a', 'CMCZIP(國外/下載)', animeNames, 'https://cmczip.com/?s=') +
                    /* ========= diszip(國外/下載) 搜尋頁 =========*/
                    addEle('a', 'diszip(國外/下載)', animeNames, 'https://diszip.com/?s=') +
                    /* ========= Dl-Raw(國外/下載) 搜尋頁 =========*/
                    addEle('a', 'Dl-Raw(國外/下載)', animeNames, 'https://dl-raw.net/?s=') +
                    /* ========= Dl-Zip(國外/下載) 搜尋頁 =========*/
                    addEle('a', ' Dl-Zip(國外/下載)', animeNames, 'http://dl-zip.com/?s=') +
                    /* ========= MANGA(國外/下載) 搜尋頁 =========*/
                    addEle('a', ' MANGA(國外/下載)', animeNames, 'https://manga-zip.net/?s=') +
                    /* ========= Manga zone(國外/下載) 搜尋頁 =========*/
                    addEle('a', ' Manga zone(國外/下載)', animeNames, 'http://www.manga-zone.org/?s=') +
                    /* ========= MANGA314(國外/下載) 搜尋頁 =========*/
                    addEle('a', ' MANGA314(國外/下載)', animeNames, 'https://manga314.com/?s=') +
                    /* ========= Raw-Zip(國外/下載) 搜尋頁 =========*/
                    addEle('a', ' Raw-Zip(國外/下載)', animeNames, 'http://raw-zip.com/?s=') + '</p>')
                /* ================ 外連至【漫畫類】網站End ================*/

                /* ================ 外連至【galgame類】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="galgame" class="btDownload galgame" value="galgame類">' + 'galgame類: ' + '</label>' +
                    /* ========= 外連至 松vndb(查詢類) 搜尋頁 =========*/
                    addEle('a', 'vndb(查詢類)', animeNames, 'https://vndb.org/v/all?sq=') +
                    /* ========= 外連至 2DFan 搜尋頁 =========*/
                    addEle('a', '2DFan(介紹+CG存檔+補丁)', animeNames, 'https://galge.fun/subjects/search?keyword=') +
                    /* ========= 外連至 Nyadora泛ACG中文社區(介紹) 搜尋頁 =========*/
                    addEle('a', 'Nyadora泛ACG中文社區(介紹)', animeNames, 'https://nyadora.moe/game?q=') +
                    /* ========= 外連至 CnGal(介紹) 搜尋頁 =========*/
                    addEle('a', 'CnGal(介紹)', animeNames, 'https://www.cngal.org/search?keyword=') +
                    /* ========= 外連至 萌游網(介紹) 搜尋頁 =========*/
                    addEle('a', '萌游網(介紹)', animeNames, 'https://galge.cn/search?query=') +
                    /* ========= 外連至 ggbases(下載) 搜尋頁 =========*/
                    addEle('a', 'ggbases(下載)', animeNames, 'https://www.dlgal.com/search.so?p=0&title=') +
                    /* ========= 外連至 憂鬱的弟弟(漢化硬碟版下載) 搜尋頁 =========*/
                    addEle('a', '憂鬱的弟弟(漢化硬碟下載)', animeNames, 'https://www.kkgal.com/?s=') +
                    /* ========= 外連至 天使二次元(整合版) 搜尋頁 =========*/
                    /*addEle('a', '天使二次元(屏蔽大陸/硬碟版)', animeNames,
                      'https://www.tianshie.com/search/') +*/
                    /* ========= 外連至 galgame終點-論壇 搜尋頁 =========*/
                    addEle('a', 'galgame終點-論壇(需登入)', animeNames, 'https://bbs.zdfx.net/search.php?keyword=') +
                    /* ========= 外連至 Say花火學園-論壇(整合版) 搜尋頁 =========*/
                    addEle('a', 'Say花火學園-論壇(需登入)', animeNames, 'https://www.sayhuahuo.com/?keyword=') +
                    /* ========= 外連至 喵窩(生肉備份) 搜尋頁 =========*/
                    /* addEle('a', '喵窩(生肉備份)', animeNames,
                  'https://www.nyavo.com/?s=') +
*/
                    /* ========= 外連至 sagaoz(全CG存檔)-喜歡搜尋 搜尋頁 =========*/
                    addEle('a', 'sagaoz(全CG存檔)-喜歡搜尋', animeNames, 'https://readmorejoy.com/search/?who=ddk&start=0&key=', '+site%3Awww.sagaoz.net') +
                    /* ========= 外連至 sagaoz(全CG存檔)-Yandex搜尋頁 =========*/
                    addEle('a', 'sagaoz(全CG存檔)-Yandex搜尋', animeNames, 'https://yandex.com/search/?text=', '+site%3Awww.sagaoz.net&lr=10393&clid=1836588') +
                    /* ========= 外連至 sagaoz(全CG存檔)-searx搜尋頁 =========*/
                    addEle('a', 'sagaoz(全CG存檔)-searx搜尋', animeNames, 'https://searx.be/search?q=', ' site%3Awww.sagaoz.net') +
                    /* ========= 外連至 cty-net(全CG存檔)-MetaGer搜尋頁 =========*/
                    addEle('a', 'sagaoz(全CG存檔)-MetaGer搜尋', animeNames, 'https://metager.de/meta/meta.ger3?eingabe=', '+site%3Awww.sagaoz.net&submit-query=&focus=web&s=&f=&ff=&ft=&m=') +
                    /* ========= 外連至 cty-net(攻略) 搜尋頁 =========*/
                    addEle('a', 'cty-net(攻略)', animeNames, 'http://www.cty-net.ne.jp/~m7686438/database.cgi?key=') + '</p>')
                /* ================ 外連至【galgame類】網站End ================*/
                /* ================ 外連至【輕小說類】網站Start ================*/
            $(ele).append('<p>' + '<label>' + '<input type="checkbox" name="Novel" class="btDownload Novel" value="輕小說類">' + '輕小說類: ' + '</label>' +
                /* ========= 外連至 ESJ Zone 搜尋頁 =========*/
                addEle('a', 'ESJ Zone(線上+下載)', animeNames, 'https://www.esjzone.cc/tags/', '/') +
                /* ========= 外連至 輕之國度-論壇 搜尋頁 =========*/
                addEle('a', '輕之國度-論壇(需登入/線上+下載)', animeNames, 'https://obsolete.lightnovel.us/search.php?keyword=') +
                /* ========= 外連至 真白萌Web小鎮-論壇 搜尋頁 =========*/
                addEle('a', '真白萌Web小鎮-論壇(需登入/線上+下載)', animeNames, 'https://masiro.moe/search.php?keyword=') +
                /* ========= 外連至 輕之文庫輕小說 搜尋頁 =========*/
                addEle('a', '輕之文庫輕小說(原創)', animeNames, 'https://www.linovel.net/search/?kw=') +
                /* ========= 外連至 syosetu(小説家になろう) 搜尋頁 =========*/
                addEle('a', 'syosetu搜尋(ハーメルン)', animeNames, 'https://syosetu.org/search/?word=') +
                /* ========= 外連至 輕小說之家(小説家になろう) 搜尋頁 =========*/
                addEle('a', '輕小說之家(小説家になろう)', animeNames, 'https://yomou.syosetu.com/search.php?search_type=novel&word=') +
                /* ========= 外連至 kakuyomu(カクヨム) 搜尋頁 =========*/
                addEle('a', 'kakuyomu(カクヨム)', animeNames, 'https://kakuyomu.jp/search?q=') +
                /* ================ 外連至【輕小說類】網站End ================*/
                '</p></div>')
        })
        // 設置a標籤hover事件
    $(".toUrl").hover(function() {
        // hover時效果
        $(this).css({
            'color': 'red'
        });
    }, function() {
        //非 hover時效果
        $(this).css({
            'color': '#02A3FB'
        });
    });
    /*
      ('a','名稱',搜尋關鍵字,'url前綴','url後綴', 新增class)
     */
    function addEle(eleName, showName, parameter, urlPrefix, urlSuffix, addClass) {
        // 設置CSS字體顏色
        var fontColor = '#02A3FB';
        // 判斷eleName參數是否為不空
        if (arguments[0] || arguments[0] == null || arguments[0] == false) {
            // 判斷是否是新增a標籤
            if (typeof arguments[0] == "string" && arguments[0] == 'a') {
                // 如果填寫名稱,進入判斷
                if (arguments[1]) {
                    // 判斷 搜尋關鍵字參數是否填寫,為字串參數
                    if (arguments[2] && typeof arguments[2] == "string") {
                        // 保存動畫關鍵字
                        var AnimeKey = arguments[2];
                        // 獲取最後字串
                        var AnimeKeyLast = AnimeKey.substring(AnimeKey.length - 1);
                        // 保存數值
                        var indexNum = '';; // 判斷結尾是否有,有的話刪除重新賦值
                        if (AnimeKeyLast == "。" || AnimeKeyLast == ".") {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.substring(0, AnimeKey.length - 1);
                        }
                        // 判斷關鍵字是否有。,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '。') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/。/g, " ");
                        }
                        // 判斷關鍵字是否有、,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '、') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/、/g, " ");
                        }
                        // 判斷關鍵字是否有!,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '!') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/!/g, " ");
                        }
                        // 判斷關鍵字是否有！,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '！') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/！/g, " ");
                        }
                        // 判斷關鍵字是否有・中間.,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '・') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/・/g, " ");
                            // AnimeKey =  AnimeKey.substring(0, AnimeKey.indexOf('・'));;
                        }
                        // 判斷關鍵字是否有？,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '？') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/？/g, " ");
                        }
                        // 判斷關鍵字是否有?,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '?') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\?/g, " ");
                        }
                        // 判斷關鍵字是否有，,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '，') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\，/g, " ");
                        }
                        // 判斷關鍵字是否有：,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '：') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\：/g, " ");
                        }
                        // 判斷關鍵字是否有～,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '～') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\～/g, " ");
                        }
                        // 判斷關鍵字是否有◆,有的話刪除重新賦值
                        /* if (getCharCount(AnimeKey, '◆') != 0) {
                           // 刪除。重新賦值
                           AnimeKey = AnimeKey.replace(/\◆/g," ");
                         }*/
                        // 判斷關鍵字是否有超劇場版：,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '超劇場版') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/超劇場版/g, "");
                        }
                        // 判斷關鍵字是否有劇場版：,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '劇場版') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/劇場版/g, "");
                        }
                        // 判斷關鍵字是否有第一章......,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '第') != 0 && getCharCount(AnimeKey, '章') != 0) {
                            // 獲取字串截取索引
                            indexNum = AnimeKey.indexOf('第');
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判斷關鍵字是否有前編,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '前編') != 0) {
                            // 獲取字串截取索引
                            indexNum = AnimeKey.indexOf('前編');
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判斷關鍵字是否有後編,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '後編') != 0) {
                            // 獲取字串截取索引
                            indexNum = AnimeKey.indexOf('後編');
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判斷關鍵字是否有特別編,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '特別編') != 0) {
                            // 獲取字串截取索引
                            indexNum = AnimeKey.indexOf('特別編');
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.substring(0, indexNum);
                        }
                        // 判斷關鍵字是否有特別編,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '特別篇') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/特別篇/g, " ");
                        }
                        // 判斷關鍵字是否有（,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '（') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/（/g, " ");
                        }
                        // 判斷關鍵字是否有）,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '）') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/）/g, " ");
                        }
                        // 判斷關鍵字是否有(有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '(') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\(/g, " ");
                        }
                        // 判斷關鍵字是否有),有的話刪除重新賦值
                        if (getCharCount(AnimeKey, ')') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\)/g, " ");
                        }
                        // 判斷關鍵字是否有-,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '-') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\-/g, " ");
                        }
                        // 判斷關鍵字是否有:,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, ':') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\:/g, " ");
                        }
                        // 判斷關鍵字是否有短編,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '短編') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/短編/g, " ");
                        }
                        // 判斷關鍵字是否有＊,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '＊') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/＊/g, " ");
                        }
                        // 判斷關鍵字是否有＝,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '＝') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\＝/g, " ");
                        }
                        // 判斷關鍵字是否有+,有的話刪除重新賦值
                        if (getCharCount(AnimeKey, '+') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\+/g, " ");
                        }
                        // 判斷關鍵字是否有……,有的話刪除重新賦值,比如「小さな蕾のその奥に……」
                        if (AnimeKey.charAt('……') != -1) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace('…', ' ');
                        }
                        // 判斷關鍵字是否有-,有的話刪除重新賦值,比如「アンスイート－寝取られ堕ちた女たち－」
                        if (getCharCount(AnimeKey, '－') != 0) {
                            // 刪除。重新賦值
                            AnimeKey = AnimeKey.replace(/\－/g, " ");
                        }
                        // 判斷關鍵字是否有ちょ〜短編,有的話刪除重新賦值
                        /*if (getCharCount(AnimeKey, 'ちょ〜短編') != 0) {
                          // 刪除。重新賦值
                          AnimeKey = AnimeKey.replace(/\ちょ〜短編/g," ");
                        }*/
                        // 判斷是否填寫url前綴
                        if (arguments[3]) {
                            // 判斷是否填寫url後綴
                            if (arguments[4]) {
                                if (arguments[4] == 1 && arguments[5]) {
                                    return '' + ' <a target="_blank" href="' +
                                        /* 以下新增連結 */
                                        arguments[3] + AnimeKey + '" class="toUrl ' +
                                        /* 以下新增class */
                                        arguments[5] +
                                        /* 以下新增樣式 */
                                        '" style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                                }
                                return '' + ' <a class="toUrl" target="_blank" href="' +
                                    /* 以下新增連結 */
                                    arguments[3] + AnimeKey + arguments[4] + '" ' +
                                    /* 以下新增樣式 */
                                    'style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                            } else {
                                return '<a class="toUrl" target="_blank" href="' +
                                    /* 以下新增連結 */
                                    arguments[3] + AnimeKey + '" ' +
                                    /* 以下新增樣式 */
                                    'style="' + 'color: ' + fontColor + ';' + 'font-weight: bold;' + '">' + arguments[1] + '</a><span> | </span>';
                            }
                        }
                    }
                }
            }
        }
        return '請填寫參數';
    }
    // 判斷字串出現次數
    function getCharCount(str, char) {
        var result = (str.split(char)).length - 1;
        var count = !result ? 0 : result.length;
        return count;
    }
    // 獲取傳入url參數[得到url參數]為對象
    function getQueryArgs(url) {
        var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
            //保存每一項
            args = {},
            //得到每一項
            items = qs.length ? qs.split('&') : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split('='),
                name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }
    // 點擊動畫年鑑 跳轉
    $('.AnimeYearbooks').on("click", function(event) {
            // 阻止a標籤跳轉
            event.preventDefault();
            // 獲取目前url值
            var getHrefValue = $(this).attr('href');
            // 轉化對象,重新賦值
            newObj = getQueryArgs(getHrefValue);
            // 創建變數保存跳轉url
            var toUrlStr = 'https://animeannals.xido.workers.dev/0:/';
            // 獲取年
            var animeYear = newObj['animeYear'];
            // 獲取月
            var animeMonth = newObj['animeMonth'];
            // 獲取日
            var animeDay = newObj['animeDay'];
            // 判斷月,如果是01-09,去掉前面0,10,11,12保持原樣
            animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
            // 判斷是否有月
            var animeMonthFlag = false;
            // 保存月的範圍
            var yearStr = '';
            if (animeMonth <= 3) {
                animeMonthFlag = true;
                // 賦值
                yearStr = '1-3月';
            } else if (animeMonth <= 6) {
                animeMonthFlag = true;
                // 賦值
                yearStr = '4-6月';
            } else if (animeMonth <= 9) {
                animeMonthFlag = true;
                // 賦值
                yearStr = '7-9月';
            } else if (animeMonth <= 12) {
                animeMonthFlag = true;
                // 賦值
                yearStr = '10-12月';
            }
            // 如果有月的話
            if (animeMonthFlag) {
                // toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
                toUrlStr += animeYear + '/' + animeYear + '年' + yearStr + '/';
            } else {
                // toUrlStr += animeYear + '/';
                toUrlStr += animeYear + '/';
            }
            // 跳轉頁面
            window.open(toUrlStr, "_blank");
        })
        // 點擊動畫城TV頁 跳轉
    $('.cartoonCityTV').on("click", function(event) {
            // 阻止a標籤跳轉
            event.preventDefault();
            // 獲取目前url值
            var getHrefValue = $(this).attr('href');
            // 轉化對象,重新賦值
            newObj = getQueryArgs(getHrefValue);
            // 創建變數保存跳轉url
            var toUrlStr = 'https://misty-lake-695d.animedi2.workers.dev/0:/TV%E5%8B%95%E7%95%AB/';
            // 獲取年
            var animeYear = newObj['animeYear'];
            // 獲取月
            var animeMonth = newObj['animeMonth'];
            // 獲取日
            var animeDay = newObj['animeDay'];
            // 如果大於1999年,進入判斷
            if (animeYear > 1999) {
                // 判斷月,如果是01-09,去掉前面0,10,11,12保持原樣
                animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
                // 判斷是否有月
                var animeMonthFlag = false;
                // 保存月的範圍
                var yearStr = '';
                if (animeMonth <= 3) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '1~3月';
                } else if (animeMonth <= 6) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '4~6月';
                } else if (animeMonth <= 9) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '7~9月';
                } else if (animeMonth <= 12) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '10~12月';
                }
                // 如果有月的話
                if (animeMonthFlag) {
                    toUrlStr += animeYear + '/' + yearStr + '/';
                } else {
                    // toUrlStr += animeYear + '/';
                    toUrlStr += animeYear + '/';
                }
            } else {
                toUrlStr += '/1999或之前/';
            }
            // 跳轉頁面
            window.open(toUrlStr, "_blank");
        })
        // 點擊動畫城劇場版頁 跳轉
    $('.cartoonCityTheaterVersion').on("click", function(event) {
            // 阻止a標籤跳轉
            event.preventDefault();
            // 獲取目前url值
            var getHrefValue = $(this).attr('href');
            // 轉化對象,重新賦值
            newObj = getQueryArgs(getHrefValue);
            // 創建變數保存跳轉url
            var toUrlStr = 'https://misty-lake-695d.animedi2.workers.dev/0:/劇場版/';
            // 獲取年
            var animeYear = newObj['animeYear'];
            // 獲取月
            var animeMonth = newObj['animeMonth'];
            // 獲取日
            var animeDay = newObj['animeDay'];
            // 如果大於1999年,進入判斷
            if (animeYear > 1999) {
                // 判斷月,如果是01-09,去掉前面0,10,11,12保持原樣
                animeMonth = animeMonth[0] == 0 ? animeMonth[1] : animeMonth;
                // 判斷是否有月
                var animeMonthFlag = false;
                // 保存月的範圍
                var yearStr = '';
                if (animeMonth <= 3) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '1~3月';
                } else if (animeMonth <= 6) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '4~6月';
                } else if (animeMonth <= 9) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '7~9月';
                } else if (animeMonth <= 12) {
                    animeMonthFlag = true;
                    // 賦值
                    yearStr = '10~12月';
                }
                // 如果有月的話
                if (animeMonthFlag) {
                    toUrlStr += animeYear + '/' + yearStr + '/';
                } else {
                    // toUrlStr += animeYear + '/';
                    toUrlStr += animeYear + '/';
                }
            } else {
                toUrlStr += '/1999或之前/';
            }
            // 跳轉頁面
            window.open(toUrlStr, "_blank");
        })
        // 點擊sub_share字幕共享計劃 跳轉
    $('.AnimeSubShare').on("click", function(event) {
            // 阻止a標籤跳轉
            event.preventDefault();
            // 獲取目前url值
            var getHrefValue = $(this).attr('href');
            // 聲明變數
            var newObj = null;
            // 轉化對象,重新賦值
            newObj = getQueryArgs(getHrefValue);
            // 創建變數保存跳轉url
            var toUrlStr = '';
            // 獲取年
            var animeYear = newObj['animeYear'];
            // 賦值
            toUrlStr = 'https://github.com/foxofice/sub_share/tree/master/subs_list/animation/' + animeYear;
            // 跳轉頁面
            window.open(toUrlStr, "_blank");
        })
        /* ===================  國內查詢 Start =================== */
        // 循環遍歷
    $('input[name="domesticSearch"]').each(function(index, ele) {
            // 更改邊距
            $(this).css({
                    'margin': '5px 3px 5px 0'
                })
                // 判斷是否勾選
            var ischeck = $(this).attr("checked");
            // 判斷是否勾選,隱藏/顯示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // 國外查詢 點擊複選框
    $('input[name="domesticSearch"]').click(function() {
        // 判斷是否勾選
        var ischeck = $(this).attr("checked");
        // 判斷是否勾選,隱藏/顯示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  國內查詢 End =================== */
/* ===================  國外查詢 Start =================== */
// 循環遍歷
$('input[name="abroadSearch"]').each(function(index, ele) {
    // 更改邊距
    $(this).css({
        'margin': '5px 3px 5px 0'});
    $(this).prop('checked', false);
    // 默认不勾选，隐藏链接
    $(this).parent().parent().find('a').hide();
    $(this).parent().parent().find('span').hide();
})

// 國外查詢 點擊複選框
$('input[name="abroadSearch"]').click(function() {
    // 判断当前是否勾选（使用 prop 而不是 attr）
    var isChecked = $(this).prop('checked');
    if (isChecked) {
        $(this).parent().parent().find('a').show();
        $(this).parent().parent().find('span').show();
    } else {
        $(this).parent().parent().find('a').hide();
        $(this).parent().parent().find('span').hide();
    }
});
/* ===================  國外查詢 End =================== */
    /* ===================  BT下載 Start =================== */
    // 循環遍歷
    $('.btDownload').each(function(index, ele) {
            // 更改邊距
            $(this).css({
                    'margin': '5px 3px 5px 0'
                })
                // 判斷是否勾選
            var ischeck = $(this).attr("checked");
            // 判斷是否勾選,隱藏/顯示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // BT下載 點擊複選框
    $('.btDownload').click(function() {
        // 判斷是否勾選
        var ischeck = $(this).attr("checked");
        // 判斷是否勾選,隱藏/顯示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  BT下載 End =================== */
    /* ===================  緋月論壇 Start =================== */
    // 循環遍歷
    $('.bbsDownload').each(function(index, ele) {
            // 更改邊距
            $(this).css({
                    'margin': '5px 3px 5px 0'
                })
                // 判斷是否勾選
            var ischeck = $(this).attr("checked");
            // 判斷是否勾選,隱藏/顯示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // 緋月論壇 點擊複選框
    $('.bbsDownload').click(function() {
        // 判斷是否勾選
        var ischeck = $(this).attr("checked");
        // 判斷是否勾選,隱藏/顯示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  緋月論壇 End =================== */
    /* ===================  國外查詢 Start =================== */
    // 循環遍歷
    $('input[name="subDownload"]').each(function(index, ele) {
            // 更改邊距
            $(this).css({
                    'margin': '5px 3px 5px 0'
                })
                // 判斷是否勾選
            var ischeck = $(this).attr("checked");
            // 判斷是否勾選,隱藏/顯示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // 國外查詢 點擊複選框
    $('input[name="subDownload"]').click(function() {
        // 判斷是否勾選
        var ischeck = $(this).attr("checked");
        // 判斷是否勾選,隱藏/顯示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  國外查詢 End =================== */
    /* ===================  線上播放 Start =================== */
    // 循環遍歷
    $('.watchOnline').each(function(index, ele) {
            // 更改邊距
            $(this).css({
                    'margin': '5px 3px 5px 0'
                })
                // 判斷是否勾選
            var ischeck = $(this).attr("checked");
            // 判斷是否勾選,隱藏/顯示
            if (!ischeck) {
                $(this).parent().parent().find('a').hide();
                $(this).parent().parent().find('span').hide();
            } else {
                $(this).parent().parent().find('a').show();
                $(this).parent().parent().find('span').show();
            }
        })
        // 線上播放 點擊複選框
    $('.watchOnline').click(function() {
        // 判斷是否勾選
        var ischeck = $(this).attr("checked");
        // 判斷是否勾選,隱藏/顯示
        if (ischeck) {
            $(this).parent().parent().find('a').hide();
            $(this).parent().parent().find('span').hide();
            $(this).removeAttr('checked');
        } else {
            $(this).parent().parent().find('a').show();
            $(this).parent().parent().find('span').show();
            $(this).attr('checked', true);
        }
    });
    /* ===================  線上播放 End =================== */
    /* ===================  新增一鍵跳轉按鈕 Start =================== */
    // 新增【一鍵批次打開】按鈕
    $('#browserTools').append('<button id="btnClass" class="btnClass">一鍵批次打開</botton>');
    // 新增【一鍵定位(按搜尋名)】按鈕
    $('#browserTools').append('<button id="locationBtn" class="btnClass">一鍵定位(按搜尋名)</botton>');
    // $('#browserTools').append('<button id="locationBtn" class="btnClass">一鍵正序排序</botton>');
    // 獲取標籤數
    var labelSum = document.querySelectorAll('#userTagList li').length;
    // 獲取目前列表總數
    var items = document.querySelectorAll('li.item').length;
    // 判斷目前是否列表頁,是的話新增刷新按鈕
    if (items > 0) {
        // 判斷如果有標籤,說明是收藏頁
        if (labelSum > 0) {
            // 【展開全部標籤】
            $('#userTagList li').show();
            $('#expandTags').remove();
            // 頭部新增【點擊重設(目前列表共0條)】按鈕
            $('#browserTools').append('<button index="1" class="btnClass fixedLeft">點擊重設(目前列表共' + items + '條 / 標籤數共' + labelSum + '條)</botton>');
            // 頁面左下角新增【點擊重設(目前列表共0條)】按鈕
            $('body').append('<button id="getListLength" index="1" class="btnClass fixedLeft fixedLeft1">點擊重設(目前列表共' + items + '條 / 標籤數共' + labelSum + '條)</botton>');
        } else {
            // 頭部新增【點擊重設(目前列表共0條)】按鈕
            $('#browserTools').append('<button index="0" class="btnClass fixedLeft">點擊重設(目前列表共' + items + '條)</botton>');
            // 頁面左下角新增【點擊重設(目前列表共0條)】按鈕
            $('body').append('<button id="getListLength" index="0" class="btnClass fixedLeft fixedLeft1">點擊重設(目前列表共' + items + '條)</botton>');
        }
    }
    // 設置樣式
    $('.btnClass').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "border": "1px solid transparent",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "0 15px",
        "font-size": "14px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        // "background-color": "#FF5A44",
        "background-color": "#F09199",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)"
    });
    $('.fixedLeft1').css({
            "position": "fixed",
            "bottom": "0",
            "z-index": "999",
            "left": "0"
        })
        // 設置按鈕hover事件
    $('.btnClass').hover(function() {
        // hover時效果
        $(this).css({
            'background': '#02A3FB',
            "border": "1px solid transparent"
        });
    }, function() {
        //非 hover時效果
        $(this).css({
            'background': '#F09199'
        });
    });
    // 保存url等資訊
    var objList = {
        toUrls: [],
        isZhKey: false,
        isJpKey: false,
        isZhIndex: [],
        isJpIndex: []
    };
    // 循環遍歷【中文辯題】連結地址
    $('.inner h3 a').each(function(index, ele) {
            // 判斷是否勾選
            var selfAEle = $(this).prop('href');
            // 新增連結
            objList.toUrls.push(selfAEle);
            // 獲取輸入框內容
            var inputBox = $('.searchInputL').val();
            // 判斷是否有搜尋結果
            var isValue = $(this).text();
            isValue = isValue.indexOf(inputBox);
            // 如果不為空,進入判斷
            if (isValue) {
                objList.isZhKey = true;
                objList.isZhIndex.push(index);
            }
        })
        // 循環遍歷【日文名】
    $('.inner h3 small').each(function(index, ele) {
            // 獲取輸入框內容
            var inputBox = $('.searchInputL').val();
            // 判斷是否有搜尋結果
            var isValue = $(this).text();
            isValue = isValue.indexOf(inputBox);
            // 如果不為空,進入判斷
            if (isValue) {
                objList.isJpKey = true;
                objList.isJpIndex.push(index);
            }
        })
        // 點擊【一鍵批次打開】
    $('#btnClass').click(function() {
        // 判斷是否使用自動讀取下一頁尾本,如果讀取了下一頁,重新循環遍歷更改值
        if (document.querySelectorAll('.inner h3 a').length != objList.toUrls.length) {
            // 初始化url等資訊
            objList = {
                toUrls: [],
                isZhKey: false,
                isJpKey: false,
                isZhIndex: [],
                isJpIndex: []
            };
            // 循環遍歷【中文辯題】連結地址
            $('.inner h3 a').each(function(index, ele) {
                // 判斷是否勾選
                var selfAEle = $(this).prop('href');
                // 新增連結
                objList.toUrls.push(selfAEle);
                // 獲取輸入框內容
                var inputBox = $('.searchInputL').val();
                // 判斷是否有搜尋結果
                var isValue = $(this).text();
                isValue = isValue.indexOf(inputBox);
                // 如果不為空,進入判斷
                if (isValue) {
                    objList.isZhKey = true;
                    objList.isZhIndex.push(index);
                }
            })
        }
        // 循環遍歷跳轉連結
        for (var i = 0; i < objList.toUrls.length; i++) {
            // 同時打開
            window.open(objList.toUrls[i], "_blank");
        }
        /*console.log(
          objList.toUrls
        );*/
    });
    // 點擊【一鍵定位(按搜尋名)】按鈕
    $('#locationBtn').click(function() {
        // $('#browserItemList li').eq(1).prependTo('#browserItemList')
        // 是否搜的中文名
        var isZhKey = objList['isZhKey'];
        // 是否搜的日文名
        var isJpKey = objList['isJpKey'];
        // 獲取搜到的中文名結果
        var isZhIndex = objList['isZhIndex'];
        // 獲取搜到的日文名結果
        var isJpIndex = objList['isJpIndex'];
        // 最終定位結果
        var retIndex = false;
        // 如果有中文結果,或者中文/日文都有結果的話
        if (isZhKey || isZhKey && isJpKey) {
            retIndex = isZhIndex;
        } else if (isJpKey) {
            retIndex = isJpIndex;
        }
        // 如果能搜到的話
        if (retIndex) {
            // 獲取元素位置
            var toLocatio = $('#browserItemList li').eq(retIndex[0]).offset().top;
            // 跳轉到搜尋的第一個結果
            $("html,body").animate({
                scrollTop: toLocatio
            }, 500);
        }
    });
    /* ===================  新增一鍵跳轉按鈕 End =================== */
    /* ===================  新增開啟至新分頁+複製標題按鈕 Start ===================
                          2020年6月18日19:03:15
                          2020年6月18日20:40:32
    */
    // 新增按鈕
    if (document.querySelectorAll('p.rateInfo').length != 0) {
        $('p.domesticClass').before('<button class="addBtn toNewUrl">開啟連結至新分頁</button>');
        //$('p.domesticClass').before('<button class="addBtn toDetailsPageAndAniDB">同時打開詳情頁/AniDB</button>');
        //$('p.domesticClass').before('<button class="addBtn toDetailsAniDBHanime1">同時打開詳情頁/AniDB/Hanime1</button>');
        //$('p.domesticClass').before('<button class="addBtn toDetailsPageAndMangaupdates">同時打開詳情頁/Baka漫畫/MAL漫畫</button>');
        $('p.domesticClass').before('<button class="addBtn copyNames">複製標題</button>');
        $('p.domesticClass').before('<button class="addBtn showHiheBtn" flag="1">顯示/隱藏列表</button>');
    } else {
        $('p.info.tip').after('<button class="addBtn showHiheBtn" flag="1">顯示/隱藏列表</button>');
        $('p.info.tip').after('<button class="addBtn copyNames">複製標題</button>');
        //$('p.domesticClass').before('<button class="addBtn toDetailsAniDBHanime1">同時打開詳情頁/AniDB/Hanime1</button>');
        //$('p.domesticClass').before('<button class="addBtn toDetailsPageAndMangaupdates">同時打開詳情頁/Baka漫畫/MAL漫畫</button>');
        //$('p.info.tip').after('<button class="addBtn toDetailsPageAndAniDB">同時打開詳情頁/AniDB</button>');
        $('p.info.tip').after('<button class="addBtn toNewUrl">開啟連結至新分頁</button>');
    }
    // 1.設置【開啟至新分頁】按鈕樣式
    $('.toNewUrl').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });
    // 2.設置同時打開詳情頁/AniDB 按鈕樣式
    $('.toDetailsPageAndAniDB').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });
    // 3.設置【複製標題】按鈕樣式
    $('.copyNames').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });
    // 4.設置【顯示/隱藏列表】按鈕樣式
    $('.showHiheBtn').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });


    // 5.同時打開詳情頁/Baka-Updates漫畫
    $('.toDetailsPageAndMangaupdates').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });

    // 6.同時打開詳情頁/AniDB/Hanime1
    $('.toDetailsAniDBHanime1').css({
        "margin": "5px",
        "color": "#fff",
        "line-height": "1.499",
        "position": "relative",
        "display": "inline-block",
        "font-weight": "400",
        "white-space": "nowrap",
        "text-align": "center",
        "background-image": "none",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
        "cursor": "pointer",
        "-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-ms-touch-action": "manipulation",
        "touch-action": "manipulation",
        "height": "32px",
        "padding": "5px",
        "font-size": "12px",
        "border-radius": "4px",
        "background-color": "#fff",
        "border-color": "#d9d9d9",
        "background-color": "#4EB1D4",
        "border-color": "#FF5A44",
        "text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
        "-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
        "border": "1px solid transparent"
    });

    // 1.點擊【新標籤跳轉】按鈕,觸發點擊事件
    $('.toNewUrl').click(function() {
        // 獲取目前列表a標籤連結
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
        // 開啟至新分頁
        window.open(selfUrl, "_blank");
    });
    // 設置【新標籤跳轉】按鈕hover事件
    $('.toNewUrl').hover(function() {
        // hover時效果
        // 新增點擊透明度更改,有點擊效果
        $(this).css({
            'opacity': '0.5'
        })
    }, function() {
        //非 hover時效果
        $(this).css({
            'opacity': '1'
        });
    });
    // 2點擊【複製標題】按鈕,觸發點擊事件
    // 2點擊【複製標題】按鈕,觸發點擊事件
    $('.copyNames').click(function() {
        // 獲取中文名
        var zhAnimeNames = $(this).parent().parent().find('h3 a').text();
        // 獲取日文名
        var jpAnimeNames = $(this).parent().parent().find('h3 small').text();
        // 聲明日期變數,去除空格
        var animeDate = $(this).parent().parent().find('p:eq(0)').text().replace(/\s+/g, "");
        // 聲明日期變數,不去除空格
        var animeDate2 = $(this).parent().parent().find('p:eq(0)').text();
        // 判斷是否已登入/收藏狀態
        if (animeDate == "修改|刪除") {
            // 重新賦值
            animeDate = $(this).parent().parent().find('p:eq(1)').text().replace(/\s+/g, "");
            animeDate2 = $(this).parent().parent().find('p:eq(1)').text();
        }
        // 最終複製結果
        var ret = '';
        // 如果有話的話,說明是標籤頁
        if (animeDate.indexOf('話') != -1) {
            // 去掉話數,方便後期複製
            animeDate = '';
        }
        // 如果搜尋頁沒有第二個日文名,預設為空
        if (!jpAnimeNames) {
            // 最終複製結果
            ret = zhAnimeNames + ' ' + getListDate(animeDate);
        } else {
            // 最終複製結果
            ret = zhAnimeNames + '[' + jpAnimeNames + '] ' + getListDate(animeDate);
        }
        // 判斷是否目前頁面時標籤頁,是否包含/anime/
        if (window.location.pathname.indexOf('/anime/') != -1) {
            // 聲明遍歷保存日期索引
            var getDataIndex = '';
            // 保存集數名
            var animeEpSum = '';
            // 判斷是否有總集數,有的話進入判斷
            if (animeDate2.indexOf(' / ') != -1 && animeDate2.indexOf('話') != -1) {
                // 獲取新的
                getDataIndex = animeDate2.substr(animeDate2.indexOf(' / ') + 3, animeDate2.length - 1)
                    // 截取總集數
                animeEpSum = animeDate2.substr(0, animeDate2.indexOf('話')).replace(/\s+/g, "");
                // 拼接結果
                ret += ' ' + getListDate(getDataIndex.replace(/\s+/g, "")) + ' 共' + animeEpSum + '集';
            }
        }
        // 複製結果
        copyFn('#search_text', ret);
    });
    // 設置【複製標題】按鈕hover事件
    $('.copyNames').hover(function() {
        // hover時效果
        // 新增點擊透明度更改,有點擊效果
        $(this).css({
            'opacity': '0.5'
        })
    }, function() {
        //非 hover時效果
        $(this).css({
            'opacity': '1'
        });
    });
    // 3.點擊【同時打開詳情頁/AniDB 按鈕樣式】按鈕,觸發點擊事件
    $('.toDetailsPageAndAniDB').click(function() {
        // 獲取目前列表a標籤連結
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
        // 開啟至新分頁
        // window.open(selfUrl, "_blank");
        window.open(selfUrl + '?keyword=MAL', "_blank");

        // 獲取AniDB的位置索引正確
        var AniDBIndex = 0;
        $(this).parent().parent().find('p').each(function(index, ele) {
                // 判斷索引
                if ($(this).find('a:eq(0)').html() == "AniDB") {
                    AniDBIndex = index;
                }
            })
            // 獲取目前AniDB的a標籤連結
        var selftoAniDBUrl = $(this).parent().parent().find('p:eq(' + AniDBIndex + ') a:eq(0)').prop('href');
        // 開啟至新分頁
        window.open(selftoAniDBUrl, "_blank");
    });
    // 設置【同時打開詳情頁/AniDB 按鈕樣式】按鈕hover事件
    $('.toDetailsPageAndAniDB').hover(function() {
        // hover時效果
        // 新增點擊透明度更改,有點擊效果
        $(this).css({
            'opacity': '0.5'
        })
    }, function() {
        //非 hover時效果
        $(this).css({
            'opacity': '1'
        });
    });
    // 4.點擊【顯示/隱藏列表】按鈕
    $('.showHiheBtn').click(function() {
        // 獲取目前列表p標籤
        var selfUrl = $(this).parent().parent().find('p');
        // 獲取目前按鈕屬性
        var flag = $(this).attr('flag');
        // 如果是1,說明預設顯示,點擊隱藏,否則的話顯示
        if (flag == 1) {
            $(this).attr('flag', 0);
            for (var i = 1; i < selfUrl.length; i++) {
                // 判斷是否是評分P標籤,是的話跳過
                if (!selfUrl.eq(i).hasClass("rateInfo") && !selfUrl.eq(i).hasClass("collectInfo") && !selfUrl.eq(i).hasClass("tools") && !selfUrl.eq(i).hasClass("tip")) {
                    selfUrl.eq(i).hide();
                }
            }
        } else {
            $(this).attr('flag', 1);
            for (var i = 1; i < selfUrl.length; i++) {
                // 判斷是否是評分P標籤,是的話跳過
                if (!selfUrl.eq(i).hasClass("rateInfo") && !selfUrl.eq(i).hasClass("collectInfo") && !selfUrl.eq(i).hasClass("tip")) {
                    selfUrl.eq(i).show();
                }
            }
        }
    });
    // 預設隱藏
    $('.showHiheBtn').click();

    // 4.設置【顯示/隱藏列表】按鈕hover事件
    $('.showHiheBtn').hover(function() {
        // hover時效果
        // 新增點擊透明度更改,有點擊效果
        $(this).css({
            'opacity': '0.5'
        })
    }, function() {
        //非 hover時效果
        $(this).css({
            'opacity': '1'
        });
    });


     // 5.同時打開詳情頁/Baka-Updates漫畫/MAL漫畫
     $('.toDetailsPageAndMangaupdates').click(function() {
        // 獲取目前列表a標籤連結
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');

        // 獲取目前日文名
        var animeJPName = $(this).parent().parent().find('.grey').html() != null ? $(this).parent().parent().find('.grey').html() :$(this).parent().parent().find("h3 > a").text();

        // 跳轉MAL漫畫搜尋頁
        var toMALUrl = "https://myanimelist.net/manga.php?q=" + animeJPName+ "&cat=manga";

        // 獲取Baka-Updates的位置索引正確
        var BakaUpdatesIndex = 0;

        // 獲取MAL(全部搜)
        var malAllIndex = 0;

        // 循環遍歷
        $(this).parent().parent().find('p').each(function(index, ele) {
                // 判斷索引
                if ($(this).find('a:eq(0)').html() == "Baka-Updates Manga(查詢漫畫情報)") {
                    BakaUpdatesIndex = index;
                }
            })
        // 獲取目前Baka-Updates的a標籤連結
        var selftoBakaUpdatesUrl = $(this).parent().parent().find('p:eq(' + BakaUpdatesIndex + ') a:eq(0)').prop('href');
         // var selftoBakaUpdatesUrl = $(this).parent().parent().find('p:eq(' + BakaUpdatesIndex + ') a:eq(1)').prop('href');

        // 開啟至新分頁
        window.open(selfUrl, "_blank");
        window.open(selftoBakaUpdatesUrl, "_blank");
        window.open(toMALUrl, "_blank");
    });

    // 5.同時打開詳情頁/Baka-Updates漫畫按鈕hover事件
        $('.toDetailsPageAndMangaupdates').hover(function() {
            // hover時效果
            // 新增點擊透明度更改,有點擊效果
            $(this).css({
                'opacity': '0.5'
            })
        }, function() {
            //非 hover時效果
            $(this).css({
                'opacity': '1'
            });
        });

    // 6.同時打開詳情頁/AniDB/Hanime1
     $('.toDetailsAniDBHanime1').click(function() {
        // 獲取目前列表a標籤連結
        var selfUrl = $(this).parent().parent().find('h3 a').prop('href');


        // 獲取AniDB的位置索引正確
        var AniDBIndex = 0;

        // 獲取Hanime1的位置索引正確
        var Hanime1Index = 0;


        // 循環遍歷索引
        $(this).parent().parent().find('p').each(function(index, ele) {
                // 判斷AniDB索引
                if ($(this).find('a:eq(0)').html() == "AniDB") {
                    AniDBIndex = index;
                }

                 // 判斷AniDB索引
                if ($(this).find('a:eq(0)').html() == "Small color分享手沖快樂(少/html5播放)") {
                    Hanime1Index = index;
                }

            })


        // 獲取目前AniDB的a標籤連結
        var selftoAniDBUrl = $(this).parent().parent().find('p:eq(' + AniDBIndex + ') a:eq(0)').prop('href');

        // 獲取目前Hanime1的a標籤連結
        var selftoHanime1Url = $(this).parent().parent().find('p:eq(' + Hanime1Index + ') a:eq(3)').prop('href');


        // 開啟至新分頁
        window.open(selfUrl, "_blank");
        window.open(selftoAniDBUrl, "_blank");
        window.open(selftoHanime1Url, "_blank");
    });

        // 6.同時打開詳情頁/AniDB/Hanime1按鈕hover事件
         $('.toDetailsAniDBHanime1').hover(function() {
            // hover時效果
            // 新增點擊透明度更改,有點擊效果
            $(this).css({
                'opacity': '0.5'
            })
        }, function() {
            //非 hover時效果
            $(this).css({
                'opacity': '1'
            });
        });

    // 點擊【點擊重設(目前列表共0條)】按鈕
    $('.fixedLeft').click(function() {
        // 獲取按鈕列表
        var fixedLeft = document.querySelectorAll('.fixedLeft');
        // 判斷是否是收藏頁還是搜尋頁
        if ($(this).attr('index') == 1) {
            // 獲取標籤頁數量
            var labelSum = document.querySelectorAll('#userTagList li').length;
            // 循環遍歷
            for (var i = 0; i < fixedLeft.length; i++) {
                fixedLeft[i].innerText = '點擊重設(目前列表共' + document.querySelectorAll('li.item').length + '條 / 標籤數共' + labelSum + '條)';
            }
        } else {
            // 循環遍歷
            for (var i = 0; i < fixedLeft.length; i++) {
                fixedLeft[i].innerText = '點擊重設(目前列表共' + document.querySelectorAll('li.item').length + '條)';
            }
        }
    });


    /* ========================================================== */
    // 封裝複製函數
    function copyFn(ele, copyText) {
        // 更改input內容
        $(ele).val(copyText)
            // 全選輸入框內容
        $(ele).select();
        // 執行瀏覽器自帶的複製
        document.execCommand("Copy");
        // 清空輸入框內容
        $(ele).val('')
    }
    /*
       封裝函數獲取年/月/日 格式日期,並更改年月日格式

       2020年6月21日21:51:15完美封裝

       2020年7月4日13:28:38 更改2015格式並新增年

       2020年8月13日20:55:43 新增"2020-10"和"2020-3"格式判斷

       2020年8月17日22:58:51 新增1986.10.15 / 1986.10.5 / 1986.1.15 / 1986.1.3 格式判斷

      2022年2月16日20:48:37 新增"1917年4月"格式判斷
      */
    function getListDate(value, isGetYearValue) {
        // 獲取傳的值
        var str = value;
        // 創建新字串保存
        var ret = "";
        // 創建最終返回字串
        var retStr = "";
        // 循環去除空格
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) != " ") {
                ret += str[i];
            }
        }
        // 分類
        var str1 = "";
        var str2 = "";
        var str3 = "";
        var str4 = "";
        var index = 0;
        var dateType = 0;
        // 如果有年月日格式
        if (ret.indexOf('年') != -1 && ret.indexOf('月') == -1 & ret.indexOf('日') == -1) {
            dateType = 1;
            index = ret.indexOf('年');
        } else if (ret.indexOf('月') != -1 && ret.indexOf('日') == -1) {
            dateType = 2;
            index = ret.indexOf('月');
        } else if (ret.indexOf('年') != -1 && ret.indexOf('月') != -1 && ret.indexOf('日') != -1) {
            dateType = 3;
            index = ret.indexOf('日');
        } else if ((/^\+?[0-9][0-9]*$/).test(ret)) { // 判斷是否為2015這樣的格式
            dateType = 6;
            index = ret + '年';
        }
        // 判斷是否有春/夏/秋/冬
        if (ret.indexOf('春') != -1) {
            dateType = 4;
            index = ret.indexOf('春');
        } else if (ret.indexOf('夏') != -1) {
            dateType = 4;
            index = ret.indexOf('夏');
        } else if (ret.indexOf('秋') != -1) {
            dateType = 4;
            index = ret.indexOf('秋');
        } else if (ret.indexOf('冬') != -1) {
            dateType = 4;
            index = ret.indexOf('冬');
        }
        // 判斷是否為年/月/日格式
        // 判斷年月日格式
        if (ret.substring(4, 5) == '-' && ret.substring(7, 8) == '-' || ret.substring(4, 5) == '/' && ret.substring(7, 8) == '/' || ret.substring(4, 5) == '-') {
            // 賦值類型是/或-
            dateType = 5;
            // 判斷2020-02-28和2020/02/28/*
            // 判斷2020-02-2和2020/02/2/*
            if (ret.substring(8, 10).indexOf('/') == -1 && ret.substring(8, 10).length == 2) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月" + ret.substring(8, 10) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.substring(8, 10).length == 1) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月0" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == 1 && ret.substring(8, 10).length == 2) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月0" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == 1 && ret.substring(8, 10).length == 3) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月" + ret.substring(8, 9) + "日";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.length == 7) {
                str3 = ret.substring(0, 4) + "年" + ret.substring(5, 7) + "月";
            } else if (ret.substring(8, 10).indexOf('/') == -1 && ret.length == 6) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 7) + "月";
            }
        } else if (ret.substring(4, 5) == '-' && ret.substring(6, 7) == '-' || ret.substring(4, 5) == '/' && ret.substring(6, 7) == '/') {
            // 賦值類型是/或-
            dateType = 5;
            // 判斷2020-2-28和2020/2/28/*
            // 判斷2020-2-2和2020/2/2/*
            if (ret.substring(7, 9).indexOf('/') == -1 && ret.substring(7, 9).length == 2) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月" + ret.substring(7, 9) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == -1 && ret.substring(7, 9).length == 1) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月0" + ret.substring(7, 9) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == 1 && ret.substring(7, 9).length == 2) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月0" + ret.substring(7, 8) + "日";
            } else if (ret.substring(7, 9).indexOf('/') == 1 && ret.substring(7, 9).length == 3) {
                str3 = ret.substring(0, 4) + "年0" + ret.substring(5, 6) + "月" + ret.substring(7, 9) + "日";
            }
        } else if (ret.substring(4, 5) == '.') {
            // 賦值類型是/或-
            dateType = 7;
            // 判斷1986.10.15和1986.10.15/*
            if (ret.substring(7, 8) == '.') {
                if (ret.substring(8, 10).length == 2) {
                    if (myIsNaN(ret[9] - 1)) {
                        str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月' + ret.substring(8, 10) + '日';
                    } else {
                        str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月0' + ret.substring(8, 9) + '日';
                    }
                } else if (ret.substring(8, 10).length == 1) {
                    str4 = ret.substring(0, 4) + '年' + ret.substring(5, 7) + '月0' + ret.substring(8, 9) + '日';
                }
            } else if (ret[6] == '.') {
                // 判斷1986.1.15格式
                if (ret.substring(7, 9).length == 2) {
                    if (myIsNaN(ret[8] - 1)) {
                        str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月' + ret.substring(7, 9) + '日';
                    } else {
                        str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月0' + ret.substring(7, 8) + '日';
                    }
                } else if (ret.substring(7, 9).length == 1) {
                    str4 = ret.substring(0, 4) + '年0' + ret.substring(5, 6) + '月0' + ret.substring(7, 8) + '日';
                }
            }
        }
        // 最後判斷,並賦值
        if (dateType == 1) {
            if (ret.indexOf('年') == ret.length - 1 || ret.substring(index + 1, index + 2) == '/' || ret.substring(ret.length, ret.length + 1) == '') {
                retStr = ret.substring(0, index + 1);
            }
        } else if (dateType == 2) {
           if (ret.indexOf('月') == ret.length - 1 || ret.substring(index + 1, index + 2) == '/' || ret.substring(ret.length, ret.length + 1) == '') {
            // 判斷是否1917年4月格式
            if (ret.indexOf('日') === -1) {
                // 如果月數大於0,進入判斷
                if (ret.slice(3, 4) > 0) {
                 retStr =    ret.slice(0, 5) + '0' + ret.slice(3, 4) + '月';
                }
            } else {
              retStr = ret.substring(0, index + 1);
            }
        }
        } else if (dateType == 3) {
            // 判斷格式
            if (ret.substr(4, 1) == '年' && ret.substr(7, 1) == '月' && ret.substr(10, 1) == '日') {
                // 如果日後面沒多餘的字元的話
                if (ret.substr(11, 1).length == 0) {
                    retStr = ret.substr(0, 11);
                } else if (ret.substr(11, 1).length == 1 && ret.substr(11, 1) == '/') {
                    retStr = ret.substr(0, 11);
                }
            } else if (ret.substr(4, 1) == '年' && ret.substr(7, 1) == '月' && ret.substr(9, 1) == '日') {
                retStr = ret.substr(0, 8) + '0' + ret.substr(8, 2);
            } else if (ret.substr(4, 1) == '年' && ret.substr(6, 1) == '月' && ret.substr(9, 1) == '日') {
                retStr = ret.substr(0, 5) + '0' + ret.substr(5, 2) + ret.substr(7, 3);
            } else if (ret.substr(4, 1) == '年' && ret.substr(6, 1) == '月' && ret.substr(8, 1) == '日') {
                retStr = ret.substr(0, 5) + '0' + ret.substr(5, 2) + '0' + ret.substr(7, 2);
            }
        } else if (dateType == 4) {
            // 賦值
            retStr = ret.substring(0, index + 1);
        } else if (dateType == 5) {
            // 賦值
            retStr = str3;
        } else if (dateType == 6) {
            // 賦值
            retStr = index;
        } else if (dateType == 7) {
            // 賦值
            retStr = str4;
        }
        // 如果isGetYearValue為true,返回年
        if (isGetYearValue == true) {
            // 創建對象保存
            ret = {};
            // 保存年
            ret['year'] = retStr.slice(0, 4);
            //保存月
            ret['month'] = retStr.slice(5, 7);
            // 保存日
            ret['day'] = retStr.slice(8, 10);
            // 重新賦值
            retStr = ret;
        }
        // 返回xxxx年xx月xx日格式
        return retStr;
    }
    // 判斷是否數字
    function myIsNaN(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    /* ===================  新增開啟至新分頁+複製標題按鈕 End =================== */
    /* ================== 監聽鍵盤按下快捷鍵,來跳轉或觸發點擊事件Start =================== */
    // 獲取鍵盤碼
    function getKeyCode(str) {
        // 獲取目前字串
        var getKey = str.toLocaleLowerCase();
        // 返回結果
        var ret = '';
        // 鍵碼表
        var keyCode = {
                key: {
                    /* 字母和數字鍵的鍵碼值 */
                    'a': 65,
                    'b': 66,
                    'c': 67,
                    'd': 68,
                    'e': 69,
                    'f': 70,
                    'g': 71,
                    'h': 72,
                    'i': 73,
                    'j': 74,
                    'k': 75,
                    'l': 76,
                    'm': 77,
                    'n': 78,
                    'o': 79,
                    'p': 80,
                    'q': 81,
                    'r': 82,
                    's': 83,
                    't': 84,
                    'u': 85,
                    'v': 86,
                    'w': 87,
                    'x': 88,
                    'y': 89,
                    'z': 90,
                    '0': 48,
                    '1': 49,
                    '2': 50,
                    '3': 51,
                    '4': 52,
                    '5': 53,
                    '6': 54,
                    '7': 55,
                    '8': 56,
                    '9': 57,
                    /* 數字鍵盤上的鍵的鍵碼值 後面加_和主鍵盤數字鍵 區分開 */
                    '0_': 96,
                    '1_': 97,
                    '2_': 98,
                    '3_': 99,
                    '4_': 100,
                    '5_': 101,
                    '6_': 102,
                    '7_': 103,
                    '8_': 104,
                    '9_': 105,
                    '*': 106,
                    '+_': 107,
                    'enter1': 108,
                    '-': 109,
                    '.': 110,
                    '/': 111,
                    /* 功能鍵鍵碼值 */
                    'f1': 112,
                    'f2': 113,
                    'f3': 114,
                    'f4': 115,
                    'f5': 116,
                    'f6': 117,
                    'f7': 118,
                    'f8': 119,
                    'f9': 120,
                    'f10': 121,
                    'f11': 122,
                    'f12': 123,
                    /* 控制鍵鍵碼值 */
                    'backspace': 8,
                    'tab': 9,
                    'clear': 12,
                    'enter': 13,
                    'shift': 16,
                    'ctrl': 17,
                    'control': 17,
                    'alt': 19,
                    'cape lock': 20,
                    'esc': 27,
                    'spacebar': 32,
                    'page up': 33,
                    'page down': 34,
                    'end': 35,
                    'home': 36,
                    'left arrow': 37,
                    'up arrow': 38,
                    'right arrow': 39,
                    'down arrow': 40,
                    'insert': 45,
                    'delete': 46,
                    'num lock': 144,
                    ';': 186,
                    ':': 186,
                    '=': 187,
                    '+': 187,
                    '-': 189,
                    '_': 189,
                    '.': 190,
                    '>': 190,
                    '/': 191,
                    '?': 191,
                    '`': 192,
                    '~': 192,
                    '[': 219,
                    '{': 219,
                    '/': 220,
                    '|': 220,
                    ']': 221,
                    '}': 221
                }
            }
            // 循環遍歷
        for (var i in keyCode['key']) {
            // 判斷是否有目前key值
            if (i == getKey) {
                // 返回結果
                ret = keyCode['key'][i];
            }
        }
        return ret;
    }
    // 監聽滑鼠按下事件
    $(document).keydown(function(e) {
        /*  console.log
            e
          );*/
        // 獲取鍵盤控制鍵
        var keyCode = e.keyCode || e.which || e.charCode;
        // 獲取Ctrl鍵,返回true和false
        var ctrlKey = e.ctrlKey || e.metaKey;
        // 獲取Shift鍵,返回true和false
        var shiftKey = e.shiftKey || e.metaKey;
        // 獲取Alt鍵,返回true和false
        var altKey = e.altKey || e.metaKey;
        // 如果是單個鍵的話
        // 判斷選擇哪個快捷鍵,動態獲取哪個頁面
        if (keyCode == 13) {
            // 如果搜尋框不為空,進入判斷
            if (document.querySelectorAll('.searchInputL')[0].value) {
                // 拼接url搜尋地址
                var toUrlStr = 'https://bangumi.tv/subject_search/' + document.querySelectorAll('.searchInputL')[0].value + '?cat=';
                // 跳轉頁面
                window.open(toUrlStr + getQueryVariable('cat'), "_self");
                // 點擊搜尋按鈕,會導致監聽Enter 鍵失效
                // $('.searchBtnL').click();
            }
            console.log('Enter鍵');
        }
        /* ========= 判斷按下Ctrl + Shift  + Alt + 英文字母/數字快捷鍵 ============*/
        if (ctrlKey && shiftKey && altKey && keyCode == getKeyCode('X')) {
            console.log('Ctrl + Shift + Alt + X');
        } else if (ctrlKey && shiftKey && keyCode == getKeyCode('X')) {
            /* ========= 判斷按下Ctrl + Shift  + 英文字母/數字快捷鍵 ============*/
            console.log('Ctrl + Shift + X');
        } else if (ctrlKey && altKey && keyCode == getKeyCode('X')) {
            /* ========= 判斷按下Ctrl + Alt  + 英文字母/數字快捷鍵 ============*/
            console.log('Ctrl + Alt + X');
        } else if (shiftKey && altKey && keyCode == getKeyCode('X')) {
            /* ========= 判斷按下Shift + Alt  + 英文字母/數字快捷鍵 ============*/
            console.log('Shift + Alt + X');
        } else if (ctrlKey && keyCode == getKeyCode('O')) {
            /* ========= 判斷按下Ctrl + O ============*/
            console.log('Ctrl +  O');
        } else if (shiftKey && keyCode == getKeyCode('Z')) {
            /* ========= 判斷按下Shift + Z  ============*/
            // 點擊【一鍵批次打開】
            $('#btnClass').click();
            console.log('Shift +  Z');
        } else if (shiftKey && keyCode == getKeyCode('R')) {
            /* ========= 判斷按下Shift + R  ============*/
            // 點擊【點擊重設(目前列表共xxx條)】或【點擊重設(目前列表共xxx條 / 標籤數共xxx條)】按鈕
            $('.fixedLeft').click();
            console.log('Shift +  R');
        } else if (altKey && keyCode == getKeyCode('X')) {
            /* ========= 判斷按下Alt + 英文字母/數字快捷鍵 ============*/
            console.log('Alt +  X');
        }
        // 阻止預設事件
        // e.preventDefault();
        // return false;
        return;
    });
    // 獲取url參數[得到url參數]為對象
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    /* ================== 判斷滾動事件,搜尋框置頂 Start =================== */
    // 獲取要定位元素距離瀏覽器頂部的距離
    var navH = $(".searchBox.clearit > form").offset().top;
    // 滾動條事件
    $(window).scroll(function() {
            // 獲取滾動條的滑動距離
            var scroH = $(this).scrollTop();
            // 滾動條的滑動距離大於等於定位元素距離瀏覽器頂部的距離，就固定，反之就不固定
            if (scroH >= navH) {
                // 更改父級樣式
                $('.searchBox').css({
                        'width': '100%'
                    })
                    // 更改搜尋框樣式
                $(".searchBox.clearit > form").css({
                    'position': 'fixed',
                    'display': 'table-cell',
                    'text-align': 'center',
                    'z-index': '100',
                    'width': '100%'
                });
                // 更改搜尋按鈕樣式
                $('.searchBtnL').css({
                    'margin-left': '2px'
                })
            } else if (scroH < navH) {
                // 恢復父級樣式
                $('.searchBox').css({
                        'width': '980px'
                    })
                    // 恢復搜尋框樣式
                $(".searchBox.clearit > form").css({
                    "position": "static"
                });
                // 更改搜尋按鈕樣式
                $('.searchBtnL').css({
                    'margin-left': '2px'
                })
            }
        })
        /* ================== 判斷滾動事件,搜尋框置頂 End =================== */
        /* ================== 監聽按下Ctrl + V黏貼鍵,自動將剪切板的值輸出到搜尋框 Start =================== */
        // 監聽黏貼事件
    document.addEventListener('paste', function(evt) {
        var clipdata = evt.clipboardData || window.clipboardData;
        // 判斷是否已手動點擊搜尋框,是的話不進行自動賦值,反之自動賦值
        if (!isFocus()) {
            // 按Ctrl + V快捷鍵搜尋框黏貼剪切板內容
             $('.searchInputL').val('"' + clipdata.getData('text/plain') + '"');
            // $('.searchInputL').val(clipdata.getData('text/plain'));

            // console.log(clipdata.getData('text/plain'));
            // 拼接url搜尋地址
            var toUrlStr = 'https://bangumi.tv/subject_search/' + document.querySelectorAll('.searchInputL')[0].value + '?cat=';
            // 跳轉頁面
            window.open(toUrlStr + getQueryVariable('cat'), "_self");
        }
    });
    // 搜尋框設置ID
    $('.searchInputL').attr('id', 'inputId');
    // 判斷獲取頁面input焦點事件
    function isFocus() {
        // 判斷是否獲取到焦點
        var flag = false;
        // 判斷是否有ID
        if (document.activeElement.id == 'inputId') {
            flag = true;
        }
        return flag;
    }
    // 獲取url參數[得到url參數]為對象
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    /* ================== 監聽按下Ctrl + V黏貼鍵,自動將剪切板的值輸出到搜尋框 End =================== */
    /* ================== 自動觸發Bangumi排序腳本,日期排序點擊事件Start =================== */
    // 定時器觸發按日期-正敘排序
    /*    window.setTimeout(function() {
            $('.chiiBtn').eq(2)[0].click()
        }, 200)

        window.setTimeout(function() {
            $('.chiiBtn').eq(2)[0].click()
        }, 500)
    */
    // 定時器觸發按日期-倒敘排序
    /*    window.setTimeout(function() {
            $('#locationBtn').click()
        }, 1500)*/
    /* ================== 自動觸發Bangumi排序腳本,日期排序點擊事件End =================== */
})