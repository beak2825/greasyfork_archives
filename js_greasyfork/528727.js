// ==UserScript==
// @name         JAV跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页上生成互相跳转按钮
// @author       s_____________
// @match        https://javdb.com/v/*
// @match        https://www.javlibrary.com/cn/?v=*
// @match        https://fc2ppvdb.com/articles/*
// @match        https://fd2ppv.cc/articles/*
// @match        https://missav.ai/*-*
// @match        https://123av.ws/*/v/*
// @match        https://supjav.com/*.html
// @match        https://sukebei.nyaa.si/view/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528727/JAV%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528727/JAV%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 网站配置
    const sites = [
        { name: 'JavDB', url: 'https://javdb.com/search?q=%s', domain: 'javdb.com', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaUlEQVQ4jXWSuWtUYRTFf9/33izJxCiJiVtkCqMEBC0MFhqRqKiN+A/YREHtrWxSCanUgI2FFgEREUECwSUaLNSpXOOSoGgRoqIjiZJl5r33ffdazBIDeuGW55x7zzlmgUvrE/xVoEch4J+jKIIigEfxXvCFADlhfjF4Fzj8byBVkNQJtEKA4FHcWAj0/E9TjaLNIazNQr4JLc4jL7/9TdITKgSmCpIdrdihfZCxmGyAzaUQr7jvc2hxERl6i3k5Xb8AfGCXyb6eITr7FFGhfOg28fUJ3JVx9MAt0l1t6OhnBIfg6iRh/eR1DZijeVIoOCVzbheasWji4UIv/ucCwZFOMEoy8h6ZngV0iUCaQ3zXCnACwx+xeztIbW0HIHrxBT8yCZub0dAghTQ6XTHVzDK4CNJQc1taU9j+nWhvBzL1G40SbH4VvCsSX3yMf/UFRRCUBOdsPaJ8I5zfTTh+jGRDlvjkHdzzr/gXX4lODROXSzQ8OE7jk9OYA5uISSgbT1iJRHB72qElQC4/I9O3neRMN8GW1eA8ybY20t0bmR94CNmAUlyibD2Jgq2Vw16bwPTdI3CKvPkBN97Dpxl0sojefIuMfyNY08TCwCilJ59I0IqJWo9EUBwWRXMhrrMZszKDZi3SuRJZkcKHUDIVydpYWaolisfPzhO0NBKmQ6wxWGsIsmnClhylqZllYADznf45xTfViiGhovvz0JZDU+AREueIi3NEYx8wfonAKFGo+ILgD9b6rU7Q+x8RPLFxREaq/4Jh+QhasCmSE4IfE3ykiANxHu8inCsjLlF11f/qa5RIVR9Zpe8P/Xx6qq8WvFAAAAAASUVORK5CYII=' },
        { name: 'JAVLib', url: 'https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=%s', domain: 'www.javlibrary.com', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAWVJREFUOE+l088rhEEcx/H3zHqkHu0SSjk6KCXadld+FCclJ5KcHBxc/QkuytFf4MSNlCS0KZJEKVKSg5/ZsmtDya+dnZHnEZ72YdvMcX685jPfmRGvJXHDP5rwBaRANJRizp/hQf3J+wJFc43InipM6g3Vtou5evkVyQXsAMXJTpDCWaRGjtDTiQIAoGi+CdldiUlnUK07mMsCE8jBakSdTXbiDO4yBdRACqzNKCIcRC+mUAMHee/HUwNRb2PttTiL9FIK1e8DCJDDNeipa2eeFwgHsbZiLrB8i+rbz0kg2svADmBW0z5AJIi1+Qms3KJ6c4HAWC3Z8VPIuu/PmyAWwtqIugnW0pjHLHryApJvoMFog+yq+IqfCzSHsNZdAG2cQuqFFLKjHGyJOXtBzyQwJ09fR/Mm+An41F8NHaJnbzwjXiAaxIpHQOK+xI9jauPsqEaPMdv3bt+P5v+Z8t7+94R/A++1dabBas/DygAAAABJRU5ErkJggg==' },
        { name: 'FC2DB', url: 'https://fc2ppvdb.com/articles/%s', domain: 'fc2ppvdb.com', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB10lEQVQ4jaWTP2gTcRTHP79rc20hwt1eBUmb4hDTxlJoM9jidbYITiWCWMHF0aEENEv2LI1zty5S6NxBXKVcaEOJR4MiF8KlTcSECvnjPYeYQ0kdUr/j433/vPd+P2UYD16DSiuFzggQoQOSVYZhtUcl/ymiXZcMoBT6OMDqagJdD+H7guvWKJW+BE3h8BQrK3d/Owqe16BYLOP70m8wTUs8ryHN5qWcn38T3/fFth1ZWEiJaVqyvPxMRESq1QtxXU+63Z4Ui2WJRB6JaVqiDZxyuT2i0ccsLT1lYiLE7u4blFJBklQqQyy2SSLxhNnZm2xs3AcgEBigXK6QTr8lFoswPx8dmrvX+4kItFo/ABi/ajm27QAwMzPNyckZADs7r2i3O0Qi01QqNQ4OPlydAEDTVLC0Afb335PPvyOX28MwbpDJPP93gsXFOwA4ztegdnj4kaOjUiC8tfWQ7e38cIK5uVtksy8oFByOj8+GxMPhKZLJONVqvV8YnLHVupR6/buIiNj2J4nHN/86o+c1xHVr0m53pFq9kPX1l2KalijTtGRt7R66HkKk/5BOTz8POQ7QaDQpFBy63R4AyjQt4T+g9X/V9SBCZ2xy8rYGKqkUY6OSQbK/AEsX5PZm3KxvAAAAAElFTkSuQmCC' },
        { name: 'FD2', url: 'https://fd2ppv.cc/articles/%s', domain: 'fd2ppv.cc', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR4AcxQTatBURRdKYl856NkpsjHSIxkokwUU6VkJmVgzL9RimRAFCbKyD8wEmaUGOje2a373trlvt70GTyn1u6cvfZZe+1tcjgc+jsw4c3zQQJerxcvOJ1OeDweebtcLmNIu92OaDQK8q+kMUK9Xke5XEapVEIymUShUBDUajVUKhWEw2GwJp1Oo9FoIBQKiYYIuN1u6bhcLjEYDLDb7bBarTCZTDAejxGLxRAMBrHdbjEajcRBPB7/EYhEImKX3avVKmg1l8tJwf1+x/P5RCAQwH6/lxH8fj9Op5Pw4oB2bDYbHo8HbrcbrFarjCIV34GCFosF3Een08Fms8HxeASPCJjNZhDz+VzIRCIBVVXJI5PJIJvN4nA4oNfr4Xw+Y7FYCMcgAuzIDrquMwefz4dUKoXZbIZut4t+v49isQjOnc/nMZ1OweWy2MTARLvd5lWwXq/RarUE3AmXOxwO0Ww2DVCcxSJAu1wWE4SiKLhcLgJN05jC9Xr9Bf4hIQK8/BX/L/AFAAD//3BGirsAAAAGSURBVAMALwSfgSVcWbkAAAAASUVORK5CYII=' },
        { name: 'MissAV', url: 'https://missav.ai/cn/search/%s', domain: 'missav.ai', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiklEQVQ4jZWTMYsTURSFv/PyJsIyjYVgIwZEWBCLhQWttkiXxtZSdDVphDSC2E0hbGOT0hi1U/AP2AWJpYJaiRZLYNFGsXEIbGbmXYs4spPNhPVUj/fuOe/cezliCfPdvS2C70lqC7UADJua2RiXP24+ffDhaL3Kg3WTjSyLB17uFuCWhf8i5BaeRVHa1zCZ/ROwbrKR5/HrBm6nhlhBQZh4n3Y0TGYOIMviwUnJAA3cTpbFAwDNd/e2vJ16X7Hd9HDpPHzah2B1OiHX4bYn+B6q9lxcOIu/ew07+IG9GKOv31cJOILvOUntY09azFbnzuDuX8e6Hex0vKJMbVeuah3clU308Abh6mZVALXq1rXqN9TQsXtv2BR0cR05vPsCr96iX78r94ZNvZmNEVUBW0zevv3EXr5Bnw9WCpvZuHaNdrmFPu5DEWqN5TrcFsD85qMnXu72ujaWkVsYNZ/fu+MAoijtF4TJSckFYRJFaZ/StobJzPu0k1sYAbWeWYRpVOYAjqSxxP/G+Q/DgqCAoT1WxwAAAABJRU5ErkJggg==' },
        { name: '123AV', url: 'https://123av.ws/zh/search?keyword=%s', domain: '123av.ws', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEVHcEzoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPoWoPnTHr////86u7rcJLvla31vsxumYX8AAAADXRSTlMABI/QwWbZdatbB+LhLDsa1QAAAGRJREFUGJVlj1kWgCAIRTEnrMRp/3utFKyO70e8PCaARxa1xgAiH1mMME5tvzx7VA8KMWED5cwogBkgpdYJwikgpXpHBo4JculgllQu4aaNZO7eX3rHLoutq388Vs5V3jiH43sBXJIKFVYgS9QAAAAASUVORK5CYII=' },
        { name: 'Supjav', url: 'https://supjav.com/zh/?s=%s', domain: 'supjav.com', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEVHcEzYHR7YHR7YHR7YHR7YHR7YHR7YHR7YGBnYHR7YHR7YHR7YHR7YHR7YFRb///7YGxv66OLWAAHcQjrYEQ3eT0n0zcXfWVbaMSrvtKn++PPmhHTojYHso5jjdGnywLb32tQ9ECutAAAADXRSTlMACTQor8/ivnve31M1kcVDMwAAAJVJREFUGJVVjtkSgjAMRaOC4kLSpHsLxf//SoMjI5yn5EyWC/DsH/eNa3eC13igh2EcjdkZFc4ZMTvhGnNGNAYNIqpAypWaT8knHy3qROGWIvmZMzF5FTbQPLG81QhNMIRZAodsqVK168REpbSFuGhBi+iKnpIUrV2Cjc5ojvWZfpRQBb/BNhz+kh6By7HvAM7d7c8AH0moD2mL5UH7AAAAAElFTkSuQmCC' },
        { name: '115', url: 'https://115.com/?url=%2F%3Faid%3D1%26cid%3D0%26old_cid%3D0%26old_cid_name%3D%25E6%25A0%25B9%25E7%259B%25AE%25E5%25BD%2595%26search_value%3D%s%26ct%3Dfile%26ac%3Dsearch%26is_wl_tpl%3D1&submode=wangpan&mode=search', domain: '115.com', iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATNJREFUOE/Nk71LQmEUxn/nfW83+oAInAIhgmiMFpemKKqba3NgW0sQ9E3QEohBH2tDi9DUJqgtTf0BNjREoEsQEQgNhaT39Q3pA+MKZi6d/fx4nuecR6y1ljZG/i9gZPaAsqp+mxOEq+QyAyEXqbMcsFBbKTyV8WInzETC9PU7IIYup4edpalAWsEMrE94Lk6owyGX2gQrIF9KVHPA3aOPF0ugrIsRwZUSt+ktEKfhrQIKLFUMiociTC7E0b6lohzymXV+mP/EBQAG0LXPEDD4nJ3n2Du9pKQc7jOrzS0EdfoMRY/BaAoXK38BwLCXoBZjPrvRGsBg0LbKYPSQXlvkJrvfGuDFwuj0Ed26wnV6Da3rX+iD1aALr+SfFdu7SSbGx1icj+CqN6Dzd2dstZhtt/EdTYWR0Vt/OQgAAAAASUVORK5CYII=' },
        { name: 'Nyaa', url: 'https://sukebei.nyaa.si/?f=0&c=0_0&q=%s', domain: 'sukebei.nyaa.si', iconBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEHBgkIBwEKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NTc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABAAEAMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAGBf/EACYQAAIBAgQFBQAAAAAAAAAAAAECAwQRAAUGBxIhMUFRCBMikdH/xAAXAQADAQAAAAAAAAAAAAAAAAADBQYE/8QAJREAAgADBgcAAAAAAAAAAAAAAQIAAyEEERIxYfEFFCIyQVGR/9oADAMBAAIRAxEAPwCFTpoZY0eXRCn4g8NuuLkImERJO0wsfEM6bLNqZ8snkm2BpiIIWsWjAIJHQDzc4Vz2CnpOcCZZ/cDQGv2JGXaY3SqcuoKxN1qEipUWjaoCsgt3v2tz8jBTxCShKG+kM+SmsA3uHc1d6fMj0r7FVqyllmWmZFeBwzcTBvrmx5/uFD4rTPLKbhrptG9QtnlAMK6Z13j/2Q==' }
    ];

    // 获取当前域名
    const currentDomain = window.location.hostname;
    const currentSite = sites.find(site => site.domain === currentDomain);
    if (!currentSite) return;

    // 提取编号
    const extractCode = () => {
        const title = document.title || '';
        const patterns = {
            'javdb.com': [/FC2-(\d+)/, /([A-Z0-9]+-[0-9]+)/],
            'www.javlibrary.com': [/([A-Z0-9]+-[0-9]+)/],
            'fc2ppvdb.com': [/(\d+)/],
            'fd2ppv.cc': [/(\d+)/],
            'missav.ai': [/FC2-PPV-(\d+)/, /([A-Z0-9]+-[0-9]+)/],
            '123av.ws': [/FC2-PPV-(\d+)/, /([A-Z0-9]+-[0-9]+)/],
            'supjav.com': [/FC2PPV (\d+)/, /([A-Z0-9]+-[0-9]+)/],
            'sukebei.nyaa.si': [/FC2-PPV-(\d+)/, /([A-Z0-9]+-[0-9]+)/]
        };

        const [fc2Pattern, normalPattern] = patterns[currentDomain] || [[], []];
        const fc2Match = fc2Pattern.test(title) && title.match(fc2Pattern);
        if (fc2Match) return { code: fc2Match[1], isFC2: true };
        const normalMatch = normalPattern?.test(title) && title.match(normalPattern);
        return normalMatch ? { code: normalMatch[1], isFC2: false } : null;
    };

    const codeData = extractCode();
    if (!codeData) return;
    const { code, isFC2 } = codeData;

    // 设置按钮样式
    const styles = {
        light: { bg: '#EEEEEB', text: '#000' },
        dark: { bg: '#1F2937', text: '#fff' }
    };
    const theme = ['javdb.com', 'www.javlibrary.com','sukebei.nyaa.si'].includes(currentDomain) ? styles.light : styles.dark;

    // 生成按钮
    const createButton = (site) => {
        const url = site.url.replace('%s', encodeURIComponent(isFC2 ? code : code));
        return `
            <a href="${url}" target="_blank" style="
                width: 80px; height: 30px; margin: 5px; text-decoration: none;
                color: ${theme.text}; background-color: ${theme.bg}; padding: 5px 10px;
                border-radius: 5px; display: inline-flex; align-items: center; justify-content: center;
                box-sizing: border-box; font-size: 14px; font-weight: normal; white-space: nowrap;">
                <img src="${site.iconBase64}" style="width:16px; height:16px; margin-right:4px;" onerror="this.style.display='none'">
                <span>${site.name}</span>
            </a>`;
    };

    const buttons = sites.filter(site => site.domain !== currentDomain).map(createButton);

    // 获取插入位置
    const getInsertionPoint = () => {
        const selectors = {
            'javdb.com': 'div.panel-block:last-of-type',
            'www.javlibrary.com': '#video_cast',
            'fc2ppvdb.com': 'div.flex.flex-row.px-2.py-2.border-b.border-gray-800',
            'fd2ppv.cc': 'div.work-detail-container',
            'missav.ai': 'div.mt-4 h1',
            '123av.ws': 'div.mr-3 h1',
            'supjav.com': 'a.btn-down:last-of-type',
            'sukebei.nyaa.si': 'div.panel:has(div.panel-footer.clearfix)'
        };
        const selector = selectors[currentDomain];
        return typeof selector === 'function' ? selector() : document.querySelector(selector);
    };

    // 插入按钮
    const insertionPoint = getInsertionPoint();
    if (insertionPoint && !window.buttonsInserted) {
        window.buttonsInserted = true;
        const container = document.createElement('div');
        Object.assign(container.style, {
            margin: '10px 0',
            display: 'flex',
            flexWrap: 'wrap'
        });
        container.innerHTML = buttons.join('');
        insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);
    }
})();