// ==UserScript==
// @name              全网VIP解析油猴脚本
// @namespace          ccc
// @version            2.3.8
// @description       自用解析脚本，哔哩哔哩番剧解锁大会员,集合了优酷、爱奇艺、腾讯等全网VIP视频免费破解去广告,没有太多花哨，但是很好用，方便看电影,此脚本仅用于学习研究，请勿用于商业用途，请大家支持正版。
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             *://v.qq.com/x/cover/*
// @match             *://m.v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/page/*
// @match             *://m.v.qq.com/*
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/kszt/*
// @match             *://www.iqiyi.com/kszt/*
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/alipay_video/*
// @match             *://w.mgtv.com/b/*
// @match             *://m.mgtv.com/b/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://m.tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://m.film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://m.le.com/ptv/vplay/*
// @match             *://v.pptv.com/show/*
// @match             *://m.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.acfun.cn/v/*
// @match             *://m.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://*.bilibili.com/*"
// @match             *://m.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://m.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://m.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.wxtv.net/*
// @match             *://www.eggvod.cn/*
// @match             *://music.163.com
// @match             *://y.qq.com
// @match             *://*.kugou.com
// @match             *://*.kuwo.cn
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM_download
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @run-at            document-idle
// @connect           bilibili.com
// @connect           iqiyi.com
// @connect           mgtv.com
// @connect           pl.hd.sohu.com
// @downloadURL https://update.greasyfork.org/scripts/440566/%E5%85%A8%E7%BD%91VIP%E8%A7%A3%E6%9E%90%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440566/%E5%85%A8%E7%BD%91VIP%E8%A7%A3%E6%9E%90%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];

    function innerParse(url) {
        $("#iframe-player").attr("src", url);
    }


    function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") {
            GM_openInTab(url, open_in_background);
        } else {
            GM.openInTab(url, open_in_background);
        }
    }


    function GMgetValue(name, value) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(name, value);
        } else {
            return GM.getValue(name, value);
        }
    }


    function GMsetValue(name, value) {
        if (typeof GM_setValue === "function") {
            GM_setValue(name, value);
        } else {
            GM.setValue(name, value);
        }
    }

    function GMxmlhttpRequest(obj) {
        if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest(obj);
        } else {
            GM.xmlhttpRequest(obj);
        }
    }

    function GMaddStyle(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }
    var originalInterfaceList = [
        //--------------------------------------------------------------------------------------
        {
            name: "线路一",
            type: "1",
            url: "https://bf.ppjbk.cn/?url="
        }, {
            name: "线路二",
            type: "1",
            url: "https://bf.ppjbk.cn/bf/?url="
        }, {
            name: "线路三",
            type: "1",
            url: "https://jx.ppjbk.cn/?url="
        }, {
            name: "线路四",
            type: "1",
            url: "https://jx.ppjbk.cn/jx/?url="
        }, {
             name: "线路五",
            type: "1",
            url: "https://nbjx.vip/?url="
        }, {
        },

        //--------------------------------------------------------------------------------------
        {
            name: "B站一线",
            type: "2",
            url: "https://jx.ppjbk.cn/jx/?url="
        }, {
            name: "B站二线",
            type: "2",
            url: "https://jsap.attakids.com/?url="
        }, {
        },
    ];

    var node = "";
    var player_nodes = [{
        url: "v.qq.com",
        node: "#mod_player"
    }, {
        url: "www.iqiyi.com",
        node: "#flashbox"
    }, {
        url: "v.youku.com",
        node: "#ykPlayer"
    }, {
        url: "www.mgtv.com",
        node: "#mgtv-player-wrap container"
    }, {
        url: "tv.sohu.com",
        node: "#player"
    }, {
        url: "film.sohu.com",
        node: "#playerWrap"
    }, {
        url: "www.le.com",
        node: "#le_playbox"
    }, {
        url: "video.tudou.com",
        node: ".td-playbox"
    }, {
        url: "v.pptv.com",
        node: "#pptv_playpage_box"
    }, {
        url: "vip.pptv.com",
        node: ".w-video"
    }, {
        url: "www.wasu.cn",
        node: "#flashContent"
    }, {
        url: "www.fun.tv",
        node: "#html-video-player-layout"
    }, {
        url: "www.acfun.cn",
        node: "#player"
    }, {
        url: "www.bilibili.com",
        node: "#player_module"
    }, {
        url: "vip.1905.com",
        node: "#player"
    }, {
        url: "www.56.com",
        node: "#play_player"
    }];
    for (var i in player_nodes) {
        if (player_nodes[i].url == host) {
            node = player_nodes[i].node;
        }
    }
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");

    var ImgBase64 = `
        data:image/png;base64,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E3UOUS0hL0WQKuKETHPevXsT6w7v4efZhexrdqWJSEIhpUDKAWHj/Gb7aj6y5hJuf+tmth17O399fRVZJuAcqKPZOcBw1kXHkvloJUeclHArqpJgV0EUJMuYP3qUW3f+hKGi4Jf5KnxrfscIGI65N9+VJmGEaPiG8d8zC7lu6VZW9+3iP8OXcCz0IdWMvJJT65lHtbubvFbB5Q6XK1mmuExxmSPLBM0ztJLRWz/Ohsc3sGL/Fr5bvZqNtiJFH22KA445t9wFpda3pIAPDc1l6PQCbrrin1zVv4eDY0s5ygBZpYar5rg8I8sdmjlcJmSZQ3NH7jI0y8iryrkTw3zp919h7at/4/HKJfzIXcOEl8T+qRR4HN0fuitBYtNy3Oq8NriAQ6MDfODSzdy0bBPZ83DYL8bPbEfzCppnuDxDczcVscuUGXmDd+36I1964h6W7/sXj1UuZoNcx4miVENMRw8FwuJH0lwUpue0RCDl9prVB7ln8UMs+cH/eK2yiDcGlvPU5R/hSPtcfCXHicPFgu5whvf9bysD/9nEeQdfYLiZ8ZPOa3l08i2MeJfEaNQkTqMv5b5HdNF9wahqOaKmtXvrkOIy+t0Jbhp/ifeEHVx6bA+WzWAiU061dYNUmFk/yaxinOiN43kPf3ZL+J0t4znmQhGTyp5SXQEoUvQyYdK76uH7Rk6EOxCf+nvJzintVqIilYz58Rgr5AjvyY8y7+heOidOE6NRr9QY7uzjmUYfL/pe9lsvhbfyHGBTcm9qXwkQPd093CfzL//ZVadOTT5Ub+qSaQemBcO0fEonJ5GAmkKcRCwdNKJmRBGsLsko/iy57Mu8t7aMED21mr3e29Nxuxs78tjhNes/evjYSP1yX1hvIuF0WU5t1DqkxkA0TzQrpZcQQyQWPmn+WBqPoYT7LAksAiht7W7/ZZd1fuWVV775N9nw7Y1852vnSv/aV9eGxuhnhofHbg0+0ykkWlyI00o2qc0w7Vyrti2W+jKWxlp5T51WJVhvT+3n7e2z7z9wYPG2O+8ctv8DOvG96FXDHSUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMTg6NTE6NDcrMDg6MDA2swCDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDE4OjUxOjQ3KzA4OjAwR+64PwAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MJCgPl4AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTBoD/7TAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMjc5MDfqP5WvAAAAEnRFWHRUaHVtYjo6U2l6ZQA1NjQ1QkJMUitHAAAARXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzU4NDQ3NDE1OTFfNF9bMF1niHnVAAAAAElFTkSuQmCC`;

    var sImgBase64 = `
        data:image/png;base64,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7qc5WxH+ahdSjVrfPQQsl9y9NmtGsgYzHRKODUxn5TXvsGTqR+y7OJ+zcSrNrZbRLQ7T3ErS3IxNEoyzuMTgnCFJDC6xJIngEoctOKZUzvHoxp9x9YG3eNJ8kY3MG7H77N8y4dtr8/JW7y5OnrmEM8PtfH3BdpZO6+JUuYNTOhdbHIVLLNYmGGcy5bsMgE0szlmss9iiYcZnJ/jJi4+x5JMt/MNcw+/MzZSDyZtcnwPwWMZ+a22tF6ifBXyZT0+0Uxqawerr3mTN7C00faCUyjMZGj0OcQkkFps4bOIwSYItWGxiGM8gq7te5qGXf8mc7h383VzLWm6nNxZyw3EEAynC9PUjEqvW6zQqmMRxy9KDPDbzL1z7x5Mck+nsmn0Tb89fQ2/LOEJSwFqDiZ7WOMSNx3bR2fUqcw+/z+lqwtOFpaz3nfRFB1rNU7UH0joTQsdzW4isyAI5juhY8vRoHVOSfr45sJu70h3M6T+C2gKptQw3t4FxNJX7KFaG0ODpkTG8Yufygi7gwzgRDQqa1n3ecEEVCFtFpj5/vwb9M4RCo7HIO+RaVYlgEkO7nuWq4nlWhMN09B5hbKWPGCOVZBSnihPZETv4sNLGQZ1A6iUzrPFzohtBf9WY8EMxU9e1x2pYh5pVjUNDqB868j4sFylgAhLBUEEIoD5r06ISqybrLckNa2isVd9dbf3KZmPiAy4OpSWseQT1QuRLoMVaw1gHUT+0RJCIqhJUIQqozc+HvnFWREeE24jUnf1XIG6H8HCMxZIAmCnrAG3XtLxKg95DlNvq58QagBoTtTn5obSW1+u5xI9ou2uU1wDoNmP8CzB6E0gpxp/zf7k3KkqmZpqgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTA2VDE4OjU4OjM2KzA4OjAwZhQp5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0wNlQxODo1ODozNiswODowMBdJkVgAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1MDI4MzE20dcB+AAAABJ0RVh0VGh1bWI6OlNpemUANTI5M0JCTzUp6AAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1NDE3MjU3OTE2XzY5X1swXVzV31QAAAAASUVORK5CYII=`;

    var bImgBase64 = `
        data:image/png;base64,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WHmDeqr80QySaqaaABuER+jTi5UcT79xK52FOh97/8t0FhutiJv0bVSJrRJFgRmNCG2R4/WJy0xdWmmx5EO/PMP0lRpxLsfNOs1NV1/nJYY4q31ZTQvgszJUD+rxieOFN97Pyxf2cGTvCW7fNYnJ5XFiWK4mLC418KJgFBUfuNwKRpXUK4+/cJ65Sp2llYSpS1VcnGd3Z8q/TD1FvdrgMftXLEm8Ti8KhrEnlXW6M4rhzvFJvvmJh6hJkW+/eC+vntlMb0Fpj5WZuRr1xAcOyxY1l0fWsKm/gzhnWKGNDbHnwbceZd/pZ/kJ+3nI7GfVmaA7CBiI6P/kN4L+D6hUp8wudlOTDu7cdYrxkXe4Fm3h7PwAs5dXcM6jajHWoMYi3rYKVNRSaShprp2xcsqDbz7Kvrd+y6/8KA9FN7LoC6CONfnsiej9+2+0ZHR2EEkTz9mZIaquzMHtr3H7xlNE77VxdXmAWlQgVYuXgAslVILNFSh1l9g2kOduOcd9L/2EkcmXeUq28f3oALO+I2gO1ZByBHAYdvy3rgkEXaMbhVJJuGPfJPf0Pc/OX05zfnWEE4P7OVHcxgXXQUpMPoaeIoy0O/bXphifOcWWi29wtao8Zj/A/7KbWSkGoKuEHWjtgsPkd/zIJ649a/JrSqV5qIhzsDlf4W8qr3Fk9RQbXYVGlGc+30Ut107BCD1uiXJjGZumVHyOY3aEJ9jLaemn5ixrQJcsegek1ShyJ0zb6De/05CBB9REna0NMNqq02YbLFjP5qjCmM6wO5lis6/QKTUQT01jLmkHb2s/f2Qj77ouVpxFfdZGm4Zbhw+HMY0zUVT/XGz93I+tFse8dhyi2XTWdaumdGqkwlnt5JzZzjNspY0GORLA4zHU1NJwJig8zc6NousMrz8lWTHGPJvL1V6NDrgTC7OF8XdV402obkClLcjdzPOW7g6HUhUhdUrNQ9XHVF3MqrekThEvmbjNJD6yllbT9EGWrHW/iqLkW2na81602H+Yon96WuzwschIiuGA+NgGzg1iZa1KmofMdc41o/Sy7rumxSynxgCWOE58HNf/NY5Wv5WmA1ODg8/zF8FY+ScIMgTQAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTA2VDE5OjAwOjM2KzA4OjAw2QIc1wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0wNlQxOTowMDozNiswODowMKhfpGsAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1MDI4NDM25q51/wAAABJ0RVh0VGh1bWI6OlNpemUANTg4NkJCu/KUxwAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1MTM2MTk4Mjc0XzYyX1swXYYyMz0AAAAASUVORK5CYII=`;

    var aImgBase64 = `
        data:image/png;base64,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Trq8tvNi6rODLJu7keEw4P61B1j+4iE+6/G5ZfV+Pj1cKCedqgpyo0eRqa8lVZUjVZEhlUvhZV3ctEKlHLyUxxX732L+oW38U5zJPlNXCsHYAkkRwmiICry8eS7vHJjNsvM3kjMbWfFKDwOBxXMVSqlSLe/oD2k/ZslUpknl0qQqM3hZDzft4noKNyVRacUZhUMs3bKKo77gKXkeQakQWUAj4+426VZMSL7P8tt1Szk+XMUdX3mMuc3tyHSW5nEVLF86galNaayFFz7Ks/toiOdKlCvxUgo3HQO7KYVKeTSFfdy1/j4mdmzjUTmP7XZcfFhGxOIw6rv3lXuBuCU7dKSBI4UmvjXnbc4fv5Pu4gS+ecl5fOPcUWzaX+B3b57gxV1FDBKlBI6SSOWglIOjHJyUZOJgF3e8dDfzP9nAc3ImD8qLKWpJ3ORGCQkjBK0vWNDlXtHGDaOTSrFk4U7uv/YRPGX4x0s3ss5cQ0dVI4ORg/IkSoq4Y3ckwhFIAdV6kK9+vJ4l/1nN2I7tPCfP5j4u47hJxckGXQKHAEHLMxYxEl62VKexAukqLrmgnbsnPc7MR7o4ICayecpFvHf2lZzI1aA9D0dKpImoMsNc2LGJ2TtfZdr+rfQELqu8C3gmms1Jo8AGCX8iICxZQmSmPdlTGLaNce9uTulYkvToKMa6AywZ2sI14btMHTiIdVxCx6GQrQOpSBdPkvKHsTriuKhknTONv9o57DD1WG3BhqW4L7sgIJPhiKg96+nlx4/rn8ULKIeIPbVXBOlKmuxRpqf6uEzvp+XEAar9kxhj8N0Mh1P1vGta2OHX0W5HEUYiBi6RTp9CPg2E1NS4fxTj5jzV1ttb/Evgc1aZCEktLllihKSA1AgDEh+BBhthrcAaiwlkHM4kwCWfn+Li5LbleWb36NEVP3IGewa6mye3fVIYDufpMGoo3fVMokDpgjpyM47FahPfLyKBjQw2iuL8bsPEgroUavEjSm/Pc3aPG5e5ubPz1+86Dz/+d55+ZFHnqic/2+TKMI/VrZFvcmgbbzhyRTenXFy0TcaJWF3udK3+EuDIWJDJOEerqpw/1VQ33N/R8Yv3zxh9Gf8Da0YxuA1sN9EAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDMtMDZUMTk6MDE6NDUrMDg6MDAN7WRtAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAzLTA2VDE5OjAxOjQ1KzA4OjAwfLDc0QAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MJCgPl4AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTBoD/7TAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTUwMjg1MDVVSB2xAAAAEnRFWHRUaHVtYjo6U2l6ZQA1MzAyQkIOnyXlAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzY2Mjc5NDIzMDZfMTNfWzBdw0U41wAAAABJRU5ErkJggg==`;

    var qImgBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5QMRATAdmNpapgAACVNJREFUSMddl2mMXlUZx3/nnHvvu8w7GzNvZ+l0pp12mNKWrsCUrSwpi4DKIhibAhoIJgYUvipijfGTiiYYMWpACQQ1BIoIBSq1UHbolCmlLdOWrrN01nZm3u3es/jh3qHFDycnNzn3+T/Pc57zf/6PuPKRIe5akxLf31y4VpRL39VwuzUojAVrwGjQGoxJlgMbgY4gMmB1ciYCbUGH8XcUxbsxEFXIZeW2dCr12A/ua3z5+IkoEqkfOezE4G0G93vromYsCaABa2NjRoOJwFjQ5iyD5gyQKUM462B0lsM6OSPxVGV8Qbv8aX/vg38S6p6h6522T1pnm3HEYMaAM2eAbGIkBGwZ1GkEIWiNqxgoKqiIGMRVvgo6m40kMx52rDpXd4/nU7mnHKSbiWQMKhxIBdqBsOAk0nngn4L2ndi6ndDcj6ybRkiLKQa4w62I8YXQ3w0jeXAaJ1T8P+IrS2saw8rY/ULde8IZ4YN18f0ZE6c6MmBC6rxpSvNfQC/Zgm34AhUJMlNNSJvCOY1WjkpmAlMzjhidi3/8fMxrazGH28BUktQn12FDMAZhNJ6RKRACnAVlwQFYqARckP+An6x/gu3V7/P0cBu5nd8kGG2l+mQn0vhEzlEBpqsGiZqOUG47wszy7bi2Xcj/XId76yKcNbF9iKMWAuckXpxSzhRRpKEkWJXfweM3/5x5+Un27biBjl2XY4uNQIUQh7UCbR3GOFKlNuTwPII9F8PBpZQueB17+2a86iLRSz246CxgBzhQnPvgJiIDoY1BQ8PKlk/4862PUB2U+fVrG3j9k0vwyVJbEzBZCAm1o6O1lusvnc/B41NMlQxzGlJ4KiA6MhfvyHnYxiGiC9+B6Rwcaokzai04B84iv3wazoIVNKRP8cvrfsW8c6Z47I0NbN+zjLIJ0Q5uuLyDGy9fiLGCzrY61q9tJ/A9UimPhzau5qqeNiqE6Ik88pUNMDAf97U3EB0jYGejdiBBYkxS+hHYiNtWPEdP616e2L6ebftWoG1EWMlwcqLMto+GuHX9Ilrn5GhvqeHdvpMcHixw2aq57Ds6xb/eGiC0Htpa3KlW5PYbUZkQ9Y1tSD+KQS1gHRJtmF3V6Uk2rniFY2MtbO5dSxhVCLVHdY3ivIV5hFR8tHeUjtZali5qoFC29KxopaEuy/ufjrO6ew4PbVhK/pwqjItQR1Yh+y6DJV+gukbBiATcIbEanAYs6+b1sazxCM/vvpjhU9VYY4k0ZNNp5rXUksmmeLN3hKaGavL1GQbHymRSPseGStRUBWQzPiMTGs8LsNbHuiwcWIPxQ6Lu3SCj+MUAHiYhDWB+7SHKOmL/iTq0Bg0IITg8XKD/RIFQQ2QEd93Yyc7PJ9j85gChdjgEQjisU3S01nB1TwubdwxxakYjR85HjM+DVQfh1YtwpwIQ4OE0OIEvIubX7+PYSJ7eg51oZzAWVi1u4IKlTUwVNM5CQ12Gr6+by9t9o3zr2gWkAo/2pioGRguUQ0NjXZq25mqOTmh27J7EKYUqN6Eb+yDl4iJzFi9OtSRbFbK4aYAKGYqmGm0F1gk+3j9Jb/8UxkqqsgEP3NHNS28P8scXDxFaifQ81q3M054P+O+uMYbHi8iqaoJ0Gr8qg3GS7NgiFLsYtxLnHDiHh4nASYSrEEiDtY5otje4hF+to64u4M6bFtI1v5anthxhaXceh8I6wUwIly6fwy2XtfLcjkH2j8HhMU0Fi3CCe/8tueqI5a5KyKhQCbA2gKE0LegfmsOqlgMoYyi5NCDwlGRJZy0Xr2xm4JRh79ZBFnfWs25NC/98Z5SZYkQu7TG3qYqdhwpc2TOP+1oybNl1mie3TTJRMKwYOcz8UYOq0l8SiIcxAFS0z96Jbm5a9i6L27/gw2OrkNLS0VZNW1sd7x0OOTZSJjKO87vqOT5WYsfn02jn0VjvMVawbP60zMhUkZVtRfoHQ2aMRzYjaA7HGRA5Qu3H7BU/p1llAcPTC6ivEixdMIHxUxAEDJ02vH9ghtFQETTU0tFez+ruOrb0TlAuRShPkMt4pAKPkpZMFR3b95UYLjhMLsXyqV7apw+zRXUzgQJMQpk6kTFmhu19S9h3sos7Vn9Avm4a6WcIZQBK4JymPudz5/oW9g+GfDoAtXVZchlLR96jFMFM2SE8SZD1CTI+Vcpn7bFdeNMz9HqdIFTcciHhamfAaSYnA5798ApWNO/n9pU7sdkUKghQ6RQLGgO+01NDKbT8fVcRm0kxr6WG+65u4YH1eY5OaApW4KcVMu1BxuOCyb1s7HuOj7w23tZ5iFzC1wZF07c34ZJeFWkGC3muPn8f6xb10Te4gjHbzpquWjpbc+wdKvD+0TJl4yOEYqag0ULhBz4v9BWZiUAGHl6gaK6M88NXfoY62c+P1fUcdw3gorgZOYtizh2bcCZWIM4wNRWwZ6CTG5fvYG37HvZPrORAsZF9Jy1jZYUVPlIoJA6UZKgg+eBoyEwk8HyJTKfIF0d54OVNXP7ZqzyevpTn3bJEj9mEMg2Kc+7YFHvhEvkTMXQyz8GJhdyy5k2u7XqP09O1nCgsxmazSOWhlEB6HiLwUL5C+goZZPEDwyUje7j/xYe5ZM8W/hj08Fu5jlAT9wNn42slQtD1DxeLMr58Y0I4kBkuW97Pbzb+lfnPDvPq7uv5ePHFfNZ1JcO5JqQSKCFwCupdiQuHdrKw/y2uffdZpiuap9Vq/mB6KOoyznhJHRniDhAhWPCEQ6pEBbozu3UgJF2tk3zv0FauKeyhvTTAYGM3Q1XnMJZrQIiAutIYzeVJOiaPcbrk+EjN5XfqIna6NkyYyNpZUBcBEVBBVC/729bpGbkeoc9EzaxEiUld+LAwdZqrpj7gmmCMtrED5IpT4KDiBwznmtlRaebt1Ll8WGlEa2Jh4dxZoPHdQkQuF20V9cufunl6uvwXrWVDHG1ywCWlb5OKNw4hHTXCEERTeFER5zTWCwhFiumSh7FRDDJLSu4sO8ROeL6ZrK1O36s+27rp4OvvjBcnp8KLrDbZL71zLhFnNp4oktmpoi1Fq5ghzYxLUzAe5cjijI7Tav8PUAgQEpD4gZxY1JX+xaOPXvGMKmSus5esyfXuPUS/r0pzy8WwHSsSYa/PGmncWUoxGeisTc6c5aQlAZqNVCKAmhrxVm1t48N3393yTN8n4+H/AIZ4QYH/d3pvAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAzLTE2VDE3OjQ4OjI5KzA4OjAwPa6YJQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMy0xNlQxNzo0ODoyOSswODowMEzzIJkAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQANTCQoD5eAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUwaA/+0wAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjE1ODg4MTA5/RRjigAAABJ0RVh0VGh1bWI6OlNpemUANTQ5NkJCxr4eowAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAvaW1hZ2VsYy9pbWd2aWV3Ml85XzE2MDk5MDM1MTE3MjE2NTg4Xzc0X1swXXTdtQ4AAAAASUVORK5CYII=`;

    var mImgBase64 = `data:image/png;base64,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`;

    var left = 0;
    var top = 100;
    var innerList = [];
    var outerList = [];
    var innerli = "";
    var innerli1 = "";
    var outerli = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "0") {
            innerList.push(item);
            innerli1 += "<li>" + item.nme + "</li>";
        }
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";
        }
        if (item.type == "2") {
            outerList.push(item);
            outerli += "<li>" + item.name + "</li>";
        }
    });
    parseInterfaceList = innerList.concat(outerList);
    GMaddStyle(`#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; background-color:#2E9AFE; z-index:2147483647; font-size:20px; text-align:left;}
    #vip_movie_box .stitle {position: absolute;font-family: "楷体";right: 0;top: 110%;width: 1.3em;padding: 0px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 10px 10px 0;transform: translate3d(100%, -20%, 0); background: #f45a8d;}
    #vip_movie_box .item_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .item_text img {width:30px; height:30px; display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_action li{font-size:14px; color:#DCDCDC; text-align:center; width:80px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_action li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .selected_text {width:0px; padding:2px 0px; text-align:center;}
	#vip_movie_box .selected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_selected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_selected ul{height:455px; overflow-y: scroll;}
    #vip_movie_box .vip_mod_box_selected li{font-size:14px; color:#DCDCDC; text-align:center; width:28px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_selected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .qelected_text {width:0px; padding:2px 0px; text-align:center;}
	#vip_movie_box .qelected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_qelected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:#fff; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_qelected li{font-size:14px;text-align:center; width:150px; line-height:40px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_qelected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .belected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .belected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_belected {display:none; position:absolute; left:30px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_belected li{font-size:14px; color:#fff; text-align:center; width:100px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_belected ul{height:455px; overflow-y: scroll;}
    #vip_movie_box .vip_mod_box_belected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .aelected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .aelected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_aelected {display:none; position:absolute; left:30px; top:80px; text-align:center; background-color:#272930; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_aelected li{font-size:14px; color:#000; text-align:center; width:200px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 10px;}
    #vip_movie_box .vip_mod_box_aelected li:hover{color:#FF4500;background:#00ff00}
    #vip_movie_box .melected_text {width:0px; padding:2px 0px; text-align:center;}
    #vip_movie_box .melected_text img {width:30px; height:30px;display:inline-block; vertical-align:middle;}
    #vip_movie_box .vip_mod_box_melected {display:none; position:absolute; left:30px; top:0px; text-align:center; background-color:#272930; border:1px solid gray;}
    #vip_movie_box .vip_mod_box_melected li{font-size:14px; color:#DCDCDC; text-align:center; width:80px; line-height:27px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;}
    #vip_movie_box .vip_mod_box_melected li:hover{color:#FF4500;background:#00ff00}
    .add{background-color:#00ff00;}`);

    $(function() {
        $("#vip_movie_box").mouseover(function() {
            $(".item_text").slideDown();
            $(".selected_text").slideDown();
            $(".qelected_text").slideDown();
            $(".belected_text").slideDown();
            $(".aelected_text").slideDown();
            $(".melected_text").slideDown();
        });
    });
    $(function() {
        $("#vip_movie_box").click(function() {
            $(".item_text").hide();
            $(".selected_text").hide();
            $(".qelected_text").hide();
            $(".belected_text").hide();
            $(".aelected_text").hide();
            $(".melected_text").hide();
        });
    });
    $(function() {
        $("ul").on("click", "li", function() {
            $("ul li").removeClass("add");
            $(this).addClass("add");
        })
    });

    function selectedList(episodeList) {
        var selectedList = [];
        var innerli = "";
        if (!!episodeList && episodeList.length != 0) {
            episodeList.sort((d1, d2) => {
                return d1.name - d2.name;
            });
            episodeList.forEach((item, index) => {
                selectedList.push(item);
                innerli += "<li title='" + item.description + "'>" + item.name + "</li>";
            });
            $(".vip_mod_box_selected ul").empty();
            $(".vip_mod_box_selected ul").append(innerli);

            $(".selected_text").on("mouseover", () => {
                $(".vip_mod_box_selected").show();
            });
            $(".selected_text").on("mouseout", () => {
                $(".vip_mod_box_selected").hide();
            });
            $(".vip_mod_box_selected li").each((index, item) => {
                item.addEventListener("click", () => {
                    if (document.getElementById("iframe-player") == null) {
                        var player = $(node);
                        player.empty();
                        player.append(videoPlayer);
                    }
                    var num = "";
                    if (host == "www.bilibili.com") {
                        num = 0;
                    } else {
                        num = Math.floor(Math.random());
                    }
                    innerParse(parseInterfaceList[num].url + selectedList[index].href);
                });
            });
        }
    }

    var html = $(`
    <div id='vip_movie_box'>
    <div class="stitle"><ul id="m">解析</ul></div>
    <div class='item_text'>
        <img src='` + ImgBase64 + `' title='视频解析'/>
        <div class='vip_mod_box_action' >
            <div style='display:flex;'>
                <div style='width:295px; padding:10px 0;'>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>全网VIP视频解析</div>
                    <ul style='margin:0 5px;'>
` + innerli + `

                        <div style='clear:both;'></div>
                    </ul>
                    <ul style='margin:0 5px;'>
` + innerli1 + `

                        <div style='clear:both;'></div>
                    </ul>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>B站大会员番剧解析(专用线路)</div>
                    <ul style='margin:0 5px;'>
` + outerli + `

                        <div style='clear:both;'></div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class='selected_text' >
        <div class='vip_mod_box_selected' >
            <div style='display:flex;'>
                <div style='width:295px; padding:10px 0;'>

                    <ul style='margin:0 13px;'></ul>
                </div>
            </div>
        </div>
    </div>
 <div class='melected_text'>

        <div class='vip_mod_box_melected' >
            <div style='display:flex;'>
                <div style='width:auto; padding:10px 0;'>

                    <hr>
                    <div style='font-size:15px; text-align:center; line-height:10px;'>&nbsp;</div>
                    <ul>

                    </ul>
                      <ul>

                    </ul>
                </div>
             </div>
         </div>
    </div>
     <div class='qelected_text'>

        <div class='vip_mod_box_qelected' >
            <div style='display:flex;'>
                <div style='width:330px; padding:10px 0;'>
                    <div style='font-size:15px; text-align:center; line-height:21px;'>&nbsp;</div>
                    <hr>
                    <hr>
                    <div style='font-size:15px; text-align:center; line-height:10px;'>&nbsp;</div>
                    <ul>
                        <li>
                        </li>
                    </ul>
                     <ul>
                        <li>
                        </li>
                    </ul>
                </div>
             </div>
         </div>
    </div>
    <div class='belected_text'>
        <img src='` + bImgBase64 + `' title='高清电视'/>
        <div class='vip_mod_box_belected' >
            <div style='display:flex;'>
                <div style='width:360px; padding:5px 0;'>
                   <div style='font-size:20px; text-align:center; color:#DF0174; padding:5px 0px;'>电视节目观看</div>
                   <div style='font-size:11px; text-align:center; color:#fff; padding:5px 0px;'>使用说明：进入电视频道如果一直转圈，先点一下暂停，再点播放，就可以正常观看了。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
						<ul>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv1hd">CCTV-1高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv2hd">CCTV-2高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv3hd">CCTV-3高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv4hd">CCTV-4高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv5hd">CCTV-5高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv6hd">CCTV-6高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv7hd">CCTV-7高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv8hd">CCTV-8高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv9hd">CCTV-9高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv10hd">CCTV-10高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv12hd">CCTV-12高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv14hd">CCTV-14高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv17hd">CCTV-17高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv1hd">北京卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv2hd">北京文艺高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv4hd">北京影视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv9hd">北京新闻高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv11hd">北京冬奥高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hunanhd">湖南卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=zjhd">浙江卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jshd">江苏卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dfhd">东方卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ahhd">安徽卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hljhd">黑龙江卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lnhd">辽宁卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=szhd">深圳卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gdhd">广东卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=tjhd">天津卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbhd">湖北卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdhd">山东卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cqhd">重庆卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dnhd">福建东南高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=schd">四川卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbhd">河北卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jxhd">江西卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hnhd">河南卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gxhd">广西卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jlhd">吉林卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lyhd">海南卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gzhd">贵州卫视高清</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv1">CCTV-1综合</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv2">CCTV-2财经</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv3">CCTV-3综艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv4">CCTV-4国际</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv6">CCTV-6电影</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv7">CCTV-7军事</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv8">CCTV-8电视剧</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv9">CCTV-9纪录</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv10">CCTV-10科教</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv11">CCTV-11戏曲</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv12">CCTV-12社会</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv13">CCTV-13新闻</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv14">CCTV-14少儿</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv15">CCTV-15音乐</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv16">CGTN</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv17">CCTV-17农业</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv1">北京卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv2">北京文艺</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv3">北京科教</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv4">北京影视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv5">北京财经</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv7">北京生活</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv8">北京青年</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv9">北京新闻</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv10">北京卡酷少儿</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv11">北京冬奥纪实</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=zjtv">浙江卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hunantv">湖南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jstv">江苏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dftv">东方卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sztv">深圳卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ahtv">安徽卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hntv">河南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxtv">陕西卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jltv">吉林卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gdtv">广东卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdtv">山东卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbtv">湖北卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hebtv">河北卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xztv">西藏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nmtv">内蒙古卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=qhtv">青海卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sctv">四川卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=tjtv">天津卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxrtv">山西卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lntv">辽宁卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xmtv">厦门卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xjtv">新疆卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hljtv">黑龙江卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=yntv">云南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jxtv">江西卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dntv">福建东南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gztv">贵州卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nxtv">宁夏卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gstv">甘肃卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cqtv">重庆卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=bttv">兵团卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ybtv">延边卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sstv">三沙卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lytv">海南卫视</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdetv">山东教育</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv1">CETV-1</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv3">CETV-3</a></li>
                        <li><a style="color:#D8D8D8;"target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv4">CETV-4</a></li>
					</ul>
                </div>
            </div>
        </div>
    </div>
    <div class='aelected_text'>
        <img src='` + aImgBase64 + `' title='实用工具'/>
        <div class='vip_mod_box_aelected' >
            <div style='display:flex;'>
                <div style='width:230px; padding:10px 0;'>
                    <div style='font-size:16px; text-align:center; color:#DF0174; line-height:21px;'>实用工具</div>
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://greasyfork.org/zh-CN/scripts/422277-%E6%97%A0%E5%B7%AE%E5%88%AB%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7" target="_blank">无差别视频提取工具</a>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="http://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html" target="_blank">m3u8 视频在线提取工具</a>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#D8D8D8;"href="https://maple3142.github.io/mergemp4/" target="_blank">视频合成工具</a>
                        </li>
                    </ul>
                     <ul>
                        <li>
                    </ul>
                </div>
            </div>
      </div>
</div>`);

    $("body").append(html);
    $(".item_text").on("mouseover", () => {
        $(".vip_mod_box_action").show();
    });
    $(".item_text").on("mouseout", () => {
        $(".vip_mod_box_action").hide();
    });

    $(".selected_text").on("mouseover", () => {
        $(".vip_mod_box_selected").show();
    });
    $(".selected_text").on("mouseout", () => {
        $(".vip_mod_box_selected").hide();
    });

    $(".belected_text").on("mouseover", () => {
        $(".vip_mod_box_belected").show();
    });
    $(".belected_text").on("mouseout", () => {
        $(".vip_mod_box_belected").hide();
    });

    $(".aelected_text").on("mouseover", () => {
        $(".vip_mod_box_aelected").show();
    });
    $(".aelected_text").on("mouseout", () => {
        $(".vip_mod_box_aelected").hide();
    });
    $(".qelected_text").on("mouseover", () => {
        $(".vip_mod_box_qelected").show();
    });
    $(".qelected_text").on("mouseout", () => {
        $(".vip_mod_box_qelected").hide();
    });
    $(".melected_text").on("mouseover", () => {
        $(".vip_mod_box_melected").show();
    });
    $(".melected_text").on("mouseout", () => {
        $(".vip_mod_box_melected").hide();
    });

    $(".vip_mod_box_action li").each((index, item) => {
        item.addEventListener("click", () => {
            if (parseInterfaceList[index].type == "1", "2") {
                if (document.getElementById("iframe-player") == null) {
                    var player = $(node);
                    player.empty();
                    player.append(videoPlayer);
                }
                innerParse(parseInterfaceList[index].url + location.href);
            }
            if (parseInterfaceList[index].type == "0") {
                GMopenInTab(parseInterfaceList[index].url + location.href, false);
            }
        });
    });
    $("#m").click(function(){
        var play_jx_url = window.location.href;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
            mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
            mobile_html += "<div><iframe src='https://www.eggvod.cn/mobile.php?zhm_jx="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
            mobile_html += "</div>";
            $("body").html(mobile_html);
        } else {}
    });
    (function() {
        $("body").append("");
        setTimeout(function() {
            $("#loading").remove();
            $("#player_module").after('<div class="bottom-page paging-box-big"><span class="current" style="background: #f45a8d;" id="go">站外下载视频</span><span>免责声明：请通过合法渠道购买VIP下载大会员内容,脚本仅对网页布局进行修改，不含任何漏洞利用，入侵，绕过等方式实现的功能</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因使用脚本造成任何后果的，脚本作者不承担任何责任。</span></div>');
            $("#go").click(function() {
                var aaa = $(".media-title").attr("title");
                var bbb = aaa.replace(/\s/g,"");
                var tempwindow = window.open("_blank");
                tempwindow.location = "https://d.ppjbk.cn/vodsearch/-------------.html?wd=" + bbb
            })
        }, 4000)
    })();
    switch (host) {
        case 'www.iqiyi.com':
            //--------------------------------------------------------------------------------
            unsafeWindow.rate = 0;
            unsafeWindow.Date.now = () => {
                return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
            }
            setInterval(() => {
                unsafeWindow.rate = 0;
            }, 600000);
            //--------------------------------------------------------------------------------
            setInterval(() => {
                $('div[style*="top: 74px"]').attr("id", "absolute");
                $("#absolute").css("zIndex",0)
            }, 500);

            setTimeout(() => {
                var episodeList = [];
                var i71playpagesdramalist = $("div[is='i71-play-ab']");
                if (i71playpagesdramalist.length != 0) {
                    var data = i71playpagesdramalist.attr(":page-info");
                    if (!!data) {
                        var dataJson = JSON.parse(data);
                        var albumId = dataJson.albumId;
                        var barlis = $(".qy-episode-tab").find(".bar-li");
                        var barTotal = barlis.length;
                        if (barTotal == 0) {
                            barTotal = 1;
                        }
                        for (var page = 1; page <= barTotal; page++) {
                            GMxmlhttpRequest({
                                url: "https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=" + albumId + "&page=" + page + "&size=30",
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                onload: response => {
                                    var status = response.status;
                                    if (status == 200 || status == '200') {
                                        var serverResponseJson = JSON.parse(response.responseText);
                                        var code = serverResponseJson.code;
                                        if (code == "A00000") {
                                            var serverEpsodelist = serverResponseJson.data.epsodelist;
                                            //console.log(serverEpsodelist)
                                            for (var i = 0; i < serverEpsodelist.length; i++) {
                                                var name = serverEpsodelist[i].order;
                                                var href = serverEpsodelist[i].playUrl;
                                                var description = serverEpsodelist[i].subtitle;
                                                episodeList.push({
                                                    "name": name,
                                                    "href": href,
                                                    "description": description
                                                });
                                                //mylog({"name":name, "href":href, "description":description});
                                            }
                                            selectedList(episodeList);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }, 2000);
            break
        case 'v.qq.com':
            //--------------------------------------------------------------------------------
            setInterval(() => {
                $(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
                $(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
            }, 1000)
            //--------------------------------------------------------------------------------

            setInterval(() => {
                var txp_btn_volume = $(".txp_btn_volume");
                if (txp_btn_volume.attr("data-status") === "mute") {
                    $(".txp_popup_volume").css("display", "block");
                    txp_btn_volume.click();
                    $(".txp_popup_volume").css("display", "none");
                }
                //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
                $(".mod_vip_popup").css("display", "none");
                $(".tvip_layer").css("display", "none");
                $("#mask_layer").css("display", "none");
            }, 500);
            window.onload = setTimeout(() => {
                var episodeList = [];
                var COVER_INFO = unsafeWindow.COVER_INFO;
                var VIDEO_INFO = unsafeWindow.VIDEO_INFO;
                var barTotal = COVER_INFO.nomal_ids.length;
                for (var page = 1; page <= barTotal; page++) {
                    var i = page - 1
                    if (VIDEO_INFO.type_name == "动漫" || VIDEO_INFO.type_name == "电视剧" || VIDEO_INFO.type_name == "电影") {
                        var F = COVER_INFO.nomal_ids[i].F;
                        if (F != "0" && F != "4") {
                            var V = COVER_INFO.nomal_ids[i].V;
                            var cover_id = COVER_INFO.cover_id;
                            var name = COVER_INFO.nomal_ids[i].E;
                            var href = "https://v.qq.com/x/cover/" + cover_id + "/" + V + ".html";
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": ""
                            });
                            //mylog({"name":name, "href":href, "description":""});
                        }
                    }
                }
                selectedList(episodeList);
            }, 2000);
            break
        case 'v.youku.com':
            window.onload = function() {
                if (!document.querySelectorAll('video')[0]) {
                    setInterval(() => {
                        document.querySelectorAll('video')[1].playbackRate = 16;
                    }, 100)
                }
            }
            //--------------------------------------------------------------------------------
            setInterval(() => {
                var H5 = $(".h5-ext-layer").find("div")
                if (H5.length != 0) {
                    $(".h5-ext-layer div").remove();
                    var control_btn_play = $(".control-left-grid .control-play-icon");
                    if (control_btn_play.attr("data-tip") === "播放") {
                        $(".h5player-dashboard").css("display", "block");
                        control_btn_play.click();
                        $(".h5player-dashboard").css("display", "none");
                    }
                }
                $(".information-tips").css("display", "none");
            }, 500);
            window.onload = setTimeout(() => {
                var Num;
                var episodeList = [];
                var videoCategory = unsafeWindow.__INITIAL_DATA__.data.data.data.extra.videoCategory;
                if (videoCategory == "动漫" || videoCategory == "电影" || videoCategory == "少儿") {
                    Num = 1;
                } else if (videoCategory == "电视剧" || videoCategory == "综艺") {
                    Num = 2;
                }
                if (!!Num) {
                    var data = unsafeWindow.__INITIAL_DATA__.data.model.detail.data.nodes[0].nodes[Num];
                    var barTotal = data.nodes.length;
                    for (var page = 1; page <= barTotal; page++) {
                        var i = page - 1
                        if (data.nodes[i].data.videoType == "正片") {
                            if (videoCategory == "综艺" || videoCategory == "少儿") {
                                var name = i + 1;
                            } else {
                                name = data.nodes[i].data.stage;
                            }
                            var vid = data.nodes[i].data.action.value;
                            var title = data.nodes[i].data.title;
                            var href = "https://v.youku.com/v_show/id_" + vid + ".html";
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": title
                            });
                            //mylog({"name":name, "href":href, "description":title});
                        }
                    }
                    selectedList(episodeList);
                }
            }, 2000);
            break
        case 'www.mgtv.com':

            //--------------------------------------------------------------------------------
            setTimeout(() => {
                var episodeList = [];
                var str = location.href;
                var index = str.lastIndexOf("\/"); //斜杠 分割
                str = str.substring(index + 1, str.length);
                index = str.lastIndexOf(".html");
                var albumId = str.substring(0, index);
                //mylog(albumId)
                var barlis = $(".episode-header").find("a");
                var barTotal = barlis.length;
                if (barTotal == 0) {
                    barTotal = 1;
                }
                for (var page = 1; page <= barTotal; page++) {
                    GMxmlhttpRequest({
                        url: "https://pcweb.api.mgtv.com/episode/list?_support=10000000&video_id=" + albumId + "&page=" + page + "&size=30",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: response => {
                            var status = response.status;
                            if (status == 200 || status == '200') {
                                var serverResponseJson = JSON.parse(response.responseText);
                                var code = serverResponseJson.code;
                                if (code == "200") {
                                    var serverEpsodelist = serverResponseJson.data.list;
                                    //mylog(serverEpsodelist)
                                    for (var i = 0; i < serverEpsodelist.length; i++) {
                                        var font = serverEpsodelist[i].corner[0].font;
                                        if (font != "预告") {
                                            var name = serverEpsodelist[i].t1;
                                            var href = serverEpsodelist[i].url;
                                            href = "https://www.mgtv.com" + href;
                                            var description = serverEpsodelist[i].t2;
                                            episodeList.push({
                                                "name": name,
                                                "href": href,
                                                "description": description
                                            });
                                            //mylog({"name":name, "href":href, "description":description});
                                        }
                                    }
                                    selectedList(episodeList);
                                }
                            }
                        }
                    });
                }
            }, 2000);
            break
        case 'tv.sohu.com':
            setInterval(() => {
                $("#player").find("video")[1].currentTime = 1000;
            }, 1000);
            window.onload = setTimeout(() => {
                var episodeList = [];
                var albumId = unsafeWindow.playlistId;
                var barTotal = 1;
                for (var page = 1; page <= barTotal; page++) {
                    GMxmlhttpRequest({
                        url: "https://pl.hd.sohu.com/videolist?playlistid=" + albumId + "&pagenum=1&pagesize=999",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: response => {
                            var status = response.status;
                            if (status == 200 || status == '200') {
                                var serverResponseJson = JSON.parse(response.responseText);
                                var serverEpsodelist = serverResponseJson.videos;
                                for (var i = 0; i < serverEpsodelist.length; i++) {
                                    var name = serverEpsodelist[i].order;
                                    var href = serverEpsodelist[i].pageUrl;
                                    var description = serverEpsodelist[i].name;
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": description
                                    });
                                    //mylog({"name":name, "href":href, "description":description});
                                }
                                selectedList(episodeList);
                            }
                        }
                    });
                }
            }, 2000);
            break
        case 'www.fun.tv':
            setTimeout(() => {
                var control_btn_play = $(".fxp-controlbar .btn-toggle");
                if (control_btn_play.is('.btn-play')) {
                    control_btn_play.click();
                }
            }, 500);
            setInterval(() => {
                $("#play-Panel-Wrap").css("display", "none");
            }, 500);

            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.vplayInfo.dvideos[0];
                var barTotal = data.videos.length;
                for (var page = 1; page <= barTotal; page++) {
                    var lists = data.videos[page - 1].lists.length;
                    for (var i = 1; i <= lists; i++) {
                        var name = data.videos[page - 1].lists[i - 1].title;
                        var url = data.videos[page - 1].lists[i - 1].url;
                        var title = data.videos[page - 1].lists[i - 1].name;
                        var dtype = data.videos[page - 1].lists[i - 1].dtype;
                        if (!!name && !!url && dtype == "normal") {
                            var href = "http://www.fun.tv" + url;
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": title
                            });
                            //mylog({"name":name, "href":href, "description":title});
                        }
                        selectedList(episodeList);
                    }
                }
            }, 2000);
            break
        case 'www.bilibili.com':

            setInterval(() => {
                $(".player-limit-mask").remove();
            }, 500);
            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.__INITIAL_STATE__;
                var barTotal = data.epList.length;
                for (var page = 1; page <= barTotal; page++) {
                    var i = page - 1
                    var badge = data.epList[i].badge
                    var name = data.epList[i].title;
                    var id = data.epList[i].id;
                    var title = data.epList[i].longTitle;
                    if (!!name && !!id && badge != "预告") {
                        var href = "https://www.bilibili.com/bangumi/play/ep" + id;
                        episodeList.push({
                            "name": name,
                            "href": href,
                            "description": title
                        });
                    }
                    //mylog({"name":name, "href":href, "description":title});
                }
                selectedList(episodeList);
            }, 2000);
            break

        case 'v.pptv.com':

            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.webcfg;
                var dataJson = data.playList.data;
                var barTotal = dataJson.list.length;
                for (var page = 1; page <= barTotal; page++) {
                    var i = page - 1
                    var name = dataJson.list[i].rank + 1;
                    var href = dataJson.list[i].url;
                    var title = dataJson.list[i].title;
                    if (!!name && !!href) {
                        episodeList.push({
                            "name": name,
                            "href": href,
                            "description": title
                        });
                    }
                    //mylog({"name":name, "href":href, "description":title});
                }
                selectedList(episodeList);
            }, 2000);
            break
            //--------------------------------------------------------------------------------
        case 'www.wxtv.net':
               $("#vip_movie_box").remove();
               $(".searchlist_item").find("a").attr("id", "bbb");
               $("#topnav").remove();
               $("#mygod2m").remove();
               $("#mygod2pc").remove();
               $(".bgi_box").remove();
               $(".content_btn").remove();
               $(".hidden_xs").remove();
               $("#bofy").remove();
               $(".fo_t").remove();
               $(".list_scroll").remove();
               $(".title").remove();
            setInterval(() => {
               $("#bbb")[0].click();
            }, 500);
            break
            //--------------------------------------------------------------------------------
        case 'wetv.vip':
            setInterval(() => {

            }, 500);
            break
            //--------------------------------------------------------------------------------
              case 'www.eggvod.cn':
                $("#vip_movie_box").remove();
                  var yhq=$(`
                <div>

                       `);
             $(".tips").html(yhq)
            setInterval(() => {
            }, 500);
            break
            //--------------------------------------------------------------------------------
        case 'music.163.com':
            $(".item_text").remove();
            $(".qelected_text").remove();
            $(".selected_text").remove();
            $(".aelected_text").remove();
            $(".belected_text").remove();
            $("#m").remove();
            setInterval(() => {
                $(".melected_text").show();
            }, 500);
            break
           //--------------------------------------------------------------------------------
        case 'y.qq.com':
            $(".item_text").remove();
            $(".qelected_text").remove();
            $(".selected_text").remove();
            $(".aelected_text").remove();
            $(".belected_text").remove();
            $("#m").remove();
            setInterval(() => {
                $(".melected_text").show();
            }, 500);
            break
           //--------------------------------------------------------------------------------
         case 'www.kugou.com':
            $(".item_text").remove();
            $(".qelected_text").remove();
            $(".selected_text").remove();
            $(".aelected_text").remove();
            $(".belected_text").remove();
            $("#m").remove();
            setInterval(() => {
                $(".melected_text").show();
            }, 500);
            break
           //--------------------------------------------------------------------------------
          case 'www.kuwo.cn':
            $(".item_text").remove();
            $(".qelected_text").remove();
            $(".selected_text").remove();
            $(".aelected_text").remove();
            $(".belected_text").remove();
            $("#m").remove();
            setInterval(() => {
                $(".melected_text").show();
            }, 500);
            break
           //--------------------------------------------------------------------------------
           case 'video.zhihu.com':
            $(".item_text").remove();
            $(".qelected_text").remove();
            $(".selected_text").remove();
            $(".aelected_text").remove();
            $(".belected_text").remove();
            $(".melected_text").remove();
            $("#m").remove();
            setInterval(() => {
            }, 500);
            break
           //--------------------------------------------------------------------------------
        default:
            break
    }

    var localurl = location.href;

    function addScript(url) {
        var s = document.createElement('script');
        s.setAttribute('src', url);
        document.body.appendChild(s);
    }
    var reg_acfun = /www.acfun.cn\/v\/.*/;

    function acfun() {
        var ele, content = '',
            h1, videolist;
        try {
            h1 = $('h1.title');
            videolist = JSON.parse(videoInfo.currentVideoInfo.ksPlayJson).adaptationSet[0].representation;
            if (videolist.length > 0 && $('div#downloadlist').length == 0) {
                for (var i = 0; i < videolist.length; i++) {
                    content = content + `
            <div style="margin:5px 0px;">
                <div style="display:inline-block;font-weight:bold;width:10%;">${videolist[i].qualityLabel}：</div>
                <input type="text" style="color:#5FB404;width:68%" value="${videolist[i].url}">
                </div>`;
                }
                ele = `
                <div id="downloadlist" style="margin:15px 0px;color:#DF0174;">
                    <div>\u8BF7\u4F7F\u7528m3u8\u4E0B\u8F7D\u5DE5\u5177（
                        <a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">\u63A8\u8350\u5DE5\u5177</a>）
                    </div>${content}</div>`;
            }
            h1.after(ele);
        } catch (e) {
            console.log('acfun', e.message);
        }
    }

    function xsyhnbrun() {
        if (reg_acfun.test(localurl)) {
            acfun();
        }
    }
    setInterval(xsyhnbrun, 500);
})();
