// ==UserScript==
// @name         划词搜索（电商版）
// @version      1.2
// @namespace    http://tampermonkey.net/
// @description  【基于划词搜索（pc版）修改，方便个人使用】划词搜索，快速选择搜索引擎，一键搜索，跳转百度，谷歌，必应等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       yuensui
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/370013/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E7%94%B5%E5%95%86%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/370013/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E7%94%B5%E5%95%86%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },

    };
    var iconArray = [
        {
            name: '打开',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAjlJREFUSEvtlruuqUEUx//ut4bOZUsEjUbrEi+gEOLyBN5Aoab0EhKVitAqdKLRSEgkmydACFvcfceM+eJ89oedfXBOss+vmZk1M2vNmpm1ZiTcEfwFpKx8OT/P8EPOOJVKIZ/PQ6vVMskZon632+H9/R16vZ5JATkrP7FcLpHNZtHv9yGRSJj0zHQ6RaFQgNlsxnw+h0wmg1R62kAy3mAwQKFQ0PZ4PEan00EgEKBtgqjHxKjL5aIKttstkwoZjUbodrtwOBy0vVqt6HiyALlcjmg0Sr0kxieTCYrFIrxeLx1LEPU4k8lQJW63G+l0miq9ZL1ew2QysRagVqtZDYjFYtRDsgidTke3+xPE40vi8ThnsVi4RqPBJF8nHA5zx13gjEYjNxgMuGAwyL29vXHNZpONOCF6q/kz3Ww2tPwqkUiEerpYLFAul2G32/Hx8cF6hdwMp+PCWO0+vFFiqFQqwefzsR5xHhLHyWQS7XabelqtVuH3+1kPsN/vBSXPQwwfDgfMZjNUKhV4PB4mPWG1WjEcDmGz2ZiEcTpqIYlEgl6uer3OJH/GMSpY7cxDPL6HSqVitTNPM1yr1Wj2CoVCTCLkaYZJxtJoNILE8jtP3WqSu/mccMlLzliMf9PwtW36Cvfmiho+hhktlUolLb8DP5fXdYnos0iSe6vVQi6Xu/os3oLcZDKX3Gz+vb7k2x+BexCjRHWv1xMNqat/LuIl+RBc+/rcgqh0Op10/rU4/v+hfxk/zTDwCyMemuJBYiocAAAAAElFTkSuQmCC',
            host: [''],
            popup: function (text) {
                if(text.indexOf("http://")==0||text.indexOf("https://")==0)
                window.open(text, "_blank");
                else window.open("http://"+text, "_blank");
            }

        },
                {
            name: '今日付款',
            image: 'https://img11.360buyimg.com/img/jfs/t1/54681/8/3582/123432/5d15b19cE235a1f4b/3d0186b1418f0c66.jpg',
            host: ['www.taobao.com'],
            popup: function (text) {
                open('https://s.taobao.com/search?tab=vsearch&q=' + encodeURIComponent(text)+"&sort=renqi-desc");
            }
        },
                {
            name: '淘宝搜索',
            image: 'data:image/jpeg;base64,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',
            host: ['www.taobao.com'],
            popup: function (text) {
                open('https://s.taobao.com/search?q=' + encodeURIComponent(text));
            }
        },
                {
            name: '拼多多',
            image: 'https://ooyyee-static.qiniu.ooyyee.com/market/company/logo/20181225/1545714680441592.jpg',
            host: ['www.pinduoduo.com'],
            popup: function (text) {
                open('http://mobile.yangkeduo.com/search_result.html?search_key=' + encodeURIComponent(text));
            }
        },
        {

            name: '必应',
            image: 'data:image/png;base64,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',
            host: ['cn.bing.com'],
            popup: function (text) {
                open('https://www.bing.com/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '谷歌',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARBSURBVEhL7ZVbaBxVGMf/c9vJ7qZWm91tgmgasUXU0igNVB+0WF+kXmoqfRMFrX0s9KGlWhAEX3wwVEQffFAQsdqIVSlqRYNorLRFWluo2lDUSmrVbC57yc7Ozf83M9tsJrub1UB98Qdnzsy5fP/zfec7ZxSf4D9Ajeorzv/CV4x/lFz26ZMof3AQ9skTcH8fBzhT6+5Bon89klu2wVjbH41cnLaE3b/+wPTO7bAv/Aw1vQwwNM5kkamOw1KFVyhC7+3D1S+/Di2TjWY2Z1Fh69g3mN61A+o1XfA1DYriB3pwPQqzKGrY5inwSwWgaiE3eiac3IKWwva5HzH5+FZo2ZXwFRr2vNC47UDNraTTGtzfLjACOhTDZL+L7GfHuJDIQAtaCv95751Q0h1MQRU+Q+qXZrBs1z4k7x+MRoSUh99C8ZUh5D4/TottqJKmws7pFzC19116sQLQbca8gszhr6DoejRiaTQX/joDJeGg8OZNqIxayLx3EHrfjVHv0mko7NsTcEYobGahpMqwTg0g9eRI1DvHayNVpE3ufWRCnswz5gNzzwUyVynY3G8EfXEaC09+CefERnqc5d7OQFu9G+r1z0W9c9yyp4gsT5dYCIxElqRyKLw8peCTPemwMUbjm8st8iFJIhZpATlpXUDaBFIJ1h1K4HknS6r2zpz0Gu9iQGNho4sPmeQzoVWo1g9Bc5x80cNkyUe+xFrey364XE71WGQhcWprCULt8XyKQA3ft+EcScAwl/Orip0zd2P/gx+HnXX8dNENLjGxpfIYmdzOh18sByG2HB+39WoYejQZDo6QnVU4tqHHimLA6FyFCVfFxolBHC4kMTz2adQ7x5oeDX05DTewrMqqOPWrC40WJbksnsANq7mqGLWUuiwcz7HzvS9h/fhdqNJKj9mBfUeHMDr+XdS7kIsTwLPDFveYH4xzpepjcGB+RtdrXM5ql/mv8Qqs574PtyM/O4WEZnASb7LZPDZddweeunUb1natYWRUjE3/gnfG3seBozaundrNC6aCQsXB5tsNPPMQs68Ol/e7JiEhLYVd3r3r3t6CtJ6EoercSx+WW0XZqcD2GEui8y9laiY6TBuq3Q3j3H6YuoYje+fvrVCvMe8cO7yP9diVWKyWsenQY5h1LHQaKc5gI2co8sLalxuDePxTTdt5rEhkMLr1wILzErc9T1hWFGRcXYbXeP74q3jj7CEk6HlCTXBMeFQkKhWvCtt18MTNj+DpgR1Bez1yakSmPqLzhAVZWXB2G4gLH53/At9e+h7jpUuB8z3pHDZ0r8MDffeEA2KIqJR4JBcICzb/t5IEzcTbRQRdFqPBH62hsCCeS5dhNL7kF8O27WDb4p7WaCosSFeVBjR63sxAHJsLFk8TXLAIN6OlcA0ZIh6EKME21IxKn4STL8G3RKiVYI22hONI9su0mkD8/LfDvxJeOsDfm07+Nc7On9MAAAAASUVORK5CYII=',
            host: ['www.google.com'],
            popup: function (text) {
                open('https://www.google.com/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '百度搜索',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARRSURBVEhLzZbri5ZVFMX7C4KIMrtoWZalVnaP7h+K8FMkUhB96EJ0gyjUTC0dzczsYpk0mN2dRMpRKq0ou4mYTuIIWiZW5niZspxMs1HT1fq1zzPzvPd3IKgFh/d5zz7nrLP3Xvucc5j+I/z/iZd/L90zT5r+aeoog7370kcdqIv4sw3ScWOkAROlPuOkm15JhoS2DmnoTOmsx6SJi1NnDdRFzKKDHpXOfVw6Z4p07EPSmi1h290pnTlZOsObgpiNTf4gbNVQFzFEEEJMO3WCQ/5J2EY2x//MNsTjiE4t1E2cLUw7rUF6NhEPdCTOtqd5e5+x0rrtYa+Euoj7Onx5j/vbw8alYSuOBt9HjQpbNZQQz18tDZvlEM7vVuktr4eXLEooez0odewN20XTnFvnOCMe4HG3zQlbNRQQN7dKve3BwEmRt34PS4fc3/FHLIrnJziML3wR4wGe4/XpFlf/8RaZ5yK4WiggvmaGNDipl4aX978dtj1ebOEaqbUt/udB/91zpQmLgrTzQETpekfu5lel9e1pYA5dxL/skU7xjvP5QjS0nuKq6aEDnKD2aW07kzGhi3j7riiDjDQjpkaL0bk/6rjdc4qxcUeQ5h0gbaMWpAEJXcS7/ozcDsmVBqRXevd5jHs3DhMWw5MbX5L+OpiMRsumsOWJGU/Y8yjI8b0+i09+JJSLt0Rg9rJkNG63Wk+y4LBlCkcHVzydBhgtP5YnHvZiGpBQQHzIEh4+2+TONRuY9H4yGE0rQ9VEhJYtzC+hvaMpxq3bVqoVFH+XxZdHAXElkM9+3ghn8XlTpfPdisn7OhKz0qFymSPA5kkdpMc7ciudgjxqEi/dGJMhhXy1y2nH7shv3iu+qfHFa2PemHd8kLzh9DgSS76NvjyqEhNeckrOOByOHCmt2iztpPTcR34RIMRZvtHFvFVpgSqoSDzWO8YDvBy9UFrgU23OCpP6FNv2W5DM/DzUSr1e8IQ09cPIZa/R3bdXJZQlbvBlfqI9pWWh2+LLfu3W+N7sw2CQ8wem+O5FXJcnZS9zatgsc3mxVEIJ8YafYyLCGJ5KYG5LhPCIEZFfPObiBw0+JiG+9Kn4//E3URH/CM5V8PLy6C9GCfEzDhELIaiG96Lvvrfi1iH0Wagz4vEeQ/kUE5N38n/Jk9FfjBJiwgwJobzVqgQs3tt5O/yBbo+zUFPrx9iGhyBPzEFzoXNfDiXEr30ZNchCKDo73HnwLUr5/un38D5Dq+v86/TiWLK+m5h7+mLf1+VQQsxlQfmwW9pgT270/bvVXmbervjBm/LiN/ic5qRiI8xr92+Tlc98iKn1O99MCxehhBhQJpw2nLE0xIa4CCnPGhpRweuj/RohDXwjpuycZh4R+863VTmUJQbNfgJd1yhd/Vw8EPjFwxF+VVLP2KntaR+F+qllNsdDj01f+7z0lS+MSqhI3FMc9AXD1brpV2mfXyC18K8R9wzS35XpXuCn7a8LAAAAAElFTkSuQmCC',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
            }
        },
        {
            name: '百度翻译',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUsSURBVEhLxVdpbFRlFJ2YiFCRpSJQEDUxLijESGLcEiMxGDVxC4mJifhDEiEmKjGgqChaECibsiiKUimLFOLSFgSKsmglti7IIkgEClhDKyoW5s1bZt6b4znfm9dOh2moUuNNzmTmW+75vnvPve9NDBlrPBVgzFoPg+YkUDjdQp8ZiU6BfMnnmCoPjVaQYQMMcdmOJGLj4ygotjqVNIJ8yrc4xGWIG+OBGci34b+AuBTd2FiGQKfJXXDhdMHKIPyduyYftK7XNAs9XssfPXGJM3ZJnpxqs8Z6crMcyJF+C/ouaC6av2Cqhe4ZdKPjy19P4JZ3bRTNTJg12b7lQ5yxXFKhNx1fMS+BRz9yMXGThwc+cDCATopmJXDVfIJzQxbaGLbIxs0kGF7q4K5lDu5d4eBBrl3CPB78M8C49S4GcI/8ZfsXZyx7IIJuMKLMRv2JtBHCxp9TuJJkA+mkdEcK6/ansOGAj/I9Kazn3EZ+rz6QQvVBHwf+aFVuk5XGyFUOepMoN1XtEt+x1Ma+46GTyp9S5pbdpyZMBEpqPDP+4d4Uo+LgsQoXI8sdPL3ewzGKVdbspLH4uyRuZUT6zOggcRTqUQz1s9Ue7mf4dFuNd1VZTIrj7W+SaGgOcM9yG7GJFvoxFat2pwyp66dR8mUS/WdaOH/K6aRCC7Em5TiCRNP1VQvnvhJuztaCxNWH6+tPBOZmc7cnUfZDSOrzwvNrPSMgRS7akwtDLFKVTdEsnbwtioiLGKrCzLpoYwEPM5hC+4W3jghTQRoL65LmoLGXwwNL1YXGfx5iTQ5ZYMPy0jhKRwZ/BThEZR5jsT9R5ZobR5t1k9iLcTy8xoHnG96MpdFwMo2KfT5e2uzhvpUOrubhCqbEDUc2uSHuxcHBC3T6NHY1Bth5LMCepgCn3FDVkz4nMcMbEV7PMqo50spYvNXDzK/CVhiZxzyf5P44L6N0qK6VvjbEUYdSwfcrCSfUBFb/GObthU2u6TjD3rKx+VBIeIQRmUCFX8NI1TX4GPWxixsX2y17Imsm+UOrWVI8uDjaEEfk2cIaNJsqZZ3Knqt2TeOYV5vEk+tcDJzDDkXhSeF9SyyzRraW9R2bEGdu4xjBhvLG10ncucw2HS07VW2IsyHyS6nK8qwb9+TmLlR4lwyhxHUev/el8CLbUu/j9lIbo1nX41jTQxkNVUUuqdBhYuVYRJO3eLBNOpX/UAPt2e4mH7ctaZvbCP+I2KSB3Wv8Rg+PV7E3U7UjljpmjaxsJ0M9ngKcGA9BIeqhcVY31pjqUc1DQlOoVad6CBjj5VfsSnG/ZUroujdtIza1zIupF+3/VznuwRzL2VOfuqZ8irexhNiz1TAi2/+7j/e+T+IT9vDtRwMcpvKPx9MYXenSbzuqzkY+4u683fD3bdSydHaxxr/91UfNUR9b68M1sr2/BZjN9jmbNT3tC4/1H0IPElVJdtttl/gyEq+JiD8Lc6zwqr7lRGXUjb/7ZcopzVAvqmOOmVspX5AYhdxeL7RPPLe1jp9no9DGKMeaFxT+a1kykS2juM6ZfLqC8yEvsUj6s4vdvdzBMxs83ESRhN2tdY2+q/8O5ZtIZBVsIB0mzg1BBI2rN6tZqA5zy8EQ89Y3vBMSbzvs4xHmUunIXpcP8p33Za8jELH2DWS+9RSS4pX3M/nSvHnZa+/1tiOIyNWLw+fumf2IS/8qYubl+v94oVd+Wv7CGNnn33A2kE/5FkfLXxjzSdObxthKj+2tc8nlSz7H0LduGhrwN1fH/x1DJk9SAAAAAElFTkSuQmCC',
            host: ['fanyi.baidu.com'],
            popup: function (text) {
                open('http://fanyi.baidu.com/?aldtype=16047#en/zh/' + encodeURIComponent(text));
            }
        },
         {
            name: '知乎',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQ+SURBVEhLxVdbbFRVFL1qaiml+KINMUQqfkiELxON1iZG/TAxJn7xZTT6Y9IYFIIRa7XyECrlWaVBW0RTDKgRQ1GJqQpEIm9LrGJIBaNWneftdB7tMO3MLNc6t7fMTKdlUqfhpCvTzt7nrLPfp9bxvgSqNvpQvj6A2W9NL8QhLnFaVc0+lK3LrzgdEJc4rYksrWjyo2y9A/2eT2eqEKeVTzBLRMSd7wSxuDWImzc4F8mnO1WMI65oCmDGOj9q2238+GcCHacGMX+LbjnNxCKo2uDHThJqLfl4AFaDF9ZqxiUHM6lbTk/kk+VCupk844ivf9OPB9r70esdRngohe0nBvHC11Gs6MpGw6Eobm0OoJJhaDwcGyfPxOuUV7cEs8iziBXHUhI/uy9MW9PG4snWUx+FUL0pMPrX5OvBD0PGqLzEutG8zUHsPiM3p7G3J466LyM4+sew2XzgXBz130SxklhFK+7dYWPBZof473ASz30RybK07qsIznpGjLxmV39+4gqiZK0f9+3sx2A8hQv+EdS29cNa6cHbx5x4v7g/jJI1flzLmF23hqD+wq1BI+v+dxjWyzm58IoXe3++ZOQTEitJqhizlqMxo1jPuFbQA9YbPrSdHjLfLTsQYZk55absL2P2u8Q93hFYr/nGDjaHN/rw2bkCiOdtCuIZZvFjHSFU8hJqHiJ+v9shrvs8zMuMEnNPUYjdBqFmMZMHunUr4o6zDvHTn4YxizLpFo1YkCWKm/UqY+ViuQftZxzimtGYW/WjMhIVwWLHgiV7Bqh25VLSOtJ7CXPoGa0pE6uUFmwLouvXuFEsbKVxAz2k9b9cLXLFdMzNLIfZLJsjFxJm8/yt3KCSceV0eVFinAspPsK6vhgYgSeUwl3bbfOdwlLU5MqFxWZR1xnGUCKNY78n8OQnYdOblfFFq+NcKMNLGb/WE05G9/qT5rPpu5hpLCKfFuISKtW8Z6PnH/bpdBo7jg+ib8AhX9oZMW1Tc9slNi2TOaE8EcE1hbbMTKiLlfPQtbROq/uvBO4gwVK6PZViqfHn0Q9Y06svE3ujKTy+J4Qbue8hkixjyy1oSLhQ7DQsHqbibxwUWo3fRs1TaAZjvu175zInL/KlSNcuYgm6yxdJoplTy92XuSYdi4JcfDsP6/zFqefznmHc32ab7+XaOdTpOh9HkGNQxHPZ0xsOxdB60plgWnY0iS0/xIzVBT0E9AiYuzGAXaedQ9LJNJZzHiuZzAOQOrrAQj4CW3iYsl5JpiS6+10bYBhO8Z32xO6Q8ZC16vKIzCQVxoglkKX7fnKyuM9O4qWDEVTyIppSmZvkstv4AFAuuHurGevn90ewqNVGGeW5RLkYI5ZFt9Bt99CttYzvYh6gSaWSUbPI3CS4pII72W4iSqWfIZsIWQ96kSuOcrk+9Xc+0nwQmRuOK8E86K/avzBX55+2BP4DcovUl93kjrAAAAAASUVORK5CYII=',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(text));
            }
        },
        {
            name: '豆瓣',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAL9SURBVEhLxVdbSBRRGD4VpakZUeRS0UMvBkIFXehCEhlG+FJY9NZLRhQlZVphyRJ2o7LU3cBK80EIigKJHqzoroIRQRRRkNlKJJqW91gIv/7vOGMzzrRUs1s/fOzZf77Lzu6Zc86qxtBTxBemQBUkQx2YEltIBrOYqeIKfVD5Se7EWECydKbtTvdPhtqXAJU3MbqgJ73NHGZaQyfI17CgNF1jfunKqMD0o7ctfGQgn2reuRWIVdFb37lbcNrZZQYt+kVv9+D8SUgpTkV5/QUEGysRaLgYFdCLnvRmhjPYCFe5Y6B2KqgcwVaPoAe96GkNJWxviPxEpJ5ZgpLHQZz3cOfU0oNe9HTkOBp747Du8ibjl/Fe9KKnI8fRENKayg3oD/dr4UB4EA+an+Dai1rceHkzIsghlxoWPej1V8GhL61YW7URiUUzMfXInIggh1xqWJ6C33e1YHEgA2rP+OEJEgnCIZcalqfglq4PWBrMHF76RnNHQzjkUsPyFPyusxlpJcuhdshjsVsei0gQDrnUsDwFdw/2oub5VRy/X4JTD8sighxyqWH9cXBmVTbC38Na7KXoQa/fC5bfKb0iC6/b36D7Ww8wZLhItfd14FNPG9p6221gj9dGSjTU0oNervPD0SBI3Ka0qPXrR8NrCAvLV+m9dNzBaTawx2vksKjRgeLxy0np2iTkpOA7Ohd1b+9pM1bO9dzhTZwnFr5axrxmFjXURjzZuDYJbtp58SirrzDsgNpXt/QioQrkmTV5MmaP18yihlrbxj8atjdcBHLH/sR2heyaLejo+6wNB8IDSPbPhtrFHcfgyJg9XmORSw21Ni96W7OsoT7ZM08/CsB/96RGYV0xqp9dQWd/lzZlcec5fPsY/HdOaHDMnlnkUkOt6UNPetvCRwYyCRaVrzbk0S962yaaNZjrbKxKr/euwTIzk4pmIat6MzIurY8q6Elv/RQ4go1wvcrEAtZQwtH4F2Dm//kLI4f7hlCTnPKnO7+KWEAyEg7NQH2oCT8Abq/6YUUWn/EAAAAASUVORK5CYII=',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://www.douban.com/search?source=suggest&q=' + encodeURIComponent(text));
            }
        },
        {
            name: '胖鸟电影',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASzSURBVEhLpVdrbxRVGN7/4gc1UGnRWsEgYLygJgYFjIYYxcRPxgtK0EisHzQxEmNMMPESGlpKaVGKQEWxFy2XqljatGhbEaxcgjt7v3e7u915fJ8zc9rZ2WmYrSd5MrNnznmf817PuwHIGAkWseV4FHceMHDXgRAaO0Ly5Luh5qx5Y35ez7mh17hBmSvbDWz9LoaJaImUCPxmFNAkH+vaKkkpqEF+1++XTdwov4kGEcC5+v18OmEJ1wdwH4Kyl7cFsaYrjIlYEYFNoilJnYso/LFvIvh4JI32iSz2XsjgqZ4olrUaeLE3jlaZ2/dHJVoELw8ksILkAi9yYllrENtOxhCgFlpTjTtEAxIYubIyC8fxyzNoHkrhlxuz9kz1GA0V8P65NF7qj+OegyFb+0rZ2uwB9weCxNtOxjGdnLNFVo5Yvozef2bQfzWPAUF8duGAHH/FS3jtpwRW2eRu+eQMuCeJxYinUyWMhYr4fDyj3MG11Gzv71k1fy1tBQ7HkFjmke6okuWWT9REvGc0gwcPh3HfIQkuIVaBJljdGcKG7jBa5AB6/Clav/LjgsndHD6JTSTEvDtPJ9U3knGdFnhvl+yRAG3+OYmUMruJOXmcup7HE8ei8+ud8EU8Z5r4bCyDBw5HhMxKN2KFrNs+mESf+Pm572NY/5VoPZ5T6zno602SDbdLNqhAc3D4Iy6beH1QUkVyVacIBfEQjGSOE9MzqGsN4Y3+FEq2oUj8al8cTx+NYK1YRR3Y5vBN/KaYeWV7JTELTN+VvFrDgKsTzXYOpFG0iWdLJq4mSvjoXAprJA6cWi+ZmE8G10bRZtfZBNaJmZWfz6SUf/XolYM91B1BncjUe4klExN8t0wu5VQOQQu892sKZdvHDLJJKY+fSAXceCSi1uu6UYOP4xU+1rCEWeSs1+8OJeaJMwUTRyaz2PFDDA+LjxtrJRZXYfdwWhV45Sd7swZ/c37toTA+HcvOR/XFWAlP9kRwq/jeKs0Ce48vYj0+FPJ6MbcS0mFrLu9WFTNUgXGOYWMWvIR4ezlJiZqIdw9n0CSV6G5ZQzL6lSDp6k5LWz3OG0UhjYh7glUWImoivpKaw4VIAV+MZ+1AC6mLgFfieKSI6xm93sTZGwU8KgHFSPfi8EnMEmjCtH0XzJbRPpVDp6DrYg5hx/XJHL6ULOGdoaSq6XSLF4cvYkbp4LU8vpSGYEQ6Fq/BI01ESmibzOHtM0klx6tGa/gittIpgVtagnLJJ9Dzdx7HpDHQYJNw9FIeO04lcNu+oKrhKvg8fKvhm5g3UwPzWL4zuNx7OEcyK92I6jVO+CbWlUtXKS+w1/KS54VFiV9YhJjaeO2pFZ7EyyUFnpUe+LLcLJp4u/RQXiVzqahq9mjKRsnNt04n8K+dl4zqPaNp3P81G4Gb++9m4P6q9pYpsFnK3HlX2hTkrmuW3NQdiFNQLSAX4yFAEmdDz7r6zLdRTMWLirAohKU5q3B8ID3z/yVWDb20SYERaV2aOsLq7wVPQ1OuOhjG43LBb+mJYbP0TATf14upmTJLIaZskq6TG2xSlFJ/2sbCRWw9EVu4ugS8BFgInPCbo25wPeU9L5pOyVUJAP8Bkzq6lznKDy0AAAAASUVORK5CYII=',
            host: ['www.pniao.com'],
            popup: function (text) {
                open('http://www.pniao.com/Mov/so/' + encodeURIComponent(text));
            }
        },
        {
            name: '网页翻译',
            image: 'data:image/png;base64,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0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABAwSURBVHgBACAQ3+8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+be44vemp/ntJyzp6xYb6OwhJujsIyjo7CEn6O45Puj829zv//r72PzU1gj3o6UJ+r/B5fivsfntJyzp6xYb6OwhJujsIifo7S807+0xNtb///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+Kms4vejpf/tKy//6xUa/+whJv/sIyj/7CAm/+44Pf/829z///z8+fzS0wv2l5kJ+bS35fitr//tKzD/6xUa/+whJv/sIif/7S4z/+0wNfj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+srMAPaZmxrsFxzp7B0i/+whJv/sIyj/6xAV/+0pLf/82tz///j5+fzX2Bb5t7kA+9HTAPedoBrsFhzp7B0i/+whJv/sISb/7B8k/+wfJOf///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////APrFxhrrFBjp7Bsg/+wiJ//sIyj/6xAW/+4xNP797O30/u7v2P3l5hX/+PgA////APrDwxrrExnp7Bsg/+wiJ//sISb/7CEm/+whJuj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/vf21v3o5/TtLTL+6xAV/+wiJ//sIyf/7TM3/+wjKOr5ubon////C/3g3wD96ekU/vj32P3o5/TtLTL+6xAV/+whJv/sIif/7jk9/+48QOj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/vb1+Pze3f/tKS//6xIX/+wgJf/sIib/70NH/+41OejtLTMF+sHDAP7v8AD95OQY/vb1+vze3f/tKi//6xIX/+wgJf/sIif/7kBD/+5DR+j///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OLj5/rMzf/tKS7/6xQZ/+wcIf/sJSn/82tu//N6ferxXWAW8m5xAPzP0AD709QV/N7e6frIyv/tKS3/6xQZ/+weJP/sIyn/8VFU//FXWuj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/N/g6PrJyv/tKS7/6xQZ/+wcIf/sJSr/83Z5//OChOrzcnUW83x/APvExgD7yMkW/NfY6vrCxP/tKS3/6xQZ/+weI//sIyn/8Vxe//FjZej///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/Nvc6PrGyP/tKS3/6xUa/+sYHf/sJiv/95yf//iqrej2nqEG+b2/APvMzQD5ubsG+sPF6PiytP/tJyz/6xYc/+saH//sJSr/9YaI//aSlOj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/Nna6PrExv/tKS3/6xUa/+sZHv/sJiv/9pWY//ijpur6x8kl+tHTDfvPzw36yssl+ru86virrP/tJyz/6xYc/+saH//sJiv/9ZGT//agouj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+8zO6Pm5u//tKC3/6xUa/+wfJP/sJCn/70VJ//JbX/77z9Ht/N7f5/ze3ef82dnt+bS1/vedn//tJyz/6xgd/+sWG//tJyz/+K2w//q/wej///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+83P5/m6vP/tKS7/6xYb/+wfJP/sJCn/7jg8//BLT//5ur3/+srL//rIyf/6w8T/95+i//aMj//tJiv/6xkf/+sWG//tKSz/+Le6//rKzOf///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OHi+PrKy//sHSL/6gcM/+wiJ//sIif/7CMo/+wkKf/tKC3/7Sgt/+0mK//tJiv/7SYr/+wnK//sISb/7CIn/+sPFP/tJyv//NfZ//7w8fj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OLi1vrP0fTuMTX87Bke/+wkKf/sISb/7B4k/+wdIv/rFBr/6xMZ/+sUGv/rFRr/6xYc/+sYHf/sISb/7CQp/+sSGP/uMjf+/u3v9P709db///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+97fCvrMzSn5t7j696iq/+0oLf/rFxz/7CQo/+wiJ//sISb/7CQo/+4+Qv/uPkL/7CMo/+wgJf/sHyT/7CIn/+88Qf/uMDXq+bu9J////wr///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+s/QAPq8vgX7ysvZ+ba48uoIDeroAADq6gkO6uoKEOrsGB3n7B8k7e5ARP7uQUT/7CIn/+wfJP/sHiP/7CMo//FTV//wSUzn70JGBfrHyQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9Y2PAPikpgD6wsMG+bW4C/BYWQjvTU0I70dMCO9CRwjtKCwC7SswGe5DR+nuP0P/7CIn/+wgJf/rFBn/7CQp//ego//5trj695mbGPihpAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A83h6EvN9fxf6xMYJ+tPVCP7+/wj+/f4I/NHTCPq8vQjuTVEC7Tk9Ge4/Q+nuOz//7CIn/+whJv/rFhv/7S0x/Pm3ufT6vb7Y+bO1FfiusAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9YWH2fWOj/L70dLq+9rb6vvZ2ur709Xq+bK06vefourvR0vn7TY67ewkKf7sICX/7Bsg/+wfJP/wRUn/7z9D+vaVlyn7xsgL+KaoAfiqrAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9Hp89/SChP/5vb//+cXG//nCw//5vL7/96Ci//WPkv/vQ0f/7jQ4/+wiJ//sHiP/7B8k/+wlKvzwTlL08EhM1u9ARAX2mZwA+bK0APirrQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7CQp5+wlKf/tKC3/7Sgu/+0oLf/tKC3/7Scs/+wmK//sICX/7B4j/+sTGP/rFx3/8EdL//BOUvrwSk4p8E5SC+8/RAPwTlIA+KmrAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A6xog5+saH//rFBr/6xQZ/+sUGf/rFBr/6xcc/+sYHf/sICX/7CIn/+0lKf/sJir870NH9PBSV9bwS08F8EtPAPBJTgDwUVUA+KSmAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7TA1+O0uM//sIyj/7CIm/+wjJ//sIyf/7B8k/+wkKf/vQUX/8FFU//ejpf/5urv68V5iKe4xNwvwUFQD8EtPAPBITQDwU1cA+KWnAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7TE21u0vNO/sIifo7CAl6OwhJujsISbo7B0i6OwkKejvRUjo8Vda6Pmwsu/7x8jW+be5BPFZXQDvQkcA8EtPAPBITQDwU1cA+KWnAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wABAAD//0g7BbNQ5imLAAAAAElFTkSuQmCC',
            host: ['fanyi.myyoudao.com'],
            popup: function (text) {
                var urlbar="http://fanyi.myyoudao.com/WebpageTranslate?keyfrom=webfanyi.top&url="+window.location.href+"&type=EN2ZH_CN";
                window.open(urlbar, "_blank");
            }
        },


    ], hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });
    var text = GM_getValue('search');
    if (text && window.location.host in hostCustomMap) {
        keyword.beforeCustom(hostCustomMap[window.location.host]);
    }
    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {
                keyword.beforePopup(obj.popup);
        });
        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:22px!important;' +
            'height:22px!important;' +
            'border:0!important;' +
            'background-color:rgba(255,255,255,1)!important;' +
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:5px!important;' +
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +
        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
        }
    });
    // 选中变化事件：
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });
    // 鼠标事件
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
            return;
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY +40 + 'px';
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
        }
    });



    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }

    /**在新标签页中打开*/
    function open(url) {
        var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
        return win;
    }

})();