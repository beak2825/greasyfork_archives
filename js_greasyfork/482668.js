// ==UserScript==
// @name         牛客网Web端首页->"推荐"栏目，免登录点击帖子标题查看帖子
// @name:en      Nowcoder Web - View Posts in "Recommended" Without Login
// @name:zh-TW   牛客網Web端首頁->"推薦"欄目，免登入點擊帖子標題查看帖子
// @name:ja      ニウケ（Nowcoder）ウェブ版ホームページ→"おすすめ"セクション、ログインなしでポストタイトルをクリックして閲覧
// @name:ko      Nowcoder 웹 홈페이지 -> "추천" 섹션, 로그인 없이 게시물 제목 클릭하여 보기
// @name:fr      Nowcoder Web - Page d'accueil -> Section "Recommandés", consulter les articles sans connexion
// @name:de      Nowcoder Web - Startseite -> "Empfohlen"-Bereich, Beiträge ohne Anmeldung anzeigen
// @name:es      Nowcoder Web - Página de inicio -> Sección "Recomendados", ver publicaciones sin iniciar sesión
// @name:ru      Nowcoder Web - Домашняя страница -> Раздел "Рекомендуемые", просмотр публикаций без входа
// @name:ar      Nowcoder Web - الصفحة الرئيسية -> قسم "موصى به"، عرض المنشورات بدون تسجيل الدخول
// @name:pt      Nowcoder Web - Página inicial -> Seção "Recomendados", visualizar postagens sem login
// @name:it      Nowcoder Web - Home page -> Sezione "Consigliati", visualizza post senza accesso
// @description  在牛客网Web端首页的"推荐"栏目中，无需登录即可直接点击帖子标题查看帖子内容
// @description:en In the "Recommended" section of Nowcoder Web homepage, view post content by clicking post titles without logging in
// @description:zh-TW 在牛客網Web端首頁的"推薦"欄目中，無需登入即可直接點擊帖子標題查看帖子內容
// @description:ja ニウケ（Nowcoder）ウェブ版ホームページの"おすすめ"セクションで、ログインせずにポストタイトルをクリックしてコンテンツを表示
// @description:ko Nowcoder 웹 홈페이지의 "추천" 섹션에서 로그인 없이 게시물 제목을 클릭하여 내용 보기
// @description:fr Dans la section "Recommandés" de la page d'accueil de Nowcoder, consultez le contenu des articles en cliquant sur les titres sans vous connecter
// @description:de Im "Empfohlen"-Bereich der Nowcoder-Startseite Beitragsinhalt anzeigen, indem Sie auf Beitragstitel klicken, ohne sich anzumelden
// @description:es En la sección "Recomendados" de la página de inicio de Nowcoder, ver el contenido de las publicaciones haciendo clic en los títulos sin iniciar sesión
// @description:ru В разделе "Рекомендуемые" на домашней странице Nowcoder просматривайте содержимое публикаций, щелкая по заголовкам без входа
// @description:ar في قسم "موصى به" على الصفحة الرئيسية لـ Nowcoder، عرض محتوى المنشورات بالنقر على العناوين بدون تسجيل الدخول
// @description:pt Na seção "Recomendados" da página inicial do Nowcoder, visualize o conteúdo das postagens clicando nos títulos sem fazer login
// @description:it Nella sezione "Consigliati" della home page di Nowcoder, visualizza il contenuto dei post facendo clic sui titoli senza effettuare l'accesso
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description:en    Nowcoder Web home page -> "Recommended" column, click the title of the post to view the post without logging-in
// @author       aspen138
// @match        https://www.nowcoder.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482668/%E7%89%9B%E5%AE%A2%E7%BD%91Web%E7%AB%AF%E9%A6%96%E9%A1%B5-%3E%22%E6%8E%A8%E8%8D%90%22%E6%A0%8F%E7%9B%AE%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E7%82%B9%E5%87%BB%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E6%9F%A5%E7%9C%8B%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/482668/%E7%89%9B%E5%AE%A2%E7%BD%91Web%E7%AB%AF%E9%A6%96%E9%A1%B5-%3E%22%E6%8E%A8%E8%8D%90%22%E6%A0%8F%E7%9B%AE%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E7%82%B9%E5%87%BB%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E6%9F%A5%E7%9C%8B%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 隐藏登录弹窗
    function hideLoginModal() {
        // 假设弹窗有特定的class name "login-dialog"
        // 这个selector可能需要根据实际弹窗的HTML结构进行调整
        var modal = document.querySelector('.login-dialog');
        if (modal) {
            modal.style.display = 'none';
            console.log('登录弹窗已隐藏');
        }
    }

    // 页面加载完成后隐藏登录弹窗
    window.addEventListener('load', hideLoginModal);

    // 如果弹窗是动态添加的，可能需要使用MutationObserver来监听DOM的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideLoginModal();
            }
        });
    });

    // 监听document.body的变化
    observer.observe(document.body, { childList: true, subtree: true });


    // 通用函数用于移除URL中的特定查询参数
    function removeQueryString(url, parameter) {
        var urlParts = url.split('?');
        if (urlParts.length >= 2) {
            // 参数键值对数组
            var params = urlParts[1].split(/[&;]/g);
            // 搜索特定参数并移除它
            for (var i = params.length; i-- > 0; ) {
                if (params[i].split('=')[0] === parameter) {
                    params.splice(i, 1);
                }
            }
            url = urlParts[0] + (params.length > 0 ? '?' + params.join('&') : "");
            return url;
        } else {
            return url;
        }
    }

    // 监听所有点击事件
    document.addEventListener('click', function(e) {
        console.log("点击事件")
        // 确保点击事件是针对a标签
        var target = e.target.closest('a');
        if (target) {
            console.log("点击a标签")
            var href = target.getAttribute('href');
            // 如果链接包含 '?sourceSSR=home'，则移除它并导航到新的链接
            if (href && href.includes('?sourceSSR=home')) {
                console.log("捕获成功")
                e.preventDefault();
                var newHref = removeQueryString(href, 'sourceSSR');
                window.location.href = newHref;
            }
        }
    },true);
})();