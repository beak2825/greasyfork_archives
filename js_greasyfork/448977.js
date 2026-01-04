// ==UserScript==
// @name         Douban Rating for Olevod
// @name:zh-CN   欧乐影院添加豆瓣评分
// @namespace    https://github.com/HerTio/tmscripts
// @homepageURL  https://greasyfork.org/zh-CN/scripts/448977
// @supportURL   https://github.com/HerTio/tmscripts/issues
// @version      0.1.0
// @description  Display Douban rating for the videos on Olevod. Click on the rating to jump to the Douban page.
// @description:zh-CN  显示欧乐页面上影视作品的豆瓣评分。点击评分跳转至豆瓣页面查看详情。
// @author       HerTio
// @match        *://*.olevod.com/index.php*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABOaSURBVHhetZsJVFRXmserCkFUZJE90RglGjc00bhEjRqTTDLdWXsymSSTmUknPZOkl3T3nEnSk55znO4zmXOmY6JGBFFR1CBEoPYqCgiCuMXl2C4FCqIIKIjsUBRVSL1vvu9yiyDeouoV5f+c/6kC3v3u+37e9b2rItACAGUArLqPDpJjnlbghEFFCcu1KLFAWQjCk3lagRMGFSUs16LEAmUhCE/maQVOGFSUsFyLEguUhSA8macVOGFQUcJyLUosUBaC8GSeVuCEQUUJy7UosUBYCGE087QCJwwqSliuRckFwkIIo5mnFThhUFHC95hfLlu8vCh5bxYC8GZebWCFge8BQuZ/HlLdhayo9vI3F3Za1r7QZV70Tq9xwW9surmf2/RzNtj1szfYDXM/7zUt/LDTsua51vMbpvJiQ8KYIhAiC5P3xbyqwAoDewTTcvS9R3uMCz52ahNNTnVkkzM/3AX6SQDmUABLMHoc/wxBjwcoRBsngFMd3unIT/yh15D0l87itc9amyGMh2TCekRg3BYm74t5+MAKA98F5ni9NKHHsvwfevXTCpyacCcUIgAzgtDipxqdj85DIJ5Mf9fg9UY0lTVOAqcmrqbbMOfL5tK/f4xX4643YHDIPPT9kdVqDespeOxjpy7uMpgnDkKhRPMIiBcoo5mA6dCFIXBHO3nAaZihsZe+sJpXO7w1CZOWYx4y8OoxrXm7X49gCrHrGBCKt1Yicj63Gq2hT+xu9D1vPEho10H8ma4zBkO/ZjLYNDP31xX/bibVj8lRaxImLccsmUCq6fCvZ/QYZmjBHIZgsA65LYVAEgSE4coNAUd2CHTvGw8tu8dD445gqE8NhtqtwXD1m3FQsyUIqjeNg6pNQXBliwpadoyD6rTJ7RUZj33Eb4dA3ZO0HPMwgVFH4ZOvO7VTbkMBJplPXWlE8veY4KF1eC2VsWBr04eC67tQ6NoXAjd3KKFmsxIqNqrA+mUQc8VG7q+CoFLga98ooXH7eKhMn7m/8FzTJLovUeK+miUWCHUbF/0RjOGDrQb/5cVARpiutdAMNaXRpnswp00965PLGQve+evWOf92buv0/zu/OaakYktYx83t2HJSlHD5axVc+jrIq6s2qaB5hwoupyYcP13weSLdnyh5X8ySG6u6jQs2U6JsRhKBGGm6DqfvfkP8lW5c51iP75zCQ92jS9pfPXBh14IPK1KjzzekB0MNtpAK7FKVoxpBblLArR0KqEqJvXje/ClbQ4kAeDO7ibGo2zhvMxQiHDYI+wBIi90JxyebcU7qmTPFETyMV6UDBFdmJP+uOmWSrT5FBZWClvOjsfUgoEubFdCEkC6nx5+9cCQ1iuKIIIxmVrm/6jYu+SNYcPpW+zLeoBGOSx8G3eblQ4OoXJ3OeW1xVcqU6hupSjbmiAFhd0RA5GqE1J6hhCvp0/WYsHvxKoQhMq9WvtoL1r0i6SMGZxwRjJEmiKZJ0GVe9h4P4bdOaT6aVpESe7lhmxIufSUYlzbh7xFMFQKq2aKE2hQFdO7B7pmZ/F9UHhP3eY3EKpSrhh8+nepQR7eA3scxh7oebhu6DIv+xEOMWWfz3p11ZWtES91WBXY3BEIDOIFBX0Y4BIhaz1Ucs67hAH8jVQE30sPuXDW8vozKi2CIzCqTK3v+DA3bM/k6W5mDoVczvYQXD5guZK56rS41FKq2DAIhMG5XMTgKhKOA2m0quI6trWu3AuoyEk9g4njzvnU1XpXvai987iUw4iLQ15Uxbi2cmoi+xrL35/IQAZU1dcZemq3YmMPhDLYcgjPYeuoQTn2aAm5uV4A9KwQa1av+hcqKgIw0q8RXncGZxK5OvMg2jSIYIuOu3Gaau4mHCLjOm38z9dLWSZ21COQKgqnB1nQVu91VBFOLppZThy3oxnYl3NqpAMd+BTTviamUJAn3Kd5bEa/GN3UWrX0LCnDW8nX7wFrPlE4as3iI+6KKXY9sbMWZahAMdqmRcLD13Nqpgtt4TVuGCu5kh8Jt7do3qawIynCzCnwS0rZrEk+CCcuJYIhsDgG7/tFUHuG+qar4o5k128J6G3AgZmBwnURgGlLRadhysAs2I5jWXSroQEiQo4C2/VOLqSxCGLUVsQp8UVvxq09KuIbxebWMY9QdzeSB1sNvsVnjfqsm/UEtJc/GG1wj0TqpcbuKwbm9C4EgnM7dSujeo4A+7GY92ZP6G8s/mEdlRWDcZsF9kc3wSAp7yieCIbJhHPSp405vwDUHD3FfVZuz/M32vcHQgANxYzptM3A/tjMIWrFrdSAcmsEITvdeBfTux0ajU0G3es4fqKwIjNssuDfV1taGOvKjr4FexuCMU3ufaf5/8xBC1Y+yB5Orqye+iG/YMbmjNQPhIJDbGUGs1XRg1+reHcTg9DA4Kuj7FgGp8fvBhENUFkF47GYsuDe1Fb/4pKSd7PvUnh8C/fkTXO0lL6/hIYSifZytYEZOU+lnD/NfjUmNmQlF/VnYnXaroB3dgVA6M7HVZCoRjhLs3yKcLCU4slQgHcSfsyd32iq/HnW3zwJ7k8087zP2AN3X2UsbjIDCb3RV7o3mIYRyGKZtgxMqcOgi2zpNyZ+f489v/FVLTtKfIFcBXQSFWgyCse1DENil+hgcFTgP4CyGdmVj/prxYLOsfYHKiuCQWWBv6lNPU1OX8RkQjj9OdQxrvqPJbpi+BYpxW2TA+yvE1bY+9nKLeeU/8j/LVrtuySuQi137W1wQ4kDch2AcCMaJrcaJn/0HgmAgm+Bgj/oObUZ4hnn/SWVFcMgs8Gg6A2eCnZqoKlnjjxFvUhvvdXHoBiSp8V7IJrxP8wQElXjotpfuKVJbwZvzbVkTBwYQQD+2Emot/QhkIFvBoEgIZdBYz0E01tenmZFJZRGGcAPLAo+m9mO/nO7ID7cPvo0QwBDZhGOQNu5DHsKjhgNyGzR4nxZMEMe8bmNSZn3pLx/hl3tVXZ0xyp4d0QR5SnDlIAgytRQcbyQCkovfyfgzHMR6jNjtNIllVBZh4C/9AGQv+clK0MjYe5ENIeDIm/ASD+FRIkBDoLSYQFEQJhDe1WFM/rMvD9doSdGXF30edLyFcBguBmb4PzAfLrBXOPNjK2gLReX9AtRrXvoamHB7IWMGAy22IHXoWh7Co+z66Vs9AXIb9Jhc0Tjo1cXVtBqXv8uLelSfJvYUmLAM3a96HEh4T2TIp6ee6Dwyn3B0IeDMjWloba0Op7J+AeozLfg5e9swHMJoJkC68Qgo0hdA33gDRAY1dQdMGu+jT59wrMO07NXjx38/gYcZErUguybBSq+qQR2GZSeCxMDQPzAHhN8lbrpPZ15kS9O51Dgq7xegXvP8j9jLPxEMkQmQcTw48uN/ykN4lK+AyAySGXMoD4ZObdLFmrKPZ/EwQzpzEyY69YnX6NU0aCaDhAY1rd/ok7ZJI6wLxS4W3XLrws54Ku8fIP28X7EWJKeLISC7IemfeQiP8gUQA0NdppA2vrHWDssTP6eVPQ9xlxrPZsQ6tA+2sNdP2giENAUdjaCi8DMSP8Mx5jBAxonQr4mra2m5NJnK+wXIZpz/vqxFIhlnMYdh1uc8hEd5A8S6VRF2A21cdWfBkg9Ka0EIxq2uo+896tRN7QdDLEj6ODR+6mLQsQiITMAi0QQPIVomYZd98Kx7v+gXoG7L8r+TNUiTTcG4On5oOw/hUcJpnoHBey3CGProa+2m5N9arc13HXXxpL5jr6+HwoewfCJIhgRmIOvROvxZh9AYrBh0NLbKKGzpM/VUFmFgU/UDUHvxC6tl7cPItJLWPFDEQ3jUyBbEVtQERhfd0FWQ/Imc92akvu+f/wDKZiCgh0AyTmMGw6AlA0FD6xOx+6F18QDFMdBnXrSRyorgkFng0XTj1L9Pc6jDe2QtFLXjcC8Wdf1cU+GoeysExKZ5MGBXKh4HDm1kE+3JzpSmx/BLZMletCIdjs4CKHiEOwkk00xmBs3wILamB7A+3rK+TwTb9+vZ0kEEh8wCj6aDeFGfOsbKjrCIYIiMrc2ZF9bfVvZ2Mg8jlF03NQ1OBCGYKa09pvl/spb+JYH/yS/1FS07CWXz4Y55vuQqmAdSwaMgWWajH8HvCMo8E1ym6YOgTAngNE5zdZz8D3YASwSHzAJ7U59uxl52LE4Ew5NxLWIzLf0FDyFUh3nRFz2W2WkNpWN/Zt1xadPDzqJlvVCcjIAWSv2mhdIdc7IkFSaDq3AuQiJYs9BJ4DJiN7RMA7txzuVqSRpP5UVwyCy4N/WYl7/DDifQFC6CIbKZdvRTc3kIobzNSnJkO/r2u3BsBcJYAgMFiyWXZbEERY/jmPY4SEUL8ffJCGc+drtHB7vf4SSwF6xMp7IIQjhAk1lwb2o+uSHBmR/exQ4eiGCIjHspZ+6k9ptn/BtP5Mp+6BkTHF8GA4VLJan4CRzTFg9ZcoMqXAQuywJsPXMAyuZC15F32H5RBMZtFtwX2fQPH2BvU0Uw7jF2R9ogGoKh27zqfR7ivqn77JZ5/YfWOOHQCgS0QhooWoGQVuAgTF6OXoKgBiFB4WMIZz44CpZca2ryfsCKVeCL2kt+sgborYZP0z2CpEcKegX05cadwjvw++C4L7KXv5EGP6yDgaI1CAdduEZyFT+FYFajV6KXAZQgpO+xRRGkE4uht/QV9rxcBGW4WQW+yqGZXsJOqgqh/GhXLsYmQLlYvz4EWszrvT768FfdFzbOcZY9Y4fDa0A6tBZcJWsl+pQOPQVSCQFaxSFRa0JQZYvB+f3KrrYru6dReRGU4WaV+Kquw6+sdOlo4zdaKwoGFz2MYg+l0BoF2A8mnLMChPAwAZW9/FUTnF4HUulaTH6Y8WfpEEFbA3AIQZVwUCdXQ++Rn31BZRGAx8HZbVaJHPXoZ6cP7s1EcMgIzw3nOyXQ40/QB0FbbnLAjr641Xvsvd/C6WdwRhoBR2RqTUdXgfPQs9c764w+nzZjFcnR1avpEU5t/FV67uwNED37HchRggs/+3ImDDQbnn+ehxmzuo59+OKdY8/egaMCGAJLZdiSjj4N3ad+/TMqL4IhMqtMrpqLX13dr4tysv9KMAKO5B5/3ICyVeA4oGDfbVmRbfXmN5byMH6r6/hHLzmPPGeHE5j8yK4lMrWws8+AvfytNCqPieMNioGMNKvQH3VY1rwHJpzVaI82dJCKAP04/rhyBluQ44ASer/F7/jZlhXZ2qBe/7c8jGzZT7z7WX/5swNwHJP2Cc56gDNPg6305bKbN2EixcDEvY49brNK/VWncekf2HGYoY0sAjqIcd0tCOG4Adm/VUJ3pgIcCKp1z0TpRtbs/71wJIuNBb6o/dTv1zqPvFwCJ3HMOSIAMdyH1+E1eF05wil/HG7lL7pkNW5g+zwRhNHMKh+LuoxPfMJakg7jISSJ3h4MAaKzONjFsnAmQ0D0bryTXgej7fuDoT496vqVzKQ/V+a/tti9J3ILb04lNeyeNXD2/V84y39aJFFL+OFpGMBp/G4gCIOAEIyjzzIPlD4FPfoFuAaLgeu74v96bt/rM3jMewB4M7uZsarL+NS7/dqIPjo7JB28GxCNQU7eghigTOxmu+m0lxLaM+jnIKhJmShVbYusrkqJLbm4LV57MSXaXJ0Wf/5WVlIvlCzE5HE1XLYaXKXrXK6y9RJrHe4WcphBA7tlGbRr5sHNvQlQnxYCt+kQefoDBWfNW2LpHkXJ+2KWYCDUVvjSKrsusRIKMG4e3s8IQHSiwrZXCV3Yetr2KKF5lxJupiugng450Vke/N64XQE30HSW8HqKAi5/pQDrRjrSGww12yZCbXoE1O+KhobdsdCQEYutIxqupUVC9dZQdrDculEBDeyUWShU7573P/Sohu5NlLivZskFSlfPFEfYDUnbJS2OS/R0kK2DRgDCcahtjwpadqkQyuBhp+spg4cta75BKFsGD2LSfyVg/loFlV+hEVTFlwhsmOlnMoFs2IZQU0Phyva4cuuB59bzWxoTHDIPMzZhIJo2h/ZbHZa/edqhjT9Cb1hBS1M9Ds5ZdNJCBZ3YzTqwi9HBpkbsZvVpg+cI6dgcnWmu5oDcHoRE56BHHhZXMaB0iuzatglQmRJXfnHvKrbGIeH9+DxTjWYezn9hEAbHbf5rpk7jijcceQnHQR2KgzhN/4OnLlgr2hXEDjrR6VPqZgTo2tbBVkTnnu+CRP+1AF29WQm1eE0TQr2ROh6sm8NbL6Q/lFmxf90zvEomSixQ5iH9Fwa5C5Db/M9MHZb1T3fnzfy6NzvmTNe+ifY72bhfywlmJzB69yEsHKxpUG3CcehmGnaXVDR+0ulUGpua0umk6jio3Iwt5ZuoGmva1P2VmUveGvmIFusVJjkW89D+CQMI4Qw3v3RIdSX/mnRbvfTFppzZnzbunbazcU+8pTYj6jQOwNU1aZOvV28Lq0Nfu7Q14uKllCnlFSkJB61pD39Rsevxf6rIffnxekm665Uz1hGQruTJvBr/hAGEUDyZFxOK1kHWZmtYc3NzGK148XqPhz/pb2hhQoE2r1K+sLAQglzzcB7FryMgIy1MKNDmtyFfWPieZP2wKHFfLUwo0ObpyhMWFCXrj0WJy7EwqUCapyxPWFCUrD8WJS3HwqQCaZ6yPGFBUbL+WJS0HAuTCqR5yvKEBUXJ+mNR0nIsTCqQ5inLExYUJeuPRUnLsTCpwBmC/h+cQgboJXoDZAAAAABJRU5ErkJggg==
// @connect      douban.com
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/448977/Douban%20Rating%20for%20Olevod.user.js
// @updateURL https://update.greasyfork.org/scripts/448977/Douban%20Rating%20for%20Olevod.meta.js
// ==/UserScript==

const DOUBAN_SEARCH_URL = 'https://www.douban.com/search?cat=1002&q=';
const RANKLIST_REQUEST_INTERVAL = 1000;
const VODLIST_REQUEST_INTERVAL = 2000;
const TODAY = Date.now();
const LOG_LEVEL = 'error';

(function () {
    'use strict';

    let config = loadConfig();
    initConfigOptionMenuCommand(config);

    if (config.main) {
        changeMainRating();
    }

    if (config.ranklist) {
        changeRankItemRating();
    }

    if (config.vodlist) {
        changeVodListItemRating();
    }
})();

async function getDoubanRating(id, title, timeout) {
    const key = id + '_douban'
    const data = GM_getValue(key);

    if (data && TODAY < data.expired) {
        return data.rating;
    }

    const rating = await requestDoubanRating(title, timeout);

    storeRatings(key, rating);

    return rating;
};

function requestDoubanRating(title, timeout) {
    const url = DOUBAN_SEARCH_URL + title;
    return new Promise(function (resolve, reject) {
        log().debug("Request: " + url);

        GM_xmlhttpRequest({
            "method": "GET",
            "url": url,
            "onload": (r) => {
                const response = $($.parseHTML(r.response));
                if (r.status !== 200) {
                    reject(new Error(`Response: ${r.status}: ${r.statusText}`));
                } else {
                    log().debug(`Response: ${r.status}: ${r.statusText}`);
                    try {
                        let msg = getDoubanRatingMessage(response, url);
                        setTimeout(() => resolve(msg), timeout);
                    } catch (error) {
                        reject(error);
                    }
                }
            }
        });
    });
}

function getDoubanRatingMessage(data, search_url) {
    const s = data.find('.result-list .result:first-child');

    if (s.length === 0) {
        throw Error("Douban search result not found.");
    }

    const rating_nums = s.find('.rating_nums').text() || '暂无评分';
    const douban_link = s.find('.content .title a').attr('href') || '';
    const get_url = () => {
        try {
            return (new URL(douban_link)).searchParams.get('url');
        } catch (error) {
            log.error(error.message);
            return search_url;
        }
    };
    const url = get_url();
    const matches = douban_link.match(/subject%2F(\d+)%2F/);
    const sid = matches ? matches[1] : "N/A";

    const rating_message = {
        rating_nums,
        url,
        sid
    };
    return rating_message;
}

function isDetailPage() {
    return /.+\/detail\/id\/\d+.*/.test(location.href);
}

function isPlayPage() {
    return /.+\/play\/id\/\d+.*/.test(location.href);
}

function changeMainRating() {
    // get title
    const title_obj = $('h2.title');
    const title = getMainTitle(title_obj);
    const id = getOleId(location.href);

    // Set main item rating.
    getDoubanRating(id, title)
        .then(data => {
            const douban_link = doubanRatingTag().mainRatingLink(data);
            setMainRating(douban_link);
        })
        .catch(err => {
            log().error(err);
            const douban_link = doubanRatingTag().search(DOUBAN_SEARCH_URL + title);
            setMainRating(douban_link);
        });
}

function changeRankItemRating() {
    // Set top 1 item rating.
    const top1_title = $('h4.title').text().trim();
    const top_1_link = $('li.ranklist_item a').attr('href') || '';
    const top_1_id = getOleId(top_1_link);

    getDoubanRating(top_1_id, top1_title)
        .then(data => {
            const rating = doubanRatingTag().link(data);
            setTopOneRating(rating);
        })
        .catch(err => {
            log().error(err);
            const data = { "url": DOUBAN_SEARCH_URL + top1_title, "rating_nums": "🔍" };
            const link = doubanRatingTag().link(data);
            setTopOneRating(link);
        });

    // Set the rating of the rest of the rank items
    $('li.part_eone a').each((i, a) => {
        const a_obj = $(a);
        const title = getTitleFromRankItem(a_obj);
        const link = a_obj.attr('href') || '';
        const id = getOleId(link);

        getDoubanRating(id, title, i * RANKLIST_REQUEST_INTERVAL)
            .then(data => {
                const rating = doubanRatingTag().link(data);
                setRankItemRating(a_obj, rating);
            })
            .catch(err => {
                log().error(err);
                const data = { "url": DOUBAN_SEARCH_URL + title, "rating_nums": "🔍" };
                const link = doubanRatingTag().link(data);
                setRankItemRating(a_obj, link);
            });
    });
}

function changeVodListItemRating() {
    // Set the rating of the vod list items
    getVodlistItemsObj().each((i, item) => {
        const item_obj = $(item);
        const title = item_obj.find('.vodlist_title a').attr('title') || '';
        const id = item_obj.find('a').attr('dids') || 0;

        getDoubanRating(id, title, i * VODLIST_REQUEST_INTERVAL)
            .then(data => {
                const rating = doubanRatingTag().unchanged(data);
                setVodListItemRating(item_obj, '⭐️ ' + rating);
            })
            .catch(err => {
                log().error(err);
                setVodListItemRating(item_obj, "");
            });
    });
}

function getOleId(url) {
    const matches = url.match(/id\/(\d+)\D*/);
    const id = matches ? matches[1] : 0;
    return id;
}

function getVodlistItemsObj() {
    if (isDetailPage()) {
        return $('.vodlist_sh .vodlist_item');
    } else if (isPlayPage()) {
        return $('.vodlist_sm .vodlist_item');
    }
}

function getMainTitle(title_obj) {
    let title = title_obj.clone();
    title.children().remove();
    return title.text().trim();
}

function setMainRating(rating) {
    if (isDetailPage()) {
        setMainRatingOnDetailPage(rating);
    } else if (isPlayPage()) {
        setMainRatingOnPlayPage(rating);
    }
}

function setMainRatingOnDetailPage(rating_element) {
    let rating_obj = $('#rating');
    const rating_num_obj = rating_obj.find('.star_tips');

    // exchange rating
    const rating = rating_num_obj.text();
    rating_obj.children().remove();
    let small_rating = $('.content_detail .data>.text_muted:first-child');
    small_rating.text("欧乐评分：" + rating);

    rating_obj.append(rating_element);
}

function setMainRatingOnPlayPage(rating_element) {
    let play_text_obj = $('.play_text');
    const rating_obj = play_text_obj.find('.text_score');
    const ole_rating = rating_obj.text();
    const replaced_text = play_text_obj.html().replace('豆瓣评分：', '欧乐评分：' + ole_rating);
    play_text_obj.html(replaced_text);

    let new_rating_obj = play_text_obj.find('.text_score');
    new_rating_obj.text('');
    new_rating_obj.append(rating_element);
}

function setTopOneRating(rating) {
    let top1_obj = $('.ranklist_item span.text_muted');
    top1_obj.empty();
    top1_obj.append(rating);
}

function setRankItemRating(a_obj, rating) {
    let item_obj = a_obj.find('span.text_muted');
    item_obj.empty();
    item_obj.append(rating);
}

function getTitleFromRankItem(item) {
    let item_clone = item.clone();
    item_clone.children().remove();
    return item_clone.text().trim();
}

function setVodListItemRating(item_obj, rating_element) {
    let rating_obj = item_obj.find('.text_right.text_dy');
    rating_obj.empty();
    rating_obj.text(rating_element);
}

function ratingTag(site) {
    return {
        "unchanged": (data) => data.rating_nums,
        "prefix": (data) => site + data.rating_nums,
        "link": (data) => `<a href="${data.url}" target="_blank">${data.rating_nums}</a>`,
        "mainRatingLink": (data) => `<a href="${data.url}" target="_blank"><span class="star_tips">${site}：${data.rating_nums}</span></a>`,
        "search": (url) => `<a href="${url}" target="_blank">🔍 ${site}搜索` + (site === "豆瓣" ? "（由于豆瓣的请求限制，可能需要登陆）" : "") + "</a>"
    };
}

function doubanRatingTag() {
    return ratingTag("豆瓣");
}

function getExpiredDate() {
    let expired = new Date();
    expired.setDate(expired.getDate() + 1);
    return expired.valueOf();
}

function storeRatings(key, rating) {
    let expired = getExpiredDate();
    const data = {
        rating,
        expired
    };

    GM_setValue(key, data);
}

function onOrOff(bool_value) {
    return bool_value ? '开' : '关';
}

function loadConfig() {
    return GM_getValue('config', {
        "main": true,
        "ranklist": true,
        "vodlist": false,
    });
}

function configOptionClick(option_key) {
    return () => {
        let config = loadConfig();
        config[option_key] = !config[option_key];
        GM_setValue('config', config);
        location.reload();
    };
}

function initConfigOptionMenuCommand(config) {
    GM_registerMenuCommand('主评分：' + onOrOff(config.main), configOptionClick("main"), 'm');
    GM_registerMenuCommand('排行榜评分：' + onOrOff(config.ranklist), configOptionClick("ranklist"), 'r');
    GM_registerMenuCommand('推荐评分：' + onOrOff(config.vodlist), configOptionClick("vodlist"), 'v');
}

function log() {
    return {
        "debug": (msg) => {
            if (LOG_LEVEL === 'debug') {
                console.log(msg);
            }
        },
        "error": (error) => {
            if (LOG_LEVEL === 'error' || LOG_LEVEL == 'debug') {
                console.error(error.message);
            }
        },
        "none": (_) => { }
    };
}