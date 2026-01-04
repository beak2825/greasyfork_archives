// ==UserScript==
// @name         Tagi użytkownika
// @namespace    https://greasyfork.org/pl/users/846686-powaznyczlowiek
// @version      0.1.2
// @description  Skrypt pobierający tagi, których dany użytkownik używał w ostatnim czasie
// @author       powaznyczlowiek
// @include      http://*.wykop.pl/*
// @include      https://*.wykop.pl/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAzCAYAAAD2OArBAAAACXBIWXMAAA6jAAAOowGqZsyZAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAv1JREFUWIXd2EuoVVUcx/HPOV27lkpBj6umiIk9wFRuVEgvS5pmkwJBHBQKRdGooEnQMBo0CIIGgkVSRKPiNsjKpCgSoUKrQUHR9RHZ1QrLW9Y9Dv57c7ZxOmft49pe8AeLfc4+a6/v76y9Hv/1b0lXC2uwAXdiGS4vyl+YwlEcwAdFOVyj/f/VXDyC79GpUWbwFtadDXyT+Bd1wL3K27iiDvhibM8ArpaDuCMFPoYvMsPLMo27+8EvEYOoCXhZfsONveAtTDQML8u3GP2vgW2JDx/GC3gAt2M9tuAV0cWpJp6qwhfg5wEPzOBZzOvVfYWW4MNEA7+LwQ6eSHjgsT7gquZgd6KJ+4h3/92AijsT4aWuwskEAztgfEClk1hY0wC8nGBgX1us7f20Ez8NYeD9hDoL21g1oNIbQ8BhMqHOlYMMnMCeIQ38m1Bnuo1DYgr20n6x1Q6jFQl1Do3g3uLLGG7A6sp135Bw2JhQ58uzaL+vrhGvYNAseLAJeBvvJMD/EJtfdj2TAO/g+Sbgj0vr+mO4LCe4hecSwGXZlhM+D2/WgG/PCV+Gz2vAX8RILvhKHEkE/42Hc4GJ7faHRPgkbssJJ3bIFPiEODll1QX4cwD4FJ4UsyO7Fg+AH8ddTYBL9YugZnBPk3C4qY+BA3Uba2e1FvHDrBo4PtsGTtR9YJhpMioWol76Vex0s6YWFp0r2BxsFgsTcXiZwC9Y2zS8rXv+exX3iwRVRxy9b2kK3MKFxedbxQm3ug68hPnF7yNYnhO+BLtEwDlX5HsmK/CPdV/HtdgrUnfjuQxcp5sx+1o39psQaZcOXsOjIuLt4LPCTDZtdmaXl0HGuoqJMgB5WsboZ6Ro8FQB+Ke4vouLxCCcqhjYlRO+Ap8WDU+LbMoqcWTv4McK+HWxGJXxXxYtwjfiHLe6cn+rM1/HpuL+zWIsjOUyQIRVZVptVCSrykFYZsbeU0k6NaXrRU90xBrwkO7s+ARLmzYwhq/wEa6u3F+suwY0rkvPJez812kpk9jlmjLpGAAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436338/Tagi%20u%C5%BCytkownika.user.js
// @updateURL https://update.greasyfork.org/scripts/436338/Tagi%20u%C5%BCytkownika.meta.js
// ==/UserScript==
(function() {
    function getUserTags(progress, url, user, page = 1, tags = []) {
        return new Promise((resolve, reject) => fetch(url + user + '/strona/' + page.toString())
                           .then(response => {
            if (response.status !== 200)  {
                console.error("Error during fetching: " + url + user + '/strona/' + page.toString());
                resolve([tags, true]);
            }
            response.text().then(html => {
                var parsed = $(html).find("li.entry.iC > div > div > div.text > p").text();

                var pageTags = parsed.match(/#(\w+)/gm)

                if(pageTags != null) {
                    tags.push(...pageTags);
                }

                if(page < 3) {
                    progress && progress(tags);
                    getUserTags(progress, url, user, page+1, tags).then(resolve).catch(reject)
                } else {
                    resolve([tags, false]);
                }
            }).catch(reject);
        }).catch(reject));
    }

    function progressCallback(tags) {
        // render progress
        console.log(`${tags.length} tags loaded`);
    }

    function getTopTags(tagsList) {
        var tagsWithCounts = tagsList.reduce((a, b) => {
            a[b] = a[b] || 0;
            return ++a[b], a;
        }, {});
        var sortedTags = Object.entries(tagsWithCounts).sort((a, b) => b[1] - a[1]);
        var topTags = sortedTags.slice(0, 5);
        return topTags.reduce((acc, val) => acc.concat(val[0] + "(" + val[1].toString() + ") "), "");
    }

    function animateInLoop(selector){
        for(let i = 0; i<20; i++) {
            $(selector).fadeOut(1000).fadeIn(1000);
        }
    }

    function showLoading(nextTo) {
        $(nextTo)
            .append('<span class="used-tags-loading used-tags-loading-1"> .</span><span class="used-tags-loading used-tags-loading-2">.</span><span class="used-tags-loading used-tags-loading-3">.</span>');
        setTimeout(function() { animateInLoop("span.used-tags-loading-1") }, 0);
        setTimeout(function() { animateInLoop("span.used-tags-loading-2") }, 200);
        setTimeout(function() { animateInLoop("span.used-tags-loading-3") }, 400);
    }

    function hideLoading() {
        $("span.used-tags-loading").clearQueue();
        $("span.used-tags-loading").remove();
    }

    function fetchAndPresentUserTags(login) {
        showLoading("a.used-tags-qtip-content-element-anchor");
        getUserTags(progressCallback, 'https://www.wykop.pl/ludzie/wpisy/', login)
            .then(tagsAndErrorFlag => {
                var entryErrorFlag = tagsAndErrorFlag[1]
                var entryResult = getTopTags(tagsAndErrorFlag[0]);
                getUserTags(progressCallback, 'https://www.wykop.pl/ludzie/komentowane-wpisy/', login)
                    .then(tagsAndErrorFlag => {
                        var commentErrorFlag = tagsAndErrorFlag[1]
                        var commentResult = getTopTags(tagsAndErrorFlag[0]);
                        getUserTags(progressCallback, 'https://www.wykop.pl/ludzie/plusowane-wpisy/', login)
                            .then(tagsAndErrorFlag => {
                                var votedErrorFlag = tagsAndErrorFlag[1]
                                var votedResult = getTopTags(tagsAndErrorFlag[0]);
                                hideLoading()
                                var message = login + " w ostatnim czasie był aktywny pod następującymi tagami: \n\nWpisy: " + entryResult + "\n\nKomentarze: " + commentResult + "\n\nPlusowane wpisy: " + votedResult;
                                if(entryErrorFlag || commentErrorFlag || votedErrorFlag) {
                                    message += "\n\nNie udało się pobrać wszystkich danych i mogą być one niekompletne. Być może użytkownik ma niewiele aktywności (mniej niż 3 strony w danej kategorii) lub wystąpił błąd";
                                }
                                alert(message);
                            }).catch(console.error);
                    }).catch(console.error);
        }).catch(console.error);
    }

    $(document).on("mouseenter", ".qtip-content", function(){
        if ($(this).find('.used-tags-qtip-content-element').length > 0) {
            $(this).find('.used-tags-qtip-content-element').remove();
        }
        var list = $(this).find("ul.sub-menu.dC");
        var login = list.attr("data-id");
        list.append('<li class="used-tags-qtip-content-element"><a href="javascript:;" class="used-tags-qtip-content-element-anchor" data-id="' + login + '"><span>Używane tagi</span></a></li>');
    });

    $(document).on("click", "a.used-tags-qtip-content-element-anchor", function(){
        var login = $(this).attr("data-id");
        fetchAndPresentUserTags(login);
    });
})();