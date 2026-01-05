// ==UserScript==
// @name         news image redirector
// @namespace    http://tampermonkey.net/
// @version      0.2.11
// @description  redirects to image on korean news sites
// @author       You
// @match        http://isplus.live.joins.com/news/article/*
// @match        http://find.joins.com/isplusSearch*
// @match        http://www.newsen.com/news_view.php?*
// @match        http://www.newsen.com/news_list.php?*
// @match        http://*.heraldcorp.com/*
// @match        http://osen.mt.co.kr/article/*
// @match        http://tenasia.hankyung.com/archives/*
// @match        http://tvdaily.asiae.co.kr/read.php*
// @match        http://*.mt.co.kr/*
// @match        http://*.mk.co.kr/*
// @match        http://*.asiae.co.kr/news/*
// @match        http://enews24.tving.com/news/article.asp*
// @match        http://www.newspim.com/news/view/*
// @match        http://www.joongboo.com/?mod=news*
// @match        http://star.spotvnews.co.kr/?mod=news*
// @match        http://hei.hankyung.com/*
// @match        http://star.mbn.co.kr/view.php*
// @match        http://news.mtn.co.kr/newscenter/news_viewer.mtn*
// @match        http://sports.chosun.com/news/*
// @match        http://news.chosun.com/*
// @match        http://*.seoul.co.kr/news/newsView.php*
// @match        http://www.sportsworldi.com/content/html/*
// @match        http://*.hankooki.com/*page/*
// @match        http://photo.hankooki.com/*
// @match        http://sports.khan.co.kr/*
// @match        http://www.mydaily.co.kr/*
// @match        http://*.inews24.com/php/news_view.php*
// @match        http://*.donga.com/*
// @match        http://www.xportsnews.com/*
// @match        http://www.ajunews.com/view/*
// @match        http://www.ajunews.com/common/redirect.jsp?*
// @match        http://www.kyeongin.com/main/view.php?*
// @match        http://www.g-enews.com/ko-kr/news/article/*
// @match        http://enter.etoday.co.kr/view/news_view.php?*
// @match        http://www.etoday.co.kr/news/section/newsview.php?*
// @match        http://chicnews.mk.co.kr/article.php*
// @match        http://moneys.mt.co.kr/news/mwView.php*
// @match        http://www.sedaily.com/NewsView/*
// @match        http://www.wowtv.co.kr/newscenter/news/view.asp?*
// @match        http://view.asiae.co.kr/news/view.htm?*
// @match        http://www.segye.com/content/html/*
// @match        http://bntnews.hankyung.com/apps/news*
// @match        http://search.hankyung.com/*
// @match        http://www.etnews.com/*
// @match        http://www.tvreport.co.kr/*
// @match        http://www.breaknews.com/sub_read.html*
// @match        http://www.dispatch.co.kr/*
// @match        http://www.yonhapnews.co.kr/photos/*
// @match        http://*.edaily.co.kr/news/*
// @match        http://*.naver.com/read?*
// @match        http://sports.news.naver.com/*/news/read.nhn*
// @match        http://www.diodeo.com/news/view/*
// @match        http://www.kookje.co.kr/*
// @match        http://www.kyeongin.com/main/view.php*
// @match        http://interview365.mk.co.kr/news/*
// @match        http://www.interview365.com/news/*
// @match        http://star.fnnews.com/archives/*
// @match        http://www.dailian.co.kr/news/view/*
// @match        http://*.busan.com/controller/newsController.jsp?*
// @match        http://news1.kr/articles/*
// @match        http://news1.kr/photos/details/*
// @match        http://news1.kr/search_front/search.phps*
// @match        http://foto.sportschosun.com/news/*
// @match        http://*.sportsseoul.com/*/read/*
// @match        http://*.tf.co.kr/read/*
// @match        http://www.fnnews.com/news/*
// @match        http://biz.chosun.com/*
// @match        http://*.newsway.co.kr/view.php*
// @match        http://www.newstomato.com/ReadNews.aspx*
// @match        http://www.newdaily.co.kr/*/article.html*
// @match        http://www.mediapen.com/*/view/*
// @match        http://news.naver.com/main/read.nhn*
// @match        http://www.viva100.com/main/view.php*
// @match        http://www.newsis.com/pict_detail/view.html*
// @match        http://www.nocutnews.co.kr/news/*
// @match        http://*.kmib.co.kr/article/view.asp*
// @match        http://www.asiatoday.co.kr/view.php?*
// @match        http://www.starnnews.com/news/index.html*
// @match        http://www.mbn.co.kr/pages/*/*View.php*
// @match        http://search.chosun.com/search/news.search*
// @match        http://star.ettoday.net/photo/*
// @match        http://www.koreastardaily.com/*/news/*
// @include      /.*/news/articleList.html.*/
// @include      /.*/news/articleView.html.*/
// @include *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27650/news%20image%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/27650/news%20image%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window._nir_debug_ = true;

    function bigimage(src) {
        var protocol_split = src.split("://");
        var protocol = protocol_split[0];
        var splitted = protocol_split[1].split("/");
        var domain = splitted[0];

        if (src.indexOf("img.tenasia.hankyung.com") >= 0) {
            return src.replace(/-[0-9]*x[0-9]*\.jpg$/, ".jpg");
        }

        if (domain.indexOf(".naver.net") >= 0 ||
            domain.indexOf(".pstatic.net") >= 0) {
            if (domain.indexOf("gfmarket.") >= 0) {
                return src;
            }

            if (src.match(/[?&]src=/)) {
                return decodeURIComponent(src.replace(/.*src=*([^&]*).*/, "$1")).replace(/^"*/, '').replace(/"$/, '');
            }

            // for some reason it doesn't work with (some?) cafe files?
            // test:
            // https://cafeptthumb-phinf.pstatic.net/20150611_228/pht0829_1434017180824U5auR_JPEG/U01.jpg?type=w1
            // proper:
            // https://cafeptthumb-phinf.pstatic.net/20150611_228/pht0829_1434017180824U5auR_JPEG/U01.jpg

            // however in cases such as
            // https://postfiles.pstatic.net/MjAxNzA2MjVfMjcg/MDAxNDk4MzY2NTU1NDA1._jJeyTBgxoS4OUVFnfUpCTwFlWgsQANPgd5g4Wr__2kg._o3wfc4uAzyG_buHGKqENCl6g1pDt6-thoX-akGet9Qg.JPEG.amyo916/%EB%B0%A4%EB%B9%84%EB%85%B8_%EC%9D%80%EC%86%943.jpg?type=w1
            // doing
            // https://postfiles.pstatic.net/MjAxNzA2MjVfMjcg/MDAxNDk4MzY2NTU1NDA1._jJeyTBgxoS4OUVFnfUpCTwFlWgsQANPgd5g4Wr__2kg._o3wfc4uAzyG_buHGKqENCl6g1pDt6-thoX-akGet9Qg.JPEG.amyo916/%EB%B0%A4%EB%B9%84%EB%85%B8_%EC%9D%80%EC%86%943.jpg
            // returns a smaller file

            // there is also ?type=w2 to consider, but with no change i've seen so far

            if (domain.search(/^[-a-z0-9]*cafe[-a-z0-9]*\./) < 0)
                src = src.replace(/\?type=[^/]*$/, "?type=w1");
            else
                src = src.replace(/\?type=[^/]*$/, "");

            if (domain.search(/^[-a-z0-9]*blog[-a-z0-9]*\./) < 0 &&
               domain.search(/^[-a-z0-9]*cafe[-a-z0-9]*\./) < 0 &&
               domain.search(/^[-a-z0-9]*news[-a-z0-9]*\./) < 0) {
                return src;
            }

            return src
                .replace(/postfiles[^/.]*\./, "blogfiles.")
                .replace(/m?blogthumb[^./]*/, "blogfiles")
                .replace(/blogfiles[^/.]*\./, "blogfiles.")

                .replace(/cafeptthumb[^./]*/, "cafefiles")
                .replace(/m?cafethumb[^./]*/, "cafefiles")
                .replace(/carefiles[^/.]*\./, "cafefiles.")

                .replace(/mimgnews[^./]*/, "imgnews")

                .replace(/\.phinf\./, ".")
                .replace(".naver.net/", ".pstatic.net/");
        }

        if (src.indexOf("daumcdn.net/thumb/") >= 0) {
            return decodeURIComponent(src.replace(/.*fname=([^&]*).*/, "$1"));
        }

        if (src.indexOf(".uf.tistory.com/") >= 0 ||
            src.indexOf(".uf.daum.net/") >= 0) {
            return src.replace("/attach/", "/original/").replace("/image/", "/original/").replace(/\/[RT][0-9]*x[0-9]*\//, "/original/");
        }

        if (src.indexOf("image.news1.kr") >= 0) {
            return src.replace(/article.jpg/, "original.jpg").replace(/no_water.jpg/, "original.jpg");
        }

        if (src.indexOf(".joins.com/") >= 0) {
            return src.replace(/\.tn_[0-9]*\..*/, "");
        }

        if (src.indexOf("uhd.img.topstarnews.net/") >= 0) {
            return src.replace("/file_attach_thumb/", "/file_attach/").replace(/_[^/]*[0-9]*x[0-9]*_[^/]*(\.[^/]*)$/, "-org$1");
        }

        if (src.indexOf("thumb.mtstarnews.com/") >= 0) {
            return src.replace(/\.com\/[0-9][0-9]\//, ".com/06/");
        }

        if (src.indexOf("stardailynews.co.kr") >= 0 || src.indexOf("liveen.co.kr") >= 0) {
            return src.replace("/thumbnail/", "/photo/").replace(/_v[0-9]*\./, ".");
        }

        if (src.indexOf("img.hankyung.com") >= 0) {
            return src.replace(/\.[0-9]\.([a-zA-Z0-9]*)$/, ".1.$1");
        }

        if (src.indexOf("sportsq.co.kr") >= 0) {
            return src.replace("/thumbnail/", "/photo/").replace(/_v[0-9]*\.([^/]*)$/, ".$1");
        }

        if (src.indexOf("cdn.newsen.com") >= 0) {
            return src.replace(/_ts\.[^/._]*$/, ".jpg");
        }

        if (src.indexOf("chosun.com") >= 0) {
            return src.replace("/thumb_dir/", "/img_dir/").replace("/thumbnail/", "/image/").replace("_thumb.", ".");
        }

        if (src.indexOf("photo.hankooki.com") >= 0) {
            return src.replace("/photo/", "/original/").replace("/thumbs/", "/original/").replace(/(.*\/)t([0-9]*[^/]*)$/, "$1$2");
        }

        if (src.indexOf(".ettoday.net") >= 0) {
            return src.replace(/\/[a-z]*([0-9]*\.[^/]*)$/, "/$1");
        }

        if (src.indexOf("newscj.com") >= 0) {
            return src.replace("/thumbnail/", "/photo/").replace(/_v[0-9]*\.[^./]*$/, ".JPG");
        }

        if (src.indexOf(".wowkorea.jp/img") >= 0) {
            return src.replace(/([^/]*_)[a-z0-9]*(\.[^/.]*)$/, "$1l$2");
        }

        if (src.indexOf("img.saostar.vn") >= 0) {
            return src.replace(/saostar.vn\/[a-z][0-9]+\//, "saostar.vn/").replace(/saostar.vn\/[0-9]+x[0-9]+\//, "saostar.vn/");
        }

        if (src.match(/\/www.google.[a-z]*\/url\?/)) {
            return decodeURIComponent(src.replace(/.*url=([^&]*).*/, "$1"));
        }

        if ((domain.indexOf("www.lipstickalley.com") >= 0 ||
             domain.indexOf("forum.purseblog.com") >= 0) &&
            src.indexOf("/proxy.php?") >= 0) {
            return decodeURIComponent(src.replace(/.*image=([^&]*).*/, "$1"));
        }

        if (src.indexOf("nosdn.127.net/img/") >= 0) { //lofter
            return src.replace(/\?[^/]*$/, "");//"?imageView");
        }

        if (src.indexOf("board.makeshop.co.kr") >= 0) {
            return src.replace(/\/[a-z]*::/, "/");
        }

        if (src.indexOf("rr.img.naver.jp/mig") >= 0) {
            return decodeURIComponent(src.replace(/.*src=([^&]*).*/, "$1"));
        }

        if (src.indexOf("imgcc.naver.jp") >= 0) {
            return src.replace(/\/[0-9]+\/[0-9]+\/*$/, "");
        }

        if (domain.match(/s[0-9]\.marishe\.com/)) {
            return src.replace(/(\/[^/]*)_[0-9]+(\.[^/.]*)$/, "$1$2");
        }

        // img77
        if (domain.match(/img[0-9]*\.dreamwiz\.com/)) {
            return src.replace(/(\/[^/]*)_[a-z]\.([^/.]*)$/, "$1_o.$2");
        }

        if (domain.indexOf("cdn.hk01.com") >= 0) {
            return src.replace(/(\/media\/images\/[^/]*\/)[^/]*\//, "$1xxlarge/");
        }

        if (domain.indexOf(".sinaimg.cn") >= 0) {
            src = src.replace(/\.sinaimg\.cn\/[^/]*\/([^/]*)\/*$/, ".sinaimg.cn/large/$1");
            return src.replace(/\/slidenews\/([^/_]*)_[^/_]*\//, "/slidenews/$1_img/");
        }

        if (domain.indexOf("thumbnail.egloos.net") >= 0) {
            return src.replace(/.*:\/\/thumbnail\.egloos\.net\/[^/]*/, "");
        }

        if (domain.indexOf("k.kakaocdn.net") >= 0) {
            return src.replace(/\/img_[a-z]*\.([^./]*)$/, "/img.$1");
        }

        if (domain.indexOf("images.sportskhan.net") >= 0 ||
            domain == "img.khan.co.kr") {
            return src
                .replace(/\/r\/[0-9]+x[0-9]+\//, "/")
                .replace(/\/[a-z]*_([0-9]+\.[a-z0-9A-Z]*)$/, "/$1");
        }

        if (domain == "img.sbs.co.kr") {
            return src.replace(/(\/[0-9]+)_[0-9]+\.([a-z0-9A-Z]*)$/, "$1.$2");
        }

        if (domain == "spnimage.edaily.co.kr") {
            return src.replace(/(\/[A-Z0-9]+)[a-z]\.([a-z0-9A-Z]*)$/, "$1.$2");
        }

        // cloudinary
        if (domain.indexOf("media.glamour.com") >= 0 ||
            domain.indexOf("assets.teenvogue.com") >= 0 ||
            domain.indexOf("assets.vogue.com") >= 0 ||
            domain.indexOf("media.vanityfair.com") >= 0 ||
            domain.indexOf("media.gq.com") >= 0 ||
            domain.indexOf("media.wmagazine.com") >= 0 ||
            domain.indexOf("media.self.com") >= 0 ||
            domain.indexOf("media.pitchfork.com") >= 0 ||
            domain.indexOf("media.allure.com") >= 0) {
            return src.replace(/\/[^/]*\/[^/]*\/([^/]*)$/, "/original/original/$1");
        }

        if (domain.indexOf(".cloudinary.com") >= 0) {
            if (src.search(/.*\.cloudinary\.com\/[^/]*\/image\/fetch\//) >= 0) {
                return src.replace(/.*\.cloudinary\.com\/[^/]*\/image\/fetch\/(.*?\/)?([^/]*:.*)/, "$2");
            }

            return src.replace(/(\/iu\/[^/]*)\/.*?(\/v[0-9]*)/, "$1$2");
        }

        if (domain.indexOf("images.fastcompany.net") >= 0 ||
            domain.indexOf("i.kinja-img.com") >= 0 ||
            domain.indexOf("dwgyu36up6iuz.cloudfront.net") >= 0 ||
            domain.indexOf("images.moviepilot.com") >= 0) {
            return src.replace(/\/image\/upload\/[^/]*[_-][^/]*\//, "/image/upload/");
        }

        if (domain.indexOf("www.vogue.de") >= 0 &&
            src.indexOf("/storage/images/") >= 0) {
            return src.replace(/_v[0-9]*x[0-9]*\.([^/]*)$/, ".$1");
        }

        if (domain.indexOf(".popsugar-assets.com") >= 0) {
            return src.replace(/\/thumbor\/[^/]*\/fit-in\/[^/]*\/filters:[^/]*\//, "/");
        }

        if (domain.indexOf(".cdnds.net") >= 0 &&
            domain.indexOf("esquireuk.cdnds.net") < 0) {
            return src.replace(/\/[0-9]+x[0-9]+\//, "/");
        }

        if (domain.indexOf("img.usmagazine.com") >= 0) {
            return src.replace(/(.*?[^:])\/[0-9]*-[^/]*\//, "$1/");
        }

        if (domain.indexOf("gannett-cdn.com") >= 0) {
            return src.replace(/\/-mm-\/.*?\/-\//, "/");
        }

        if (domain.indexOf(".aolcdn.com") >= 0) {
            var regex1 = /.*image_uri=([^&]*).*/;

            if (src.match(regex1)) {
                return decodeURIComponent(src.replace(/.*image_uri=([^&]*).*/, "$1"));
            } else {
                return decodeURIComponent(src).replace(/.*o\.aolcdn\.com\/images\/[^:]*\/([^:/]*:.*)/, "$1");
            }
        }

        if (domain.indexOf("imagesvc.timeincapp.com") >= 0) {
            return decodeURIComponent(src.replace(/.*image\?.*url=([^&]*).*/, "$1"));
        }

        if (domain.indexOf(".photoshelter.com") >= 0) {
            return src.replace(/\/s\/[0-9]*\/[0-9]*\//, "/");
        }

        if (domain.indexOf("www.celebzz.com") >= 0 && src.indexOf("/wp-content/uploads/") >= 0) {
            return src.replace(/-[0-9]+x[0-9]+(\.[^/.]*)$/, "$1");
        }

        if (domain.indexOf("images-na.ssl-images-amazon.com") >= 0) {
            return src.replace(/\._[^/]*\.([^./]*)$/, "._.$1");
        }

        /*if (domain.indexOf("cdn-img.instyle.com") >= 0) {
            return src.replace(/(\/files\/styles\/)[^/]*(\/public)/, "$1original$2");
        }

        if (domain.indexOf("static.independent.co.uk") >= 0) {
            return src.replace(/(\/styles\/)story_[^/]*(\/public)/, "$1story_large$2");
        }*/

        // drupal
        if (domain.indexOf("cdn-img.instyle.com") >= 0 ||
            domain.indexOf("static.independent.co.uk") >= 0 ||
            domain.indexOf("static.standard.co.uk") >= 0 ||
            domain.indexOf("www.billboard.com") >= 0 ||
            domain.indexOf("www.harpersbazaararabia.com") >= 0 ||
            domain.indexOf("www.etonline.com") >= 0 ||
            domain.indexOf("o.oystermag.com") >= 0 ||
            domain.indexOf("www.metro.us") >= 0 ||
            domain.indexOf("www.mtv.co.uk") >= 0 ||
            domain.indexOf("www.grammy.com") >= 0 ||
            domain.match(/cdn[0-9]*\.thr\.com/) ||
            domain.match(/s[0-9]*\.ibtimes\.com/) ||
            src.search(/\/files\/styles\/[^/]*\/public\//) >= 0) {
            return src.replace(/\/styles\/.*?\/public\//, "/").replace(/\/imagecache\/[^/]*\//, "/");
        }

        if (domain.indexOf("www.trbimg.com") >= 0) {
            return src.replace(/\/[0-9]*\/[0-9]*x[0-9]*\/*$/, "/").replace(/\/[0-9]*\/*$/, "/");
        }

        if (domain.indexOf(".bp.blogspot.com") >= 0) {
            return src.replace(/\/[swh][0-9]*\/([^/]*)$/, "/s0/$1");
        }

        if (domain.indexOf("cdn.skim.gs") >= 0 ||
            domain.indexOf("images.moviepilot.com") >= 0) {
            return src.replace(/\/images\/[^/]*_[^/]*\//, "/images/");
        }

        if (domain.indexOf("images.thestar.com") >= 0) {
            return src.replace(/(\/[^/.]*\.[^/.]*)\.[^/]*$/, "$1");
        }

        if (domain.indexOf("cdn.narcity.com") >= 0) {
            return src.replace(/(\/[^/.]*\.[^/._]*)_[^/]*$/, "$1");
        }

        if (domain.indexOf("images.vanityfair.it") >= 0) {
            return src.replace(/(\/gallery\/[0-9]*\/)[^/]*\//, "$1Original/");
        }

        if (domain.indexOf(".r29static.com") >= 0) {
            return src.replace(/\/bin\/entry\/([^/]*)\/[^/]*(,[^/]*)?\/([^,]*)$/, "/bin/entry/$1/0x0,100/$3");
        }

        if (domain.indexOf("img.huffingtonpost.com") >= 0) {
            return src.replace(/\/asset\/[^/]*\/([^/.]*\.[^/.]*)$/, "/asset/$1").replace(/\?[^/]*$/, "");
        }

        if (domain.indexOf(".washingtonpost.com") >= 0) {
            // test: https://img.washingtonpost.com/rf/image_1483w/2010-2019/Wires/Online/2017-11-21/AP/Images/Music_Taylor_Swift_36357.jpg
            // error: Query String : src=http://www.washingtonpost.com/rw/2010-2019/Wires/Online/2017-11-21/AP/Images/Music_Taylor_Swift_36357.jpg&w=1483
            // real: https://img.washingtonpost.com/rf/image_1484w/2010-2019/Wires/Online/2017-11-21/AP/Images/Music_Taylor_Swift_36357.jpg-ced9a.jpg?uuid=TiTSis5fEeeoe0fxS3MWKg
            var newurl = src.replace(/.*\.washingtonpost\.com\/rf\/[^/]*\/(.*)$/, "https://www.washingtonpost.com/rw/$1").replace(/[?&][^/]*$/, "");
            if (newurl !== src) {
                return newurl;
            }

            return src.replace(/.*\/wp-apps\/imrs\.php\?[^/]*src=/, "");
        }

        if (domain.indexOf("www.livemint.com") >= 0) {
            return src.replace(/\/rf\/[^/]*\/(.*)$/, "/rw/$1");
        }

        if (domain.match(/^a[0-9]*\.foxnews\.com/)) {
            return src.replace(/.*\/a[0-9]*\.foxnews\.com\/(.*)\/[0-9]+\/[0-9]+\/([^/]*)$/, "http://$1/$2");
        }

        if (domain.indexOf("cdn.cliqueinc.com") >= 0) {
            return src.replace(/(\/[^./]*)\.[^./]*\.([^./]*)$/, "$1.$2");
        }

        if (domain.indexOf(".hubstatic.com") >= 0) {
            return src.replace(/_[^_/.]*\.([^/.]*)$/, ".$1");
        }

        if (domain.indexOf("cdninstagram.com") >= 0 ||
            domain.match(/^instagram\..*\.fbcdn\.net/)) {
            var urlstart = protocol + "://" + domain + "/";
            var has_t = false;
            for (var i = 0; i < splitted.length; i++) {
                splitted[i] = splitted[i].replace(/\?.*$/, "");
                 if (splitted[i].match(/^t[0-9]+\.[0-9]+-[0-9]+$/)) {
                     urlstart += splitted[i] + "/";
                     has_t = true;
                 } else if (splitted[i].match(/^[0-9_]*_[a-z]+\.[a-z0-9]+$/)) {
                     if (!has_t) {
                         urlstart += "/";
                     }

                     urlstart += splitted[i];
                 }
            }
            return urlstart;
        }

        if (src.indexOf("pbs.twimg.com/media/") >= 0) {
            return src.replace(/(:[^/]*)?$/, ":orig");
        }

        if (src.indexOf("pbs.twimg.com/profile_images/") >= 0) {
            return src.replace(/_[a-zA-Z]+\.([^/_]*)$/, "\.$1");
        }

        if (domain.indexOf("ytimg.googleusercontent.com") >= 0 ||
            domain.indexOf("i.ytimg.com") >= 0 ||
            domain.indexOf("img.youtube.com") >= 0) {
            return src.replace(/\/[^/]*$/, "/maxresdefault.jpg");
        }

        if (domain.indexOf("image.bugsm.co.kr") >= 0) {
            return src.replace(/\/images\/[0-9]*\//, "/images/0/").replace(/\?.*$/, "");
        }

        if (src.search(/\/i[0-9]\.wp\.com\//) >= 0) {
            return src.replace(/.*\/i[0-9]\.wp\.com\//, "http://");
        }

        if (domain.indexOf("imagesmtv-a.akamaihd.net") >= 0) {
            return src.replace(/.*\/uri\/([a-z:]*:)?/, "http://");
        }

        if (domain.indexOf("img.voi.pmdstatic.net") >= 0 ||
            domain.indexOf("voi.img.pmdstatic.net") >= 0) {
            var base = src.replace(/.*\/fit\/([^/]*)\/.*/, "$1");
            base = base.replace(/\./g, "%");
            base = decodeURIComponent(base);
            return base;
        }

        if (domain.indexOf("dynaimage.cdn.cnn.com") >= 0) {
            return decodeURIComponent(src.replace(/.*\/cnn\/[^/]*\//, ""));
        }

        if (domain.indexOf("wcmimages.torontosun.com") >= 0) {
            return decodeURIComponent(src.replace(/.*\/images\?[^/]*url=/, ""));
        }

        if (domain.indexOf("i.amz.mshcdn.com") >= 0) {
            return decodeURIComponent(src.replace(/.*i\.amz\.mshcdn\.com\/[^/]*\/[^/]*\/[^/]*\/([^/]*).*/, "$1"));
        }

        if (domain.indexOf("s.yimg.com") >= 0) {
            return src.replace(/.*\/[^/]*\/api\/[^/]*\/[^/]*\/[^/]*\/[^/]*\//, "");
        }

        if (domain.indexOf("image.iol.co.za") >= 0) {
            return decodeURIComponent(src.replace(/.*\/process\/.*\?.*source=([^&]*).*/, "$1"));
        }

        if (domain.indexOf("imageresizer.static9.net.au") >= 0) {
            return decodeURIComponent(src.replace(/.*imageresizer\.static9\.net\.au\/[^=/]*=\/[0-9]+x[0-9]+\//, ""));
        }

        if (domain.match(/^static[0-9]*\.squarespace\.com/)) {
            src = src.replace(/(\?[^/]*)?$/, "?format=original");
        }

        // /wp/uploads:
        // http://ksassets.timeincuk.net/wp/uploads/sites/46/2017/02/oscars.jpg

        if (domain.indexOf(".files.wordpress.com") >= 0 ||
            //domain.indexOf("typeset-beta.imgix.net") >= 0 ||
            domain.indexOf(".imgix.net") >= 0 ||
            domain.indexOf("hmg-prod.s3.amazonaws.com") >= 0 ||
            domain.indexOf("blogs-images.forbes.com") >= 0 ||
            domain.indexOf("images-production.global.ssl.fastly.net") >= 0 ||
            domain.indexOf("typeset-beta.imgix.net") >= 0 ||
            domain.indexOf("imgix.elitedaily.com") >= 0 ||
            domain.indexOf("cosmouk.cdnds.net") >= 0 ||
            domain.indexOf("hbz.h-cdn.co") >= 0 ||
            domain.indexOf("cdn.newsapi.com.au") >= 0 ||
            domain.indexOf("images.indianexpress.com") >= 0 ||
            domain.indexOf("images.contentful.com") >= 0 ||
            domain.indexOf("imagesmtv-a.akamaihd.net") >= 0 ||
            domain.indexOf("d.ibtimes.co.uk") >= 0 ||
            domain.indexOf("akns-images.eonline.com") >= 0 ||
            domain.indexOf("www.telegraph.co.uk") >= 0 ||
            domain.indexOf("img.buzzfeed.com") >= 0 ||
            src.indexOf("/wp-content/uploads/") >= 0 ||
            src.indexOf("/wp/uploads/") >= 0) {
            src = src.replace(/\?[^/]*$/, "");
        }

        // check to make sure this doesn't break anything
        // test: https://s3.amazonaws.com/oscars-img-abc/wp-content/uploads/2017/02/26164054/950c51cde0a1cab411efdbf8f1abc117a6aad749397172c9b95dd3c47bfb6f6f-370x492.jpg
        if (domain.indexOf(".imimg.com") >= 0 ||
            domain.indexOf("blogs-images.forbes.com") >= 0 ||
            domain.indexOf("static.gofugyourself.com") >= 0 ||
            domain.indexOf("static.thesuperficial.com") >= 0 ||
            domain.indexOf("static.celebuzz.com") >= 0 ||
            domain.indexOf("img.vogue.co.kr") >= 0 ||
            src.indexOf("/wp-content/uploads/") >= 0 ||
            src.indexOf("/wp/uploads/") >= 0) {
            src = src.replace(/-[0-9]*x[0-9]*\.([^/.]*)/, ".$1");
        }

        if (domain.indexOf("storage.journaldemontreal.com") >= 0 ||
            domain.indexOf("storage.torontosun.com") >= 0) {
            //return src.replace(/(\/dynamic_resize\/.*)\?[^/]*$/, "$1?size=99999999");
            return src.replace(/\/dynamic_resize\/[^/]*\//, "/").replace(/\?[^/]*$/, "");
        }

        if (domain.indexOf("pictures.ozy.com") >= 0) {
            return src.replace(/\/pictures\/[0-9]*x[0-9]*\//, "/pictures/99999999x99999999/");
        }

        if (domain.indexOf("hips.hearstapps.com") >= 0) {
            return src.replace(/.*hips\.hearstapps\.com\//, "http://");
        }

        if (domain.indexOf("img.wennermedia.com") >= 0) {
            return src.replace(/img\.wennermedia\.com\/.*\/([^/]*)$/, "img.wennermedia.com/$1");
        }

        // specials-images.forbesimg.com
        if (domain.indexOf("images.forbesimg.com") >= 0) {
            return src.replace(/\/[0-9]*x[0-9]*\.([^/.?]*)(\?.*)?/, "/0x0.$1");
        }

        if (src.search(/\/lh[0-9]\.googleusercontent\.com\//) >= 0) {
            return src.replace(/(=[^/]*)?$/, "=s0");
        }

        if (domain.indexOf("upload.wikimedia.org") >= 0) {
            return src.replace(/\/thumb\/([^/]*)\/([^/]*)\/([^/]*)\/.*/, "/$1/$2/$3");
        }

        if (domain.indexOf("pixel.nymag.com") >= 0) {
            return src.replace(/\/([^/.]*)(\.[^/]*)?\.([^/.]*)$/, "/$1.$3");
        }

        if (domain.indexOf("assets.nydailynews.com") >= 0 ||
            domain.indexOf("i.cbc.ca") >= 0 ||
            domain.indexOf("cdn.newsday.com") >= 0 ||
            domain.indexOf("www.stripes.com") >= 0 ||
            domain.indexOf("www.thetimesnews.com") >= 0 ||
            domain.indexOf("www.irishtimes.com") >= 0 ||
            domain.indexOf("www.ctvnews.ca") >= 0) {
            return src.replace(/\/image\.[^_/]*_gen\/derivatives\/[^/]*\//, "/");
        }

        if (domain.indexOf("ichef.bbci.co.uk") >= 0) {
            return src.replace(/\/[0-9]+_[0-9]+\//, "/original/");
        }

        if (domain.match(/static[0-9]*\.businessinsider\.com/)) {
            return src.replace(/\/image\/([^-/]*)[^/]*\//, "/image/$1/");
        }

        if (domain.indexOf("media.nbcwashington.com") >= 0) {
            return src.replace(/\/images\/[0-9]+\*[0-9]+\//, "/images/");
        }

        if (domain.indexOf("www.bet.com") >= 0) {
            return src.replace(/\/([^/]*)\.custom[0-9]+fx[0-9]+fx[0-9]+xcrop\.([^/]*)\//, "/$1.custom0fx0fx0xcrop.$2/");
        }

        if (domain.match(/cbsnews[0-9]*\.cbsistatic\.com/) ||
            domain.indexOf("cimg.tvgcdn.net") >= 0) {
            return src.replace(/\/resize\/[0-9]*x[0-9]*\//, "/").replace(/\/crop\/[^/]*\//, "/").replace(/\/thumbnail\/[^/]*\//, "/");
        }

        if (domain.indexOf("i.f1g.fr") >= 0) {
            return src.replace(/.*i\.f1g\.fr\/media\/ext\/[^/]*\//, "http://");
        }

        if (/*domain.indexOf("hbz.h-cdn.co") >= 0*/
            domain.indexOf(".h-cdn.co") >= 0 && src.indexOf("/assets/") >= 0) {
            return src.replace(/\/[0-9]*x[0-9]*\//, "/");
        }

        if (domain.indexOf("imgix.ranker.com") >= 0) {
            return src.replace(/\?[^/]*$/, "?fm=png");
        }

        if (domain.indexOf("data.whicdn.com") >= 0) {
            return src.replace(/\/[^/.]*\.([^/.]*)$/, "/original.$1");
        }

        if (domain.indexOf("cdn.empireonline.com") >= 0) {
            // 12
            return src.replace(/cdn\.empireonline\.com\/(jpg)|(png)|(gif)\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*\//, "/");
        }

        if (domain.indexOf("ell.h-cdn.co") >= 0) {
            return src.replace(/(\/assets\/[^/]*\/[^/]*\/)[0-9]+x[0-9]+\//, "$1");
        }

        if (domain.indexOf("celebmafia.com") >= 0 ||
            domain.indexOf("hawtcelebs.com") >= 0) {
            return src.replace(/\/([^/]*)_thumbnail\.([^/.]*)$/, "/$1.$2");
        }

        if (domain.indexOf("cdn.vox-cdn.com") >= 0) {
            // https://cdn.vox-cdn.com/thumbor/ta2xdyUViVrBXCLGapdwLY7is_s=/0x0:3000x2355/1200x800/filters:focal(1116x773:1596x1253)/cdn.vox-cdn.com/uploads/chorus_image/image/55856727/815434448.0.jpg
            // https://cdn.vox-cdn.com/thumbor/dXu99BQwBagCavae7oYNG0uBfxQ=/0x46:1100x779/1200x800/filters:focal(0x46:1100x779)/cdn.vox-cdn.com/assets/1763547/Screenshot_2012.11.12_10.39.10.jpg
            // https://cdn.vox-cdn.com/thumbor/iTJF1PhWPiR3-LoITuXxS2u8su0=/1200x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/4998263/keenan_2010.0.jpg
            return src.replace(/.*\/thumbor\/.*?\/([^/]*\..*)/, "http://$1");
        }

        if (domain.match(/[a-z]*[0-9]*\.pixhost\.org/)) {
            return src.replace(/\/t([0-9]*\.pixhost\.org)\/thumbs\//, "/img$1/images/");
        }

        if (domain.indexOf("ssli.ulximg.com") >= 0) {
            return src.replace(/\/image\/[0-9]+x[0-9]+\//, "/image/full/");
        }

        if (domain.indexOf("fm.cnbc.com") >= 0) {
            return src.replace(/\.[0-9]+x[0-9]+\.([^/.]*)$/, ".$1");
        }

        if (domain.indexOf("images.bwwstatic.com") >= 0) {
            return src.replace(/\/tn-[0-9]+_([^/]*)$/, "/$1");
        }

        if (domain.match(/images[0-9]*\.houstonpress\.com/)) {
            return src.replace(/(\/imager\/[^/]*\/)[^/]*\//, "$1original/");
        }

        if (domain.indexOf("img.rasset.ie") >= 0) {
            return src.replace(/(\/[^/]*)-[0-9]*(\.[^/.]*)$/, "$1-9999$2");
        }

        if (domain.indexOf("i.pinimg.com") >= 0) {
            return src.replace(/i\.pinimg\.com\/[^/]*(\/.*\/[^/]*)\.[^/.]*$/, "i.pinimg.com/originals$1.jpg");
        }

        // vg-images.condecdn.net
        if (domain.indexOf("images.condecdn.net") >= 0) {
            return src.replace(/(\/image\/[^/]*\/).*/, "$1/original/");
        }

        if (domain.indexOf("media.fromthegrapevine.com") >= 0 ||
            domain.indexOf("www.mediavillage.com") >= 0) {
            return src.replace(/\/([^/.]*\.[^/.]*)\.[^/.]*\.[^/.]*$/, "/$1");
        }

        if (domain.search(/img[0-9]*\.acsta\.net/) >= 0) {
            return src.replace(/acsta\.net\/[^/]*\/pictures\//, "acsta.net/pictures/");
        }

        if (domain.indexOf("em.wattpad.com") >= 0) {
            return src.replace(/.*\.wattpad\.com\/[a-f0-9]*\/([a-f0-9]*).*/, "$1").replace(/([0-9A-Fa-f]{2})/g, function() {
                return String.fromCharCode(parseInt(arguments[1], 16));
            });
        }

        if (domain.indexOf("vignette.wikia.nocookie.net") >= 0) {
            return src.replace(/(\/images\/[^/]*\/.*)\/scale-to-width-down\/[0-9]*/, "$1");
        }

        if (domain.indexOf("static.asiachan.com") >= 0) {
            return src.replace(/(\/[^/]*)\.[0-9]*(\.[0-9]*\.[^/.]*$)/, "$1.full$2");
        }

        // coppermine
        if (src.search(/\/(gallery)|(photos)\/albums\/[^/]*\/[^/]*\/(normal)|(thumb)_[^/._]*\.[^/.]*$/) >= 0 ||
           src.search(/\/(gallery)|(photos)\/albums\/[^/]*\/[^/]*\/[^/]*\/(normal)|(thumb)_[^/._]*\.[^/.]*$/) >= 0) {
            return src.replace(/(\/(gallery)|(photos)\/albums\/.*\/)[a-z]*_([^/._]*\.[^/.]*)$/, "$1$4");
        }

        // various korean news sites (heraldpop etc.)
        // test:
        // http://cgeimage.commutil.kr/phpwas/restmb_allidxmake.php?idx=1&simg=2017111113495301086f97ee432d6203243244.jpg
        // http://res.heraldm.com/phpwas/restmb_jhidxmake.php?idx=999&simg=201712220654304807972_20171222065329_01.jpg
        // http://cgeimage.commutil.kr/phpwas/restmb_setimgmake.php?w=90&h=60&m=1&simg=201712231138280443342246731f35814122117.jpg
        if (src.search(/\/phpwas\/restmb_[a-z]*make\.php\?/) >= 0) {
            return src.replace(/\/phpwas\/restmb_[a-z]*make\.php\?.*(simg=[^&]*)/, "/phpwas/restmb_allidxmake.php?idx=999&$1");
        }

        /*if (domain.indexOf("media.toofab.com") >= 0) { // doesn't work for all urls
            src = src.replace(/-[0-9]*w\.([^/.]*)/, ".$1");
        }*/

        return src;
    }

    var newhref = document.location.href;
    while (true) {
        var newhref1 = bigimage(newhref);
        if (newhref1 !== newhref) {
            newhref = newhref1;
        } else {
            break;
        }
    }

    if (newhref !== document.location.href) {
        document.location = newhref;
        console.log(newhref);
    }

    function loaded() {
        if (document && document.children && document.children[0] && document.children[0].children && false) {
            for (var i = 0; i < document.children[0].children.length; i++) {
                document.children[0].children[i].addEventListener("contextmenu", function (e) {
                    e.stopPropagation();
                    return true;
                }, true);
            }
        }

        var sources = [
            "#adiContents img",
            ".article img",
            "#article img",
            ".articletext img",
            "#_article table[align='center'] img",
            "#_article img.view_photo",
            "#_article .article_photo img",
            "#articleBody img",
            "#articleBody .iframe_img img:nth-of-type(2)",
            "#newsContent .iframe_img img:nth-of-type(2)",
            "#articeBody .img_frame img",
            "#textBody img",
            "#news_contents img",
            "#arl_view_content img",
            ".articleImg img",
            "#newsViewArea img",
            "#articleContent img",
            "#articleContent #img img",
            "#newsContent img.article-photo-mtn",
            "#article_content img",
            /*"*[itemprop='articleBody'] img",*/ // conflicts with dispatch
            "*[itemprop='articleBody'] img.news1_photo",
            "*[itemprop='articleBody'] td > a > img",
            "*[itemprop='articleBody'] *[rel='prettyPhoto'] img",
            "div[itemprop='articleBody'] .centerimg img",
            "div[itemprop='articleBody'] .center_image img",
            ".center_image > img",
            ".article_view img",
            "img#newsimg",
            ".article_photo img",
            ".articlePhoto img",
            "#__newsBody__ .he22 td > img",
            ".article_image > img",
            "#CmAdContent img",
            ".article_outer .main_image p > img, .article_outer .post_body > img, .article_outer .post_body p img", // dispatch
            ".article-img img",
            ".portlet .thumbnail img",
            "#news_textArea img",
            ".news_imgbox img",
            ".view_txt img",
            "#IDContents img",
            "#view_con img",
            "#newsEndContents img",
            ".articleBox img",
            ".rns_text img",
            "#article_txt img",
            "#ndArtBody .imgframe img",
            ".view_box center img",
            ".newsbm_img_wrap > img",
            ".article .detail img",
            ".search_detail li a .thumb img",
            "#search_contents ul li .photo img",
            "span.thum > a > img",
            //"#ND_Warp table tr > td table tr > td table tr > td img, #articleBody table tr > td img", // conflicts with munhwanews search
            "table a.line > img", // newsen
            ".gisaimg > ul > li > img", // hankooki
            "img#bntimage\\[\\]", // hei.hankyung.com
            //".thumb > a > img" // chosun (conflicts with hankooki, and chosun??)
            ".part_thumb_2 .box_0 .pic img", // star.ettoday.net
            "#content-body p > img" // koreastardaily
        ];

        var found = false;
        var i;
        for (i = 0; i < sources.length; i++) {
            if (document.querySelectorAll(sources[i]).length === 1) {
                //var redirectto = bigimage(document.querySelector(sources[i]).src);
                //console.log("Redirecting to: " + redirectto);
                found = true;
                if (window._nir_debug_) {
                    console.log(sources[i]);
                } else {
                    document.location = bigimage(document.querySelector(sources[i]).src);
                }
                break;
            }
        }

        if (!found && !window._nir_debug_) {
            for (i = 0; i < sources.length; i++) {
                var selector = document.querySelectorAll(sources[i]);
                if (selector.length > 1) {
                    if (window._nir_debug_)
                        console.log(sources[i]);
                    selector.forEach((x) => {
                        var a = document.createElement("a");
                        if (x.src != bigimage(x.src))
                            x.src = bigimage(x.src);
                        a.href = bigimage(x.src);
                        var parent = x.parentNode;
                        if (parent.nodeName == "A")
                            return;
                        parent.insertBefore(a, x);
                        a.appendChild(x);
                    });
                }
            }
        }
    }

    if (document.readyState == 'interactive') {
        loaded();
    } else {
        loaded();
        window.addEventListener('DOMContentLoaded', loaded);
        setInterval(loaded, 1000);
    }
})();