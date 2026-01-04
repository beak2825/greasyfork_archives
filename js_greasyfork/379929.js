// ==UserScript==
// @id
// @name               豆瓣酱
// @name:en-US         douban bro
// @icon               https://movie.douban.com/favicon.ico
// @namespace          http://tampermonkey.net/
// @description        豆瓣电影增强脚本
// @description:en-US  Douban movie enhanced script
// @author             yanpeipan(yanpeipan_82@qq.com)
// @license            https://opensource.org/licenses/MIT
// @connect            *
// @grant              GM_xmlhttpRequest
// @grant              GM_setClipboard
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @require            https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include            https://movie.douban.com/
// @match              https://movie.douban.com/*
// @exclude            https://*/follows_comments*
// @exclude            http*://*collections?show_followings=on
// @version            1.7
// @run-at             document-start
// @namespace          0rez.naY

// @downloadURL https://update.greasyfork.org/scripts/379929/%E8%B1%86%E7%93%A3%E9%85%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/379929/%E8%B1%86%E7%93%A3%E9%85%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==添加样式==
    GM_addStyle (`
.top .top250 {
float: left;
margin: 5px;
}
.background-beautify {
z-index: -1100;
height: 100%;
width: 100%;
position: fixed;
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover;
opacity: 0.1;
filter:alpha(opacity=10);
}
.rating_imdb {
padding: 15px 0px 0px 0px;
}
.metas_core {
color: #fff;
height: 24px;
width: 24px;
line-height: 24px;
vertical-align: middle;
display: inline-block;
text-align: center;
font-weight: bold;
margin-right: 10px;
}
.rating_icon {
background-size: cover;
width: 18px;
height: 18px;
margin: 0 2px;
vertical-align: middle;
display: inline-block
}
.tomato_score {
vertical-align: middle;
display: inline-block;
line-height: 18px
}
.topic-item a:hover {
background: none!important;
}
.player {
position:fixed;
left: 50%;
margin: 0px 0 0 -400px;
top:12px;
bottom:0;
width:800px;
height:auto;
z-index: 99999;
background: black;
`);
    // ==/添加样式==

    let movie = {
        zhihu_topic: [],
    }

    let $ = window.jQuery;
    let GM_Request = function(params) {
        GM_xmlhttpRequest({
            synchronous: false,
            timeout: 10000,
            method: params.method ? params.method : 'GET',
            url: params.url,
            headers: {
                'User-agent': window.navigator.userAgent,
                'Content-type': params.content_type ? params.content_type: null
            },
            ontimeout: function() {
                console.log('ontimeout')
            },
            onload: function (response) {
                let res = response.responseText
                if (params.json) {
                    res = JSON.parse(response.responseText)
                }
                if (response.status == 200 && params.success) {
                    params.success(res);
                } else if (params.failure) {
                    params.failure(res)
                }
            }
        });
    };

    $(document).ready(function () {

        let content = $('#content');

        // ==Movie==
        let match = location.href.match(/subject\/(\d+)/)
        if (match && match[1]) {
            movie.id = match[1]
        }

        if (movie.id) {

            // ==背景美化==
            movie.poster_link =$('#mainpic img', content).attr('src')
            if (movie.poster_link) {
                let uri = movie.poster_link.match(/p\d+.webp/)
                let backgroud_url = 'https://img1.doubanio.com/view/photo/l/public/' + uri;
                $('body').prepend('<div class="background-beautify" style="background-image: url(' + backgroud_url + ');"></div>')
            }
            // ==/背景美化==


            // ==API==
            let info = $('#info', content);
            let imdb_url = $('a[href^=\'http://www.imdb.com/title/tt\']', info).attr('href')
            if (imdb_url != undefined) {
                movie.imdb = imdb_url.replace(/[^0-9]/ig,"")
            }

            let url = 'http://movie.yanpeipan.cn/movie?id=' + movie.id +'&tt=' + movie.imdb
            GM_Request({url: url, json: true, success: function(res) {

                if (!res || !res.data) {
                    return
                }

                let data = res.data

                // ==INFO==
                let infoAppend = '';
                // MPAA评级
                let mpaaRatings = {G: '一般观众', PG: '建议家长指导', 'PG-13': '家长需特别注意', R: '限制级', 'NC-17': '17岁或以下不得观赏', 'TV-Y': '适合所有儿童', 'TV-Y7': '适合7岁以上的幼童', 'TV-G': '适合所有年龄', 'TV-PG': '适合8岁以上儿童', 'TV-14': '适合14岁以上儿童', 'TV-MA': '适合成人'}
                if (data.Rated && data.Rated != 'N/A') {
                    if (mpaaRatings[data.Rated]) {
                        infoAppend += '<span class="pl">MPAA评级:</span> ' + data.Rated + '(' +mpaaRatings[data.Rated] + ')<br>'
                    } else {
                        infoAppend += '<span class="pl">MPAA评级:</span> ' + data.Rated + '<br>'
                    }
                }
                // 票房
                if (data.BoxOffice && data.BoxOffice != 'N/A') {
                    infoAppend += '<span class="pl">票房:</span> ' + data.BoxOffice + '<br>'
                }
                // 网站
                if (data.Website && data.Website != 'N/A') {
                    infoAppend += '<span class="pl">网站:</span> <a href="' + data.Website + '" target="_blank" rel="nofollow">' + data.Title + '</a><br>'
                }

                info.append(infoAppend)
                // ==/INFO==


                // ==评分==
                let ratingHtml = '';

                // IMDB
                if (data.ImdbRating && data.ImdbRating != 'N/A') {
                    let star = (5 * Math.round(data.ImdbRating).toFixed(1)).toString();
                    if (star.length == 1) {
                        star = '0' + star;
                    }
                    ratingHtml += '<div class="rating_imdb clearbox" rel="v:rating"><div class="clearfix"><div class="rating_logo ll">IMDB评分</div></div>' +
                        '<div class="rating_self clearfix"><strong class="ll rating_num">' + data.ImdbRating + '</strong>' +
                        '<div class="rating_right"><div class="ll bigstar' + star + '"></div><div style="clear: both" class="rating_sum">' +
                        '<a href="https://www.imdb.com/title/tt' + data.Tt + '/ratings?ref_=tt_ov_rt" target=_blank>' + data.ImdbVotes + '人评价</a></div></div></div>';
                }

                // Metascore
                if (data.Metascore && data.Metascore != 'N/A') {
                    let metaImg = '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'
                    let metascore = parseInt(data.Metascore);
                    let metacolor = '#f00';
                    if (metascore >= 60) {
                        metacolor = '#6c3';
                    }else if (metascore >= 40) {
                        metacolor = '#fc3';
                    }
                    let title = data.Title.toLowerCase().replace(' ', '-')
                    ratingHtml += '<a href="https://www.metacritic.com/movie/' + title + '" target=_blank style="background:none">' +
                        '<span class="rating_icon" style="background: url(data:image/png;base64,' + metaImg + ') no-repeat;background-size: cover;"></span></a>' +
                        '<span class="metas_core" style="background-color: ' + metacolor + ';">' + data.Metascore + '</span>'
                }

                // Rotten Tomatoes
                if (data.TomatoScore && data.TomatoScore != 'N/A') {
                    let tomatoimg = {
                        "certified": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEyElEQVR4AdWTY4DkSABGXyXpTqYxRk+PT2sLZ9u2bdu2bdvmeG27b8dWWkhSZxO/7sWo7xX53yP4C/yGGtx7M/f+20xWtivNE5mOBAGicp4zZ+4C53Pg3X8l0DVh3H+695GjDuLwxqjklsd8lBbaDN/Y+vZaP89FcaHDqDyn9dQbkxcBz/xtwaAC19CZz3jm1a4X+gfVOhcfH+G9SjejBqeonaMzYpDFgy96OHi3GMUBG78Oi2fw3lG3mwcAsT8VDP4m/FV97pd9GB/WGDS1KRQVSE4+IMxDs3OZEjTJVGwkMHJQikPPz+SW80z6TMGSma7lwNA/FBiaMFY+m9V307uanpUuOfmgKO9U6l+HR4lZKue9HKQs6HDqZm3oikN/WLAipHHZPX5KAjbnHh7htefFPcCZfI/Gzzh3d//NxaNj+hYtBg++4qG8THLkPjGqm7O5e3ohfQv6aGkQxNI34ooxK8nwwdANbIZtlGLUJjajh1sEjzHOGHXowE1A629a0Pt2Vuym9zRji/EpSgocKsocLvyigh7Nz4LVCTxzenAhMXYsYJdglHHlvWwV6MaMCl76OI0PanROODDCp2/LH1vxo2Byhb5Z9XPu2qNu9JHhl1xwdJgQmTxYE6AkIVmUpaFKgcsFAUUwfrrJ/CIXnjGCC8vX8dS7GmZEECxwGO6jFQj+QnDqlhlX335H8goFAaqksdbLxx/ks9faGHqGxsW7ZeCNSbRei/WjvJz2Qi+jVsWYm6XSMtTNTic30tCnMHyjFMl13h+zNX5cUEjHUnCkgHZB5u1+DvYluW+cQXxsBkWmxa5zTQY1WNwmFELFGsPXCEYOOIysj6MZfoacY2IlVaTb4TeDLEAIW0UCqToDxxaIPJWzvQauiAuJRqo4RSoe46DP+5kxwYcEpABUSHyShn52GGwBUe23gvqQtU5J6EgNFFNF1UDRBcKrIoJ+SElEdwzFLSiwYKMVMRQBErAERBQHY5WOXurQFib+G8H8hvgnyoCXL9bGsRokVliiNMdRZBy1O4qqqCTaTGhPIWLg9Fnca6cYprkwHQdHKuQuTRKIChbPEp/8RhBOOD33vas0dRZdUrzDhdvyxGMPc8TRx4G0KdtgI6ZOHE9HcwPX3HgTjz76KG9VVhOq+ozLH36IpfPn49EVojc4HHPErjQ3zO35jaB4WP7F9WPLi70rY8xpNJm9cAVjmsMYHi+azCXc20V1kyTUESPl7uHFV98jsMlwTDNBTTPsd9Il335vcATqpOBRwNE/CrICaUcUb2js3dJuo/TbrP3oCzq7ljKz3WL9nDcZ1OlQvtmevL8uwsKuJPH+TGa0xhk+qBB/YQXvrYvy8hM3EdjvEtpMSVZMEl7acefCytZLRGbAc9wxD41+tDeUojIkiX/cCgKMybnEpnei+DUc00IIkFIihIIQgmQq+e2zy+OGpETNMbC/mQRZBsVjM9huTx+rq8IIAN3jOmT/28c//1FlBDuRAkBLOM1OOBni7yBxlOy0LSxVQqZOsSLJlomFdU+v3kkD8Aa8g1r7QF3aRv/KvhoBQ4Bi/gG2Y5+lKNrx/lxPhdgukJbwGkMmHD+iDQD/oLxPfGWZ1wA6/Hc86d7di7fccJbb5R7N/56vAEDvDGwghbBBAAAAAElFTkSuQmCC",
                        "fresh": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFBElEQVR4Aa2VA7TszBpEd6c7yfiY13q2bdu2bdu2bdu2bdtHGGei7u9l8Ju4tVaNsKtaieJsyA917djNjrzk9z/a/hzwKc6BDGdDpbo/e3i1es3NYPtrrX+1K0B0XAI8rUJtvKA6E+6J/9XV57/I9PX/mGX/A77D2ZQ6xRuFBzgAE+r6ngvO3ODoFVfuV58LyvZPvSs1zt+wP/3W/56YRPnuf3698xGgc45GIChvam/1KqsXnLnYwQvN3nTPhWeulXStIXO0kjb/+vh/zEVue/AZUvPi1f8kgx+ttT8GJGd7BABTvlm5/NX3vlEuM3/TxaUSTdH8+7d9yv/oUGsY6pecJlguMb8z2M7/3Pvd5k+3Pv/DP+y8D/jXWQYESgXXPDh7p/lbHnhcfqh6QV02DFKo4fhnU6hVNIcWNO4fEUEno1sExg2fcGvw73984l8v/M5vN98CJKcbMOXpmdtecvWljasu3fNif4459p+UPx30+f6NF9ChR9bLiaqG0PeY++uA+759g1rHsjal+d2hkJ9dosLar7ff88Wv/euRwPYpAspKlZ+8uvzWix1o3PFyu5YlrSAsrODpt1vk9/tC7vyONbpW+MpN5hkcrnCjLzS5ywe2yX2FlwstDd89EvCTne6HX/aX/90DiE4MeHh95glPm5t7fqWqyBYNa4s+67OGv84FfPlgmUN/6/O4r7ao/zvn+0XjN99/menA48kv/C9hIuRG4TswuaPvK17YbT4NeDaAdwE/uPADGtMPV3VNuuwTzfv8YUbzw1mffxrFdX/X5cH/TPCXA9pHQq7Ycdzxg9sMrBCXNZ5jpMyDQRHqKcV9a1MP/fygf/HCmJuUardaDM2yqiqkoalO+1y3EXD9IMTzFH7FJ1tIiHQKqdCZN1z5rwl/+GWfqKKY3RUEheIkzXt64abl6q2BX5orh+Wr4wMlUKGCqoaZMt5CHVUyJO2EfLODF+dQUtgSeL7H5X4VQS6Id0o4gAOuGJavCWD2G3MIBSiFGAWeQrRGygGqXoIhWHuFx9+pwkkAB9YzlIJMn4SXCTxFmNFmH4ApKVXCAVYgH1uSDNcejJ/7KZLZwoLkbvw9inIuoECGhglCSIFYhIE4H8A0rdtdzlklFlQkSD9HBTHWOZTWSJpDO0H1LcQCiYCVERg1AU9aJwgRMED4n827AOZ3efLrC2bBRaQn2HaGNuDsMCxHlMLlDgq4a2fQdhAJOBA1BmeT1hHD1kJfHD3n+FUa/xbAfDmOPnvrSv2O0negwUqOShwq9MBTkDskLty20BRcIghCJpw0HQzBhZ2li9DKUr4fDz4zCeh/7odp/N3LB6Ur03GQgnQtEqoTA4hB+oIkQgYjeMKkNePWXWfp2Jx2nvHrOPrRr7Pk0wAK4CrFlnrX3MrHpjxvGgAP0JOvRRAL1o3hyaR1xLCxG8HbtoC7bNR8LYk7n8iy2wJfOsXF7o7Vxj1eOr3w+lCpEsJIMrKQAhlCDEQiI/ecK2xpuXHrVhKzlSXZ16x9MPDm071c36Rcu9XTp+ZecNj4xxyQTxYxnrTuU1gsPetonwDOEpppwj/z/G8/FnkS8MEzveEcMv7R+9amH3bdcuWWs57ZOxA32R1CT9x4ngu38rQAx/w3zf73B3Gf+BO8Cvjj6d9wTkdHjH+BS4Wla1zQhFde0PqCGuaK9n4zy9LNLGn+O0//8A/rvrsG3wB+xxno/+N5rMoDguFXAAAAAElFTkSuQmCC",
                        "rotten": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFZ0lEQVR4Ac1UA5Qj7RYMhwjGtk10upOsbTtr28YoM6uxbRtr29Zv22a9O3q265w6za+uwPtr0Jfo+npGWmuDBzsUmDmYTOYL+GLevwsSCwNmbVzQq02XGbRcZZBWF/VDgMoumc/ni/51dT5PMGK2e8uJ+yR+TYHGSyw6bjI4Uhn9i8zGaNi/rC/SEZqu14a+X3eRRWEnsYNFEV2zmxVwCTRf+fv/CsVCqaFcP5zS6ScQ8vX+qrCugdhW31jHpfvHiUt8LpWdYJHZqEBmgwLZTQoklSpg5Sqd1v+/qZ3xcM3G0GuZdWO+0BYM/yh0iFO+SFdo9mfFnfzMVmw7EvLGnszwDwKUtomWzpJpuzKivslq4nC4gkV6HYcFO0Le0zEQ2/MIBjK9wPXaqPcbLo6hGo3H2YfTUXFyAryibVP+RNzS0WRIZn3El513GFSeY5Fcx/5q7iSZbOYombJOG/nN0SolDpVzCB7kkNt/xj3Mam9KtZLqokRqjRpZTYNRc3Ykxi8JfC4QCoz/wECI0mpj01UFyk+zyGjhkNKoQuQo57Ie426yhTvSGRJRImK4U1FPjcRCySiN14XDFRwSilloiXRFer0KU9YEfUx1sfnD9PjI55SdYlByksORWhZJ5PHymIiPKYopcnuTieuTon44WsVhV2b096M1nicmL/O9ElvA/qIt5ZBUxuJgGaWxkkgRRY/1eEbz8ocRiPVEVpOW+1zKP9brfWwJBy0d2put+GVnGvNrQhGLeGJiCQvyGgeJ9B1JNSpoy5WIp/9jCllM3xAKmbXxvj8/tdQ9oUMcMpfFhn+SSIdIDIml5F05RwIs4sjb35LEY4hT14ciYqTHNz6MwzOXQOsrEkvDWPJewvtroC6xDVDbpx8oYn89VMshsYolT8nbavK8pptKpDQpsSE5Guau8nahjtCFz+cJe8bzr4EicLawN2KlFgbBFtSiW1Ijv87q4JDazCGtpY/NbM81o40MVzJQTHA7ae4snSqxMlLrmeh6UfcY/NnF4BxovnZ5TMhre3Iiv9qaFvHpgaLo7zNau0XZPnJIb+0mS+IsyDByqV5ZnQrElDDYmBL5w+xtQW+rpnlesPSQL/+DiZbbGY/clhb+Sd7xnoPE3mtmO4ucrl5vM0k0u5Mj0to4zaH8ghJVl1WouqRG3dXBaLk1DJ33RuH4gwlIrh4OP7VDqUDUF03wEMei5AYFCfaIEVnkHe8VyyCPS86qUHpWjfLzA9F4YyjiC5U/RI5wur5iT8T7px9NxenHM3DmyWycfzYXF15ocOe1xcisHQtbP/NtNO2hPEtX6ZyY4sivKy5wKD6jQs1lNfI6VVBO9bjoq7TPT6sf/N3Jx5Nw/P5UXH5pDtbsY94X6QlDdQzF0Zu0qvdvv7oYF19aiEsvLcD55wt6ruceaDBoms81O1/z/bzu/R400P5o0fEhaL89FmUnR4MZ59ZG3SEX6Yls1sYwL918ZSF5Nx/XX1mEmhNTYOko2csjWHuaripun4irLy9A15056LgxG81XZhCnY8zCwFfdI2xo8gnd+bJykU4KG+gQa+9lqhGKBEa9q1hgsmBz+PUbJHz2iQZnHmsoCg0mzA19nb65dDvHjHPvKOmaiOKuSUij1CRXjcburEHwYR0vmzlIdvH+FlQTPKpPPZiD1qszUHd+CkU5HbNWRf1I0z+gp72pPQfO8Lm3PFaBRfsZTN8agbCRbu/pGekMobY1/5sGTCwN1Uv2Mh/HFQ3r8WzO+mjYeZi108TKfn84bbzNdjr4W5abOUgTxboiP94/AjIyyD3KrtMl2OaWsZnBnh7P/p0QUcGltiarjC0MD4j1hNG8/yf8BrCAoJdN16WUAAAAAElFTkSuQmCC",
                        "full": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFK0lEQVR4AZTNQ4DsWAAF0JsXFJIygm/btm3btoXN2LZt27bRtm2nKprGdlr3mYegndA0ocMhV5gQilzdO+CmJ25c9uonL576dtwIaSLQEo/b4aUag/9Ju8CC2SMXvvP8kQ/uuW7Vfdu3bdkxdfLkWZNHKdPO7Z5288wJvRY8eOuORy4cmn4ZgNUpQJF8XWZM6DH7zMEFF7o52bFrZvQ53G/kVNnrZ4WqyiJj0crVM568afkbC4bZ9nf30SMH9vYM7TDg8/C+2y/NffiFOzZ8On6oNM0VFk04esLUSmCodfaKzDRaL/sFvoCd93Xvj5lzV8zZu2XCoQ4BTo7hH7pp3RMrlk9f6g0rdF3BP+AYjYS72VGUGgPG0hES/SgvZlBTrsGqL4TXU0sU0d6dt3N8m4AblOeOwd0fmT1JWuUMjQYIi/rKepSn/IyKrBgwQg9wPAOV6Ql/r/7wSjx0tQJ15dWYMm7IotsPL76Xp2mhVWC34D2y4uj0LXzXYdCqs2GoVRBHzIKnx1BUF1fBrImBFjUg9ekFWktDpLYCFiuDYRlYhKLnDnLt3m8XTrYKjAczla7gYA/2hIpy1FQVorqkGLSgINyrJyJVpYCpw2YzQTu6gqK8cCsKNLMIzpAXLkcAM3jHvFaBCEEDc9fnqNx9A7TPEsDWmjDqMgEOYCUFoVETUakZSE7JBngB4AREc9Nh/ZgG9sbPYLv6PqKa2dAqkMLR8XB5YL70O6wz74E++gmc1/6GyOnXoF33HYw7f4brmVgID/4I9fRLIOc+gLbrbXDXJUB7NgYmKyCGpf9qFUiHlSo8fDfI0H6wiAVU69C/y4P2bgzURz5Bwy3vgn74ezje/hvW+3HQv4gBVanDpCyQwb3geuRupFpmYqtAXl1NTtTnjRBZApFEuF9+GsL9N4MKCiDdJNj3bodt72ZYXYKAT2g8u63xzjMgsghalhAN+CK5tTU5rQIFqppXEBtbClEEGlQwo0bAcWAvYLM3IgEI99zW2O4AFQoBNq7prPHOyP8qK4cEWK4Aip42Y3tFyR5CDJNRsImY09j2t+2wzVJbVY+prmnQSfHp3vMEbBhiY4175dexE4bDfwRMYdKv1R3uvhOzXKA8H2MtqVwOKxUYk7wIBfl8EtZ+gFkssbGmX/vDmcL4HwELa+f9334fmttvwypJNJsjUylMoZjErbFYazBSYotFVDqNms0wSmBjTffX3wdbj3/bKsJWo97W112HtaCnUyRgSwWMUmhrURa01glAA2I6QxnLVtOp1zrA5t8A1Pv9miqXkPkCejzBAKZcTEz11sgatJLoUikB6MkUlSsgqxVqg/4fOze77mTSWksp1DVXI12PxKRYRmuJwiSQBBZDJSA8DxOXDYUQncm4uRMwULI38YOZufEGhOsiAV0uoZRBaoNKAApVKiKAyHFRcdlpMFoMpRzsBDgi6nmDgW/vuQfpeFjAlEoordFSIqVAJi0ooxOAA/fchT8ceI4QvZ2AhWXS/O67YD0eI6OQDKCvvZZIa1Q6g8pkENpgr7mWJC/cEE4m1L75NphZO9oJAKKfzp/73Dt5kmWrzeqzL5GLBWo7XZ0hdjjEpMAs5qzjvFWzjXfyFHvOn/sCiP4LgO/Wq9ffN+L5oF4T/UceZ/X9D6TSsHzgYRYPPJQA5j/8RPfRx/HjMh8Z+eK369Wr/+fQX705Dp58ehrc+7YMXz6wWR88G4U/n2+1m6earT+OhZuzezerve+J8JVnp8F9b4z9J4DV3xn9CYgbvHRBBzqoAAAAAElFTkSuQmCC",
                        "spilled": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEXklEQVR4Ae2UQ6MjWRiG33NOpVJIUhX7KpdtjW3btpfzG2Y9mxE2Y9tm27Z9jSRlTKaGbaz7LfP5jBM6kgiOQ5SCyxTFCeOnpa9L5sOtS2b2vw7gexxE3GHpFEwQOSUS4zOpjFpKZ5XmbE5tbatUWjip2gZhRw+ciBKLRcd/8/76YQALD+sBH2aR7smpyxvfd2Tz6VJzU1ux0trekkwlE+lkTpEkWTbtKtGMUSxa/wH29m3Gip+SsHSKbPeueW89t/JyAEMHBSTSQuW6+5tePfusc87oKJ0Lx7VQ1QYwPLYLo7VeaMYQdHMMrufAhw9BYujfImPl7zI8l6BtiubPn7PkTgBvHQAgBPS2J7o/PPW8wrXETsL3AI6FIAoKZFFBTM4iKmcgNc55TsacFW9i9+AibFqQwe6NPBgF5LgNHWtfBPDoPjkIiyxWaIpMa+4MnT2t63JMb38UPjzwnADWgOyvmjaE35a8ANsGasMMjPoglMDQGMS00PnF2xsUAKP/Alo6Yme19agXqaqY6O3rxXztUxjWGCy7Bt2swrQ12LYRbI5nw3bq0N29IE4EpkZAGAAgCBPxWJLjiLQPIF2QxmcL0kT4PFatmwutPhOUAoRQUMYQHAkJzhnh4MMGEz24dgi+R0EI4CPYAT4VKSP7uM01SjArRbhUrabjunOfQnvTGbBtG5RSMEIARkB8EkD4sIB122bhk9+ehO+GIIoyQHzADwBgjOcIAdsHYFtu3bY93bE89A/ugcRvhuvaoIwDoyzYaLBRCEIMtfoIPN8DYRxURQGhPnxQ+B6BSTkfjWUfQHXE2l0btXdnCyK+/vVpGIYZWEUaG0BAKQEJQkRBwMCFGGQlFHgkRRX4YKAE4BqgvjqxPM939gEM9hoblYTWUqpwmDHpBkysXIKRai8MqwbTqsO2dZh2HYb5Z+J1GNYoeodXgcLGxHYeYeZAtxXsHCLQBrQR1/GNfQDbN47NMgyn2j4+fJ9ujGQkMYGonIYgRMCHJHCcEPQECEGIA6q1Pjz79r0Yre3E2VNGkRHqsHgev65T4Lqt2rd0g3XQTr705uaXuyZGH5T4JCgNwXHNv5stCllqQKUkVKUQHOev+BBbdy3Hw1fciS41jj2bF4AQAeFkS+/Fd794NoD1+Fv/ZnzXlvpsQUa+p3ty1xnTb2PlwkSSTVQg8BEYZg39Q9uweccCrNn4E+raACyXQIaBKc05REsTURvYiWg8JYyf0Fnp7xvEgqVbN45VdYfsO4YJpyb5rkxO6Sw3FdtLTbm2YqnU1N7W1dwYd4lYLK6KgiQ2QomvZ74Es7oV906ahpbWqUDYgM8SQSn7zgC+XUA++fHXxT+Qo5n9gsipUYXPp9JqUyIdbS2VcxXGG20O65vQU0hHWtTSxrOnTu+CuUsaHBrarVaupG99OPPNWXOXzyI4ToVFFm/rjF1BeGRH99o/P3DLRVcrvB6fu3DtPCtU1mbNXTFzeGRsGCd0JP0BLHO0MJZ4Kw0AAAAASUVORK5CYII="
                    };
                    // Currently no way to know if it's certified or not
                    let fresh;
                    if (parseInt(data.TomatoScore) >= 60) {
                        fresh = 'fresh';
                    } else {
                        fresh = 'rotten';
                    }
                    let tomatoUrl = data.TomatoURL.replace('http://', 'https://');
                    ratingHtml += '<a href=' + tomatoUrl + ' target=_blank style="background:none"><span class="rating_icon" style="background: url(data:image/png;base64,' + tomatoimg[fresh] + ') no-repeat; background-size: cover;"></span></a>' +
                        '<span class="tomato_score">' + data.TomatoScore + '</span>'
                    if (data.tomatoUserMeter && data.tomatoUserMeter != 'N/A') {
                        let userimage;
                        if (parseFloat(data.tomatoUserRating) >= 3.5) {
                            userimage = "full";
                        } else {
                            userimage = "spilled";
                        }

                        ratingHtml += '<a href=' + tomatoUrl + ' target=_blank style="background:none"><span class="rating_icon" style="background: url(data:image/png;base64,' + tomatoimg[userimage] + ') no-repeat; background-size: cover;"></span></a>' +
                            '<span class="tomato_score">' + data.tomatoUserMeter + '%</span>'
                    }
                }
                $('#interest_sectl .rating_wrap').append(ratingHtml)
                // ==/评分==


                // ==TOP榜单==
                let getTopContent = function(name, link, raking) {
                    return ('<div class="top250"><span class="top250-no">No.'+ raking +'</span><span class="top250-link"><a href="'+ link +'" target="_blank">'+ name +'</a></span></div>')
                }
                $('.top250', content).wrap('<div class="top grid-16-8 clearfix"></div>')
                let topHtml = ''
                if (data.Raking && data.Raking > 0) {
                    topHtml += getTopContent('IMDB TOP250', 'https://www.imdb.com/chart/top', data.Raking)
                }
                $('.top250', content).after(topHtml)
                // ==/TOP榜单==

            }});
        }
        // ==/Movie==


        // ==知乎话题==
        movie.title = document.title.replace(' (豆瓣)', '')
        if (movie.imdb && movie.title) {
            GM_Request({url: 'https://www.zhihu.com/search?type=topic&q=' + movie.title, success: function(res) {
                let dom = $.parseHTML(res)
                let topic = $('.ContentItem a.TopicLink', dom)
                let title = $('.ContentItem-title', dom).first().text()
                if (topic && topic[0]) {
                    let topicId = $(topic[0]).attr('href').replace(/[^0-9]/ig,"")
                    // https://www.zhihu.com/topic/19580323/top-answers
                    GM_Request({url: 'https://www.zhihu.com/topic/' + topicId +'/top-answers', success: function(res) {
                        let dom = $.parseHTML(res)
                        $('head').append('<meta name="referrer" content="no-referrer" /><link rel="stylesheet" href="https://img3.doubanio.com/f/ithildin/f731c9ea474da58c516290b3a6b1dd1237c07c5e/css/export/subject_topics.css">');
                        let zhihuTopicEle = $('<section class="topics mod"><header><h2>知乎话题 · · · · · ·<span class="pl">( <span class="gallery_topics">'+ title +'精华 )</span></h2></header><section class="subject-topics"><div id="topic-items"><div data-reactroot="" class="react-root"></div></div></section></section>')
                        let list = $('.List-item', dom).each(function() {
                            let userLink = $('a.UserLink-link', this);

                            let item = {
                                url: $('meta[itemprop="url"]', this).last().attr('content'),
                                avatar: $('img.AuthorInfo-avatar', this).attr('src'),
                                nick: userLink.text(),
                                link: userLink.attr('href'),
                                info: $('.AuthorInfo-badgeText', this).text(),
                                up: $('.VoteButton--up', this).text(),
                                comment: $('.ContentItem-actions > button:nth-child(2)', this).text(),
                                content: $('span[itemprop="articleBody"]', this).text() || $('span[itemprop="text"]', this).text(),
                                published: $('meta[itemprop="datePublished"]', this).attr('content'),
                                created: $('meta[itemprop="dateCreated"]', this).attr('content'),
                                modified: $('meta[itemprop="dateModified"]', this).attr('content'),
                                image: $('meta[itemprop="image"]', this).attr('content'),
                            }
                            let time
                            if (item.modified) {
                                time = new Date(item.modified)
                            } else if (item.created) {
                                time = new Date(item.created)
                            } else if (item.published) {
                                time = new Date(item.created)
                            }
                            if (time) {
                                item.time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                            }

                            let json = $.parseJSON($('.ContentItem', this).attr('data-zop'))
                            if (typeof json == 'object') {
                                item = $.extend(item, json)
                            }
                            movie.zhihu_topic.push(item)

                            $('#topic-items .react-root', zhihuTopicEle).append(
                                $('<div class="topic-block"><div class="meta"><a href="'+ item.url +'" target="_blank" class="title">' + item.title + '</a></div>' +
                                  '<div class="posts"><div class="topic-item"><div class="item-meta"><a href="'+ item.link +'" target="_blank" class="avator_a">' +
                                  '<img class="avator" src="'+ item.avatar +'" alt="'+ item.authorName +'"></a><a class="author" href="'+ item.link +'" target="_blank">'+ item.authorName +'</a>' +
                                  '<time class="time">'+ item.time +'</time></div><a href="'+ item.url +'" target="_blank" class="abstract">'+ item.content +'</a>' +
                                  '<div class="action"><span class="item">'+ item.up +'</span><span class="item">' + item.comment + '</span></div></div>'))
                        })
                        $("#comments-section").after(zhihuTopicEle)
                    }})
                }
            }})
        }
        // ==/知乎话题==


        // ==悬浮视频&图片==
        let video = {delay: 1200};
        $('.wide_videos a').hover(function() {
            video.hover = true;
            let url = $(this).attr('href')
            video.url = url
            GM_Request({url: url, success: function(res) {
                if (!video.hover) {
                    return false;
                }
                video.timeout = setTimeout(function() {
                    if (!video.div) {
                        video.div = true
                        $('body').prepend('<div class="modal" style="display:none;"><video id="player-html5-242330" class="video-js vjs-douban player" controls="controls" autoplay="autoplay"></video></div>')
                    }
                    let doc = $.parseHTML(res)
                    video.src = $('source', doc).attr('src')
                    $('#player-html5-242330').html('<source src="'+ video.src +'" title="" type="video/mp4">')
                    $('video').on('play', function() {
                        $(".modal").delay(500).show()
                    }).trigger('load')
                }, video.delay)
            }})
        }, function() {
            video.hover = false;
            clearTimeout(video.timeout);
        })
        $(document).click(function(e){
            let popup = $(".modal");
            //判断事件对象不是弹窗对象  并且  弹窗对象不包含事件对象
            if (!popup.is(e.target) && popup.has(e.target).length == 0) {
                //则隐藏弹窗
                video.hover = false;
                $('video').trigger('pause');
                popup.hide();
            }
        });

        // ==/悬浮视频&图片==
    })

})();
