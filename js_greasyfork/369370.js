// ==UserScript==
// @name         划词搜索（pc版）
// @version      1
// @namespace    http://tampermonkey.net/
// @description  划词搜索，快速选择搜索引擎，一键搜索，跳转百度，谷歌，必应等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       Sirius
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/369370/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88pc%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/369370/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88pc%E7%89%88%EF%BC%89.meta.js
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
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABAwSURBVHgBACAQ3+8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+be44vemp/ntJyzp6xYb6OwhJujsIyjo7CEn6O45Puj829zv//r72PzU1gj3o6UJ+r/B5fivsfntJyzp6xYb6OwhJujsIifo7S807+0xNtb///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+Kms4vejpf/tKy//6xUa/+whJv/sIyj/7CAm/+44Pf/829z///z8+fzS0wv2l5kJ+bS35fitr//tKzD/6xUa/+whJv/sIif/7S4z/+0wNfj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+srMAPaZmxrsFxzp7B0i/+whJv/sIyj/6xAV/+0pLf/82tz///j5+fzX2Bb5t7kA+9HTAPedoBrsFhzp7B0i/+whJv/sISb/7B8k/+wfJOf///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////APrFxhrrFBjp7Bsg/+wiJ//sIyj/6xAW/+4xNP797O30/u7v2P3l5hX/+PgA////APrDwxrrExnp7Bsg/+wiJ//sISb/7CEm/+whJuj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/vf21v3o5/TtLTL+6xAV/+wiJ//sIyf/7TM3/+wjKOr5ubon////C/3g3wD96ekU/vj32P3o5/TtLTL+6xAV/+whJv/sIif/7jk9/+48QOj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/vb1+Pze3f/tKS//6xIX/+wgJf/sIib/70NH/+41OejtLTMF+sHDAP7v8AD95OQY/vb1+vze3f/tKi//6xIX/+wgJf/sIif/7kBD/+5DR+j///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OLj5/rMzf/tKS7/6xQZ/+wcIf/sJSn/82tu//N6ferxXWAW8m5xAPzP0AD709QV/N7e6frIyv/tKS3/6xQZ/+weJP/sIyn/8VFU//FXWuj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/N/g6PrJyv/tKS7/6xQZ/+wcIf/sJSr/83Z5//OChOrzcnUW83x/APvExgD7yMkW/NfY6vrCxP/tKS3/6xQZ/+weI//sIyn/8Vxe//FjZej///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/Nvc6PrGyP/tKS3/6xUa/+sYHf/sJiv/95yf//iqrej2nqEG+b2/APvMzQD5ubsG+sPF6PiytP/tJyz/6xYc/+saH//sJSr/9YaI//aSlOj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/Nna6PrExv/tKS3/6xUa/+sZHv/sJiv/9pWY//ijpur6x8kl+tHTDfvPzw36yssl+ru86virrP/tJyz/6xYc/+saH//sJiv/9ZGT//agouj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+8zO6Pm5u//tKC3/6xUa/+wfJP/sJCn/70VJ//JbX/77z9Ht/N7f5/ze3ef82dnt+bS1/vedn//tJyz/6xgd/+sWG//tJyz/+K2w//q/wej///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+83P5/m6vP/tKS7/6xYb/+wfJP/sJCn/7jg8//BLT//5ur3/+srL//rIyf/6w8T/95+i//aMj//tJiv/6xkf/+sWG//tKSz/+Le6//rKzOf///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OHi+PrKy//sHSL/6gcM/+wiJ//sIif/7CMo/+wkKf/tKC3/7Sgt/+0mK//tJiv/7SYr/+wnK//sISb/7CIn/+sPFP/tJyv//NfZ//7w8fj///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A/OLi1vrP0fTuMTX87Bke/+wkKf/sISb/7B4k/+wdIv/rFBr/6xMZ/+sUGv/rFRr/6xYc/+sYHf/sISb/7CQp/+sSGP/uMjf+/u3v9P709db///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+97fCvrMzSn5t7j696iq/+0oLf/rFxz/7CQo/+wiJ//sISb/7CQo/+4+Qv/uPkL/7CMo/+wgJf/sHyT/7CIn/+88Qf/uMDXq+bu9J////wr///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A+s/QAPq8vgX7ysvZ+ba48uoIDeroAADq6gkO6uoKEOrsGB3n7B8k7e5ARP7uQUT/7CIn/+wfJP/sHiP/7CMo//FTV//wSUzn70JGBfrHyQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9Y2PAPikpgD6wsMG+bW4C/BYWQjvTU0I70dMCO9CRwjtKCwC7SswGe5DR+nuP0P/7CIn/+wgJf/rFBn/7CQp//ego//5trj695mbGPihpAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A83h6EvN9fxf6xMYJ+tPVCP7+/wj+/f4I/NHTCPq8vQjuTVEC7Tk9Ge4/Q+nuOz//7CIn/+whJv/rFhv/7S0x/Pm3ufT6vb7Y+bO1FfiusAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9YWH2fWOj/L70dLq+9rb6vvZ2ur709Xq+bK06vefourvR0vn7TY67ewkKf7sICX/7Bsg/+wfJP/wRUn/7z9D+vaVlyn7xsgL+KaoAfiqrAD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A9Hp89/SChP/5vb//+cXG//nCw//5vL7/96Ci//WPkv/vQ0f/7jQ4/+wiJ//sHiP/7B8k/+wlKvzwTlL08EhM1u9ARAX2mZwA+bK0APirrQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7CQp5+wlKf/tKC3/7Sgu/+0oLf/tKC3/7Scs/+wmK//sICX/7B4j/+sTGP/rFx3/8EdL//BOUvrwSk4p8E5SC+8/RAPwTlIA+KmrAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A6xog5+saH//rFBr/6xQZ/+sUGf/rFBr/6xcc/+sYHf/sICX/7CIn/+0lKf/sJir870NH9PBSV9bwS08F8EtPAPBJTgDwUVUA+KSmAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7TA1+O0uM//sIyj/7CIm/+wjJ//sIyf/7B8k/+wkKf/vQUX/8FFU//ejpf/5urv68V5iKe4xNwvwUFQD8EtPAPBITQDwU1cA+KWnAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A7TE21u0vNO/sIifo7CAl6OwhJujsISbo7B0i6OwkKejvRUjo8Vda6Pmwsu/7x8jW+be5BPFZXQDvQkcA8EtPAPBITQDwU1cA+KWnAPivsQD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wABAAD//0g7BbNQ5imLAAAAAElFTkSuQmCC',
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