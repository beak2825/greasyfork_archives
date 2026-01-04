// ==UserScript==
// @name         Мовний щит: переклад результатів пошуку
// @namespace    https://constantine-ketskalo.azurewebsites.net/uk/project/46
// @version      1.4
// @description  Визначає результати пошуку москальською мовою. Коли знаходить, то робить їх сірими. Якщо біля результату пошуку є посилання "Перекласти цю сторінку", то підсвічує її для кращої видимості. Попередження! Для того, щоб коректно відображалось це посилання "Перекласти цю сторінку" і переклад був саме на українську, знадобиться зробити правильні налаштування в інших місцях: налаштування пошуку гугл (на сторінці https://www.google.com/preferences?hl=uk&lang=1), можливо також мова браузера і облікового запису гугл.
// @author       Constantine Ketskalo
// @match        http*://www.google.com/search*
// @include      http*://www.google.com.*/search*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABMtJREFUeJy1lG1MW1UYxwf2wkaE4htZ1A9mH3TTTBdjYF8Uv7j4smhi5lw23MriCxLiGOgS5zKURGfUwTJAYBtZ0DgGtFBkKy8DtyUwCh2MlbcKAikdby0vK0XA3vb+fe5tLYX20hbwJE967sM5z/93/s85bNgQ4Ih4+7cg6YHSHdJDitORsrIein7pQcVPlHsxfE9RcKD1/BqPvXc5mASiIw8psiNlCn1kfBlHAY+QlQ0RWHbEgdLYzftK1gYT/vrFIGmc/E0qWEiiww6Rck9R8TBIZYpfCGZ3+K6CIL9EI/YUhUTEyXfTxhI6zZgvkScSKrAl6YoPkHIItWQKeWScfP/D+0pCRQHotMUBnBBJFzRIK9YG4goP9KUoAFGWe9t0qqwTB7NueeS/o3xx46BH/q1TN3Hy8l0xgBPiDogAXPyjD3Pz83j3x4Yl+fRSLQqv9zu+DztyezMaYJmbx8/Vfy6tc9gV4gBiDhTU9aH33hTGp2fx9JGrrvw3ZP+52l7X95MJv2NkcgZ3/jIhZznAYgQOcKGuF8pmParaDPhW0eHKp5HN+TWLQj8ou1DVakCOSoecKhEAHw4ovQP0CQDvZzage2jSlf+qqB3nahYdaNKNUQsakUUAHi3w0wEXgNQZ7gBRH5bDbJnD5o+VDoBL7UtaMGQ044UvqpF1dR0AvDnAz4cnZvCM8x5kVHajwpl/KrESM7ME95FScEC0BWsFaOs34ZWTdcK8UjMEncHRkti0egyNm4X5qgHoH5HIJXQAxByvhX78Pj7IasLWZBUmzbPC8+Qdic9RY4Tc2f55FQH0EIBufQE0veNoHzAJvd12VIX0Ei25YcTNzhGcoMv4bEqV8Fxb+4yopteSrVoFQPTR3PKY1FzEpFCk5iE6xRHyBi2s8xOwLtxHYq4KL6UUwGAy46yyHsl5CoxNWbDzWCGOnL8mrLHOjeLX+jZat1gjmmpGU02qKw4ADSPHbQbLwzaaB5tJTr/5YGfuwma8BKtFB7RK6e8SsGYtWGMRrDMdsN37HrbhTIozHnWcsSJAPl9wedjG8gUA3A6FfSCB3JgSgp1uBDuhorlJcMg+8CmtCSPxDCeAxCkqWZxrmGPiAC0hid4BzjsB6Lstgmw2g+vcAXaqlhzpAKfdCus/ZuBOlLDGLgBketQRQsPsFQdQb3qcFnGeAAWw/q0niDI6cSWs1gWal5D1rWAtXWR/MQHMCW7wa/j22IZPewEgB5qZ50QBHG2QXFu+ket5Ffb+eAqZ8Ms7YDN8DdZUTG24Drv+OAFYhPY41sWD697p7fQ6W2P4AysDtDBveLXOrZ/s9A3YBz+DTZ8qXFD7YBKdvsKz38v3aphPVhTnB9e0UUIb+sQhHI5Y540kqgQ7qRKeHdcTK7reGaNcc8hDPgEEF5pDdnm7C+5hH0ymVljI+gWaJ/oS50+/3y9xlxMa5oyvolxXDOy61/wRL+TUYSv33gNAzYTQhazxWdynuKQJaiYsIHE3iAeJ/tYaALRoCX10VeL/DTQFbyKIylWc/AbdpUfWJO5ygn8ZLUwyFWb9E2fOcurQjesi7j6o8Mt0ssEVxM1cC/POugu7D3rL/L1IJzGrmzBHYLlkedT/Ku4+qCVbeKspqmn+/Grr/Au54gQq+z+WbwAAAABJRU5ErkJggg==
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAADC5JREFUeJzFWwt4FNUVVtndhMDuJiAUpBK+FsRHLbSliNVW+aAWtTwC4RGCJATEilCqqBSUl/gpAVREW4vloUUDWfJCQFEQJRCyyZJACJDwSCAQA0mAPMhmX9k5PffemdlHZpOZ3Wz2ft/5dvbOvXfO/99zzj1nNrnjjhA0feyOfrr4XUv0CekFKGd0M3at7x6TMjAUunRK0437UqWdlnq/fkbafP3M9AP6xAxb5KxMiJyVwQteJ2aAfmaaSf9c2ip9nGG4NnZHRKj1Dqj1i0vrgiAG4U4n4y4XIWg7BZuU6QItEJCU4UYGFSfOqdDNSNusn5I6TDfuC02o8chqvSbvVOviUh/HXSSgCyLpTgsgM71BypPEDAeudR7X/Ff3OMPYPtMM4aHG6dF6xe/q0n2KYTgq+A7KVQ+z9hCl4CXmoKUgGU3oSht103eN6TE+JSwkoLVjtnXRTUkdjf78GSp0TREIyXsKCErirYmRcVs3Mz0D40uC9qktwXUT7aSUntrphrEI+hN8cKVixYMqmYSMOtTNoIs3JOqm7ozuEfNFl4BB62J3RGrjDNOR5b0YxG51tOJ/XHYQ4jbkdACRXvMTM8yRCekmfdyul6OmGfr1T8i6UzF4/dSdQ/SJ6bXB2rUoNOPvi6rgzOWbEBVE68CNa0TrGKB896elPho0k0X/ffDlr6GxqRnsdhvErD2ieL6sfjFeZCpPsrRTU0coUepnz2fB+1+dhQEv7ZFlro+9eZCCt9ut8OrnhbJAkmcs3n4CRr/1gzKikjKUE9B9yk5FBPSbuxscDhvkllyH37y+v93xI5YeEAlYRAhoBdjTrwf+fS9s/7GMjp/83lEFFpNJ3E05ARGTdzyihIC+c7IoAUTBK9UNMGrVoVYg3GXY4m/BwRMwf/NxN5PNaJU0/WL+HjhZXssTZoPY9UfbXNuDzCS/LWCHIguISkxHAuwUEJHya/UweOHXPpUb+tp+EVDSv/M8QfNjovDz3he/gh9OVYljiUwkBEjFgSQP0HQ+6/MrBihzAX1Cmrij5mYLVTTn7HXo4UPRoa+6CIj/8JjPdddmnqFjmszNYLFYXATI8f8kwQX8sADFBMwULMAGi/9XCDV1TfR6/maT5HhKgI0RNv2DHLZbEmOakEybDePE1gKouN7ACFin+NQIfhDUzUwTCXhy5fewcV8JvT5+oQbueWF3q/FDFn1DgREC4t7PkVxTCHony2rhvgV7eQKsygjwNwboFB6D+pmCC9hg5MpD8BCe8wSgFSXx49xW4x9GAixWKx0/7b3WPh09bw80o8nbEPAMdJEB876Ciup6ngCZp0Agx2BknOEPyiwAXcBuFwkgfT8WV1GFPzt0sdX4h175BgG6EeB1f8bGY+giLJj2wSM2+sU9SABzgUlyYoA7AbP8IECvMBPUucWAkegCpG8W7jwhoKj8Bn3jw8ayaE8ywSY+WE6XcIEPMKkic4kbCBbBCLDKJ2BWkAjQtxMDBAIGL9xHv1fdaISf43HmPv6BdgjIMl6mYF/eVsAIwPlCEJykNAgGgwBBPAiwexIQiblBA+b7t/EIe+Af+zxdAAkQXCB+g+cxiEUY5J2rpgRMSM5uTcB6pQT4kQcodQGthAUQOX35Bu177I0DHuMfWfKdmAcs3Frgca8fnhrE98k9kjGKBFR34jGIBCgMgtIEfHeikvZN9vLbmLXZYi2wLuuMxz0CupbPI/piAcQI2OM/AZ0TBN0JOCT2bz14gfYt+K9nQrRgi0lMm1OPlHvcG7fmMFjxiKysaaDuQAkgQVBIhJSXz51EgHcMQFllOEX7Nu4t8Rj/8delIgFFWOi433vx03w6h1SWQp+7C0i9P5AKzAFZQESssmrQFwEkihOQ+wuuin190cdZkGMuQBKee//mOiVW7zpFc4BMY4UXAfU8Adk+CZAkwh8LiIhNUU6Alwu8kXISbjWaKZiLVfVw9+xM3sSzaZZIiqY6/v4L/8kT1/rycJlYVL2TXkzrhPYI6PAY0HVSYASQ9wFCqkvAb8FY0JevCTZ9e54CJFbwOWaJ5JqYu/BucPnOIlpJkrmEhDlYLpMgeJm4AJLliwCfbuCPBUgS4OtdnIcLWGE3mu6xEgbAWFrtUQz1npMFN+qb6LjnEdhTq38Qy+jxawgw13sBw9FL/AuWetiORNXfNtM1hdwguBag0AX0CXwqbHO9uCDiXQe8ZWD+XVnbAP3nMb//trCS9pEjs8dsFwELtxxngdLmJm7JkTyhv0wpJ+DpRauHxyxPhpgVayBmOZFkmLCcXU9Ywa4n0L5kGE8+l60BO0+Ao/4oOBpZ9C8u/wmeXroenn1zLYxb8Ym4+9/nZ8NfsY/IW9u2Yp+FpsazN6TBmDfWoayHvcazDLS5Ahw3MXGyNtK5SzfvpPPGLkuGccvXwvhlbnpQvXjdUE+GIVk5Adwx1SNwXA2yxaQRd5078yg4z09k36114CxLwjFdoeXKMtZnvgJc0X04xzXfcfMABeu4dRC/R4DzzAiwW2oooS2V7wIU9gZ70yW2fukz8vVi4gcBxvBfsckqGQ9QuQiwMQKgIBKtoJgnoZFdIyAS/R21GXi/m2suSkvFCuY+VvRzOraWfb99HriT0SIBZD5X+qxvPaT19YeAyN6ei6q8HuB9HeZhAbS/EEm4uZ++1GA+bHP5csMJCowr6IFj9tJ7BJwgdC10I67ofn6tXkhAOU/AMz70kiDAhN/zuvj31ydoos1tg3eXbl4ECP0aau6OBhNv/ljmWm4yEprwvL+Vze88HnG3S/ldLwHu9HCmPLUulQ8CpHbfS1eT2gx54ff4SYDqdPsWwEtBdx8E4NiCCHA0ldJ7zvJ54EQTJmCYRTAXcV6YBlzJKBb1LdeQtGjP9ZEAB4kBsizAQ9efuGP6bv4RkB/2qewHoc/7IoA7eQ+CYmUxd3oo7XdejBfHt1R9xMae6AMOC0uRubNPeBHQ242AMfIJMKmz/QJPCTCGxcp+UGEPEZCz7AUE8CdRnOdjUPEGPoKPAe7UYLbbNjM/Pon1CZGf9F1ayM9/goqzdCzYm3/iCfiz3N0HyFd/6DcBXK4uChdyth9wCAE9+VNASFi8rtsTGgRtboHS1ych4C/t6yNYn1E90W8CqBWgCckigLgAnu80yBH/5sVBP4npsp/CqSs0V6Fc58thvs98DfuqxWzPbr7K5pkvsU9B8Dt39km5FmBuydFGBkQAl6eeJ9vc8NiDQh0NiPScp59E9EjEOebvFa+hr98NXPHDLPIjYGfZLOzrhW4xmg+CNRgEB+M8rYSQ9TRtRH6XcPnqTQGBpwTkhvdBK7gkP+pKS0tNCiXAUXeUKYdR3m6tp6btvDCVBcaKxSyVrk1HkOEyTLwdMYb9LmACSMNA8rZ8sFLZo4r6LXUDmwVPgmFuBFgZAbi7JPFhFjGnDbBtnftu903qk5CrUf63QVKNWsFxdV1gVqDBPP873gqyMeo/yAiwMwJarm0SCx9yogRqcVye5rkOAS+SkKd+HRfmAlKqeCgPGkm4dRgB32bXNQYGniZEca45Jj+fZVIfgFx1x/6tMZerDUNXKFDkgxLivJjAzn/+p3HhaCMpbkvlGmU+Lu0CdjCqH+9Q8CIJxrARyK4tUPN0ls3lS12BAAuWyiswDnQN3PTzNR9xh3Ud4/uSJORr/hmokrRAIpkglrrk7G8pnw+kmgx4XZP6BGeMCOzcb6+1nEu6E0nICpwEFS2S4ETgAY+BV9WBMXxQUMELDdPLvpCvyu0QxTsGvAX9/slOAS+SkBv2S3zw9eABkx0MHZCnealTwYskGNW/RRKuBB65/RYnluyLQwJeaJAfPhJJuBHkXZYaj+C7vM0dU4X+32kg965BGIHlu4O/CY5LbGj2iyA3iMed0oYxYSCSEPzAaFI1Qb4mPtR4JRvWDFGYLWZCgClzG+CvYjL2+1DjbLNBTpga8tSvoMI+iie/AiaH1pXCGbv2DzU+2Y3LCx+CO1bSATvfjJXdEmfevYH/D1BnNzBGqdAaViMRdv9MXl2Cu/7rUOMIuOEODsPM8Qi0+4JV9PVqJG6lM0cbmv8LDEbjjoarMHrPRYA1bYB34K7vA6MmOtT6Bq1hFO+JJ8Uq3GVPIvJVB9BSRnE53e8KtY6d0iC3GxZU6hSUYs6omRIqPf4P9q+DHcAq2o4AAAAASUVORK5CYII=
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534950/%D0%9C%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D1%89%D0%B8%D1%82%3A%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%B4%20%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D1%96%D0%B2%20%D0%BF%D0%BE%D1%88%D1%83%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/534950/%D0%9C%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D1%89%D0%B8%D1%82%3A%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%B4%20%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D1%96%D0%B2%20%D0%BF%D0%BE%D1%88%D1%83%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Унікальні москальські літери
    const moskalUniqueLetters = ['ы', 'э', 'ё', 'ъ'];

    // 2. Часті москальські слова без унікальних літер
    const moskalCommonWords = ['и', 'что', 'как', 'да', 'нет', 'она', 'они', 'из', 'с', 'к', 'года', 'также', 'или', 'будет', 'время', 'их', 'после', 'есть', 'более', 'только', 'еще', 'всегда', 'может', 'если', 'тогда', 'где', 'когда', 'здесь'];

    const ismoskalDomain = (url) => {
        const hostname = new URL(url).hostname.toLowerCase();

        return hostname.endsWith('.ru') ||
                hostname.startsWith('ru.') ||
                url.includes('/ru/')
    };

    const ismoskalText = (text) => {
        text = text.toLowerCase();

        if (!text) {
            return false;
        }

        for (const letter of moskalUniqueLetters) {
            if (text.includes(letter)) {
                return true;
            }
        }

        for (const word of text.split(' ')) {
            if (moskalCommonWords.includes(word)) {
                return true;
            }
        }

        return false;
    }

    const formatStylesForSearchResult = (result) => {
        const mainLinkElement = result.querySelector('a:not([hreftranslate])');
        const translatedLinkElement = result.querySelector('a[hreftranslate]');
        const contentElement = result.querySelector('div.VwiC3b');

        for (const element of [mainLinkElement, contentElement]) {
            element.style.color = 'gray';
            element.style.textDecoration = 'line-through';
            element.style.opacity = '0.5';
        }

        if (translatedLinkElement && translatedLinkElement.getAttribute('hreftranslate') === 'uk') {
            translatedLinkElement.style.fontWeight = 'bold';
        }
    }

    const redirectClickToTranslateLink = (result) => {
        const mainLinkElement = result.querySelector('a:not([hreftranslate])');
        const translatedLinkElement = result.querySelector('a[hreftranslate]');

        let translateUrl = '/';
        let ping = null;
        if (translatedLinkElement && translatedLinkElement.getAttribute('hreftranslate') === 'uk') {
            translateUrl = translatedLinkElement.getAttribute('href');
            ping = translatedLinkElement.getAttribute('ping');
        } else {
            translateUrl = `https://translate.google.com/translate?hl=uk&sl=ru&tl=uk&u=${encodeURIComponent(mainLinkElement.href)}`;
        }

        mainLinkElement.setAttribute('href', translateUrl);
        mainLinkElement.setAttribute('hreftranslate', 'uk');
        if (ping) {
            mainLinkElement.setAttribute('ping', ping);
        }
    }

    const searchResults = document.querySelectorAll('div.MjjYud');

    for (const result of searchResults) {
        const mainLinkElement = result.querySelector('a:not([hreftranslate])');
        const text = result.innerText;

        if (mainLinkElement && ismoskalDomain(mainLinkElement.href) || ismoskalText(text)) {
            formatStylesForSearchResult(result);
            redirectClickToTranslateLink(result);
        }
    }
})();