// ==UserScript==
// @name         轻小说文库美化（微仿番茄UI）
// @namespace    jiangboqu
// @version      1.02
// @description  给文库8的UI爆改成番茄的了，但是要配合轻小说文库+使用
// @author       jiangboqu
// @match        *://*.wenku8.net/novel/*
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD/igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//rlB//3HaP/858P//OfD//znw//858P//OfD//znw//858P//OfD//zitv/91Y///dWP//3Vj//9y3X//cdo//3HaP/9x2j//cdo//zitv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//znw//858P//OfD//znw//9x2j//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6cN//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//3ZnP//ogD//6IA//+iAP//ogD//sJb//3HaP/83qn//OfD//zeqf//pw3//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+rGv/90IL//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//cdo//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//OfD//znw//858P//OfD//znw//858P//6IA//+iAP/84rb//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//rQ0//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//3Vj//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//6wJ///ogD//6sa//3HaP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//+iAP//ogD//rQ0//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//zitv/+vk7//6IA//+iAP//ogD//6IA//+iAP/+tDT//OfD//znw//858P//OfD//znw//858P//rAn//+iAP//ogD//ct1//3HaP/+tDT//rQ0//6+Tv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//ct1//7CW///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//65Qf//ogD//6IA//3HaP/9x2j//6cN//+iAP//ogD//r5O//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//60NP/9x2j//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//OfD//65Qf//ogD//6cN//znw//858P//6IA//+iAP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP/858P//cdo//+iAP//ogD//dWP//3Vj///pw3//6IA//7CW//858P//rQ0//+iAP/92Zz//OfD//3Ldf/+tDT//OK2//znw//858P//N6p//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//7CW///ogD//6IA//6+Tv//ogD//6IA//6+Tv/91Y///6IA//+iAP/+vk7//OfD//+iAP//ogD//6IA//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//dWP//+iAP//ogD//6IA//+iAP//ogD//OK2//+rGv//ogD//6IA//3ZnP/858P//6IA//+iAP//qxr//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//sJb//+iAP//pw3//rQ0//+iAP//ogD//OfD//znw//+wlv//6IA//+iAP//ogD//6cN//3ZnP/+vk7//6IA//+iAP/90IL//OfD//60NP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//84rb//rAn//+iAP//ogD//6IA//+iAP/+sCf//rQ0//+iAP//ogD//6IA//+iAP/9x2j//OfD//65Qf//ogD//rAn//znw//858P//rQ0//+iAP/+uUH//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//r5O//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/9x2j//6IA//+iAP/9x2j//OfD//6+Tv//ogD//6IA//znw//84rb//6IA//+iAP/84rb//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//+nDf//ogD//6cN//60NP/+vk7//ct1//znw//+wlv//6IA//+iAP/858P//OK2//+iAP//ogD//dmc//znw///pw3//6IA//6wJ//83qn//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//+iAP//ogD//dmc//znw//858P//OfD//znw///pw3//6IA//+nDf/83qn//dmc//+nDf//ogD//6sa//znw//92Zz//6IA//+iAP/858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//N6p//3HaP/+sCf//6IA//+iAP//ogD//6IA//+iAP//qxr//dmc//3ZnP//pw3//6IA//6+Tv/858P//dmc//+iAP//ogD//OfD//znw//9x2j//sJb//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/+vk7//OfD//znw//91Y///OK2//znw//858P//dWP//3Vj//9x2j//rlB//+nDf//pw3//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//3Ldf//ogD//6IA//+iAP//ogD//6IA//60NP/+tDT//cdo//zitv/+tDT//rQ0//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/83qn//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//dmc//+iAP/+sCf//OfD//znw//858P//dWP//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//zeqf/858P//OfD//znw//858P//rQ0//60NP/+tDT//rQ0//60NP/9x2j//cdo//3HaP/91Y///dWP//zeqf/858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=

// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524692/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96%EF%BC%88%E5%BE%AE%E4%BB%BF%E7%95%AA%E8%8C%84UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/524692/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96%EF%BC%88%E5%BE%AE%E4%BB%BF%E7%95%AA%E8%8C%84UI%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        body{background:#DED9C5!important;}
        a{color:#0066CC;}
        #content {
            background: #F9F7EF !important;
            max-width: 900px !important;
            color: #462e0b !important;
            margin: 0 auto !important;
            padding: 80px 90px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            font-family: 'Microsoft YaHei' !important;
        }
        .new-title{
            font-size: 20px;
            padding:0 0 50px 0;
        }
        #foottext{
            padding: 10px 0 0 0;
        }
        #contentmain{
            height: calc(100vh - 66px)!important;
        }
    `;
    document.head.appendChild(style);
    // Observe DOM changes using MutationObserver
    const observer = new MutationObserver(() => {
        const targetElement = document.querySelector('#content');
        const titleElement = document.querySelector('#title').textContent;

        if (titleElement) {
            document.querySelector('#title').remove();
            const newChild = document.createElement('div');
            newChild.textContent = titleElement;
            newChild.classList.add('new-title');
            targetElement.insertBefore(newChild, targetElement.firstChild);
        }

    //     此处remove
        document.querySelector('#adv300').remove();
        document.querySelector('#adv4').remove();
        document.querySelector('#adv5').remove();
        // document.querySelector('#footlink').remove();
    //     document.querySelector('#headlink').remove();
    });

    // Start observing the DOM for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();